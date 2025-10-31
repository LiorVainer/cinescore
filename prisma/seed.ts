import { createDALs } from '@/dal';
import { tmdb } from '@/lib/clients';
import { prisma } from '@/lib/prisma';
import { PrismaService } from '@/lib/prismaService';
import { logger } from '@/lib/sentry/logger';
import { withSentrySpan } from '@/lib/sentry/withSpan';
import { MovieStatus } from '@prisma/client';
import { withSentryTransaction } from '@/lib/sentry/withTransaction';
import * as Sentry from '@sentry/nextjs';
import Bluebird from 'bluebird';

// Import our optimized processors
import {
    type MovieData,
    processMovieData,
    processMovieTrailers,
    processMovieTranslations,
} from './seeders/movie-processor';
import { cacheGenreTranslations, processMovieGenres } from './seeders/genre-processor';
import { batchProcessActors } from './seeders/actor-processor';
import { SEED_CONFIG } from './seeders/seed-config';
import { sendCatalogRefreshEmail } from '@/lib/email/sendCatalogRefreshEmail';

type ScopedLogger = ReturnType<typeof logger.scope>;
type CatalogRefreshOptions = {
    wrapWithTransaction?: boolean;
};

const prismaService = new PrismaService(prisma);
const dal = createDALs(prismaService);

// Utility function to format duration
function formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }

    if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }

    return `${seconds}s`;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function runSpan<T>(log: ScopedLogger, description: string, op: string, operation: () => Promise<T>): Promise<T> {
    return withSentrySpan(op, description, async () => {
        const startTime = Date.now();
        log.info(`Starting: ${description}`);
        Sentry.logger.info(`catalog.span.start.${op}`, { description });

        try {
            const result = await operation();
            const duration = Date.now() - startTime;
            log.info(`Completed: ${description} (${formatDuration(duration)})`, { durationMs: duration });
            Sentry.logger.info(`catalog.span.complete.${op}`, { description, durationMs: duration });
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            log.error(`Failed: ${description} (${formatDuration(duration)})`, error as Error);
            Sentry.logger.error(`catalog.span.failed.${op}`, {
                description,
                durationMs: duration,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    });
}

export async function refreshNowPlayingCatalog(options: CatalogRefreshOptions = {}): Promise<void> {
    const { wrapWithTransaction = true } = options;
    const transactionLogger = logger.scope('catalog-refresh:now-playing');

    const executeSeed = async () => {
        const totalStartTime = Date.now();
        const refreshContext = {
            startedAt: new Date().toISOString(),
            source: 'catalog-refresh',
        };

        let success = false;
        let processedCount = 0;
        let errorMessage: string | undefined;
        let totalDuration = 0;

        try {
            transactionLogger.info('Starting daily catalog refresh process...');
            transactionLogger.info(`Started at: ${new Date().toISOString()}`);
            Sentry.logger.info('catalog.refresh.start', refreshContext);
            Sentry.withScope((scope) => {
                scope.setLevel('info');
                scope.setTag('job', 'catalog-refresh');
                scope.setContext('refresh', refreshContext);
                Sentry.captureMessage('catalog.refresh.start');
            });

            // Step 1: Cache genre translations
            await runSpan(transactionLogger, 'Genre translations caching', 'db', async () => {
                await cacheGenreTranslations();
            });

            await wait(SEED_CONFIG.DB_OPERATION_DELAY);

            // Step 2: Fetch now-playing
            const nowPlaying = await runSpan(transactionLogger, 'Fetching now-playing movies', 'external', async () => {
                transactionLogger.info('Fetching now-playing movies from TMDB');
                return tmdb.movies.nowPlaying({
                    language: SEED_CONFIG.DEFAULT_LANGUAGES.PRIMARY,
                    region: SEED_CONFIG.TMDB_REGION,
                });
            });

            if (!nowPlaying.results?.length) {
                transactionLogger.warn('No movies found in TMDB feed.');
                Sentry.logger.warn('catalog.refresh.no_results', { source: 'tmdb.now_playing' });
                return; // no data case → email will still be sent via finally
            }

            transactionLogger.info(`Found ${nowPlaying.results.length} movies to process`);

            // Step 3: Process base movie data
            const movieDataList = await runSpan(transactionLogger, 'Processing movie data', 'job.step', async () =>
                Bluebird.map(
                    nowPlaying.results,
                    async (movie, index) => {
                        if (index > 0) await wait(SEED_CONFIG.DB_OPERATION_DELAY / 2);
                        return processMovieData(movie, dal, MovieStatus.NOW_PLAYING);
                    },
                    { concurrency: SEED_CONFIG.MOVIE_PROCESSING_CONCURRENCY },
                ),
            );

            const validMovieData = movieDataList.filter((data): data is MovieData => data !== null);

            if (!validMovieData.length) {
                transactionLogger.info('All movies already exist in DB.');
                success = true;
                return;
            }

            processedCount = validMovieData.length;

            // Step 4–7: Process all steps (translations, genres, trailers, actors)
            await runSpan(transactionLogger, 'Processing movie translations', 'job.step', async () => {
                await Bluebird.map(
                    validMovieData,
                    (m, i) => (i > 0 ? wait(25) : Promise.resolve()).then(() => processMovieTranslations(m, dal)),
                    {
                        concurrency: SEED_CONFIG.TRANSLATION_PROCESSING_CONCURRENCY,
                    },
                );
            });

            await wait(SEED_CONFIG.DB_OPERATION_DELAY);

            await runSpan(transactionLogger, 'Processing movie genres', 'job.step', async () => {
                await Bluebird.map(
                    validMovieData,
                    (m, i) => (i > 0 ? wait(50) : Promise.resolve()).then(() => processMovieGenres(m, dal)),
                    {
                        concurrency: SEED_CONFIG.GENRE_PROCESSING_CONCURRENCY,
                    },
                );
            });

            await wait(SEED_CONFIG.DB_OPERATION_DELAY);

            await runSpan(transactionLogger, 'Processing movie trailers', 'job.step', async () => {
                await Bluebird.map(
                    validMovieData,
                    (m, i) => (i > 0 ? wait(25) : Promise.resolve()).then(() => processMovieTrailers(m, dal)),
                    {
                        concurrency: SEED_CONFIG.TRAILER_PROCESSING_CONCURRENCY,
                    },
                );
            });

            await wait(SEED_CONFIG.DB_OPERATION_DELAY * 2);

            await runSpan(transactionLogger, 'Processing movie cast', 'job.step', async () => {
                await batchProcessActors(validMovieData, dal);
            });

            totalDuration = Date.now() - totalStartTime;
            transactionLogger.info(`Catalog refresh complete. Processed ${processedCount} movies.`, { processedCount });

            success = true;
        } catch (error) {
            totalDuration = Date.now() - totalStartTime;
            success = false;
            errorMessage = error instanceof Error ? error.message : String(error);

            transactionLogger.error('Catalog refresh failed', error as Error);
            transactionLogger.info(`Failed after: ${formatDuration(totalDuration)}`, { durationMs: totalDuration });

            throw error; // still rethrow for Sentry + cron status
        } finally {
            try {
                await sendCatalogRefreshEmail({
                    success,
                    processedCount,
                    durationMs: totalDuration,
                    errorMessage,
                });
                transactionLogger.info(`Sent catalog refresh email (${success ? 'success' : 'failure'})`);
            } catch (emailError) {
                transactionLogger.error('Failed to send catalog refresh email', emailError as Error);
            }

            transactionLogger.info(`Job finished at: ${new Date().toISOString()}`);
            totalDuration = Date.now() - totalStartTime;
            transactionLogger.info(`Total duration: ${formatDuration(totalDuration)}`, {
                durationMs: totalDuration,
            });
        }
    };

    if (wrapWithTransaction) {
        await withSentryTransaction('catalog:refresh:nowPlaying', executeSeed, { op: 'job' });
        return;
    }

    await executeSeed();
}

// Utility function for targeted refresh
export async function refreshSpecificMovie(tmdbId: number, options: CatalogRefreshOptions = {}): Promise<void> {
    const { wrapWithTransaction = true } = options;
    const transactionLogger = logger.scope('catalog-refresh:specific');

    const executeSeed = async () => {
        const startTime = Date.now();

        try {
            transactionLogger.info(`Refreshing specific movie: ${tmdbId}`);
            transactionLogger.info(`Started at: ${new Date().toISOString()}`);

            await runSpan(transactionLogger, 'Genre translations caching', 'db', async () => {
                await cacheGenreTranslations();
            });

            const movieDetails = await runSpan(
                transactionLogger,
                `Fetching movie details for ${tmdbId}`,
                'external',
                async () => tmdb.movies.details(tmdbId),
            );

            const movieData = await runSpan(transactionLogger, 'Processing movie data', 'job.step', async () =>
                processMovieData(movieDetails, dal, MovieStatus.NOW_PLAYING),
            );

            if (!movieData) {
                transactionLogger.info('Movie already existed with no updates detected');
                return;
            }

            // Process all aspects of the movie
            await runSpan(transactionLogger, 'Processing movie aspects', 'job.step', async () => {
                await Bluebird.all([
                    processMovieTranslations(movieData, dal),
                    processMovieGenres(movieData, dal),
                    processMovieTrailers(movieData, dal),
                ]);
            });

            await runSpan(transactionLogger, 'Processing movie actors', 'job.step', async () => {
                await batchProcessActors([movieData], dal);
            });

            const totalDuration = Date.now() - startTime;
            transactionLogger.info(`Successfully refreshed movie: ${movieData.title}`);
            transactionLogger.info(`Finished at: ${new Date().toISOString()}`);
            transactionLogger.info(`Total time: ${formatDuration(totalDuration)}`, { durationMs: totalDuration });
        } catch (error) {
            const totalDuration = Date.now() - startTime;
            transactionLogger.error(`Failed to refresh movie ${tmdbId}`, error as Error);
            transactionLogger.info(`Failed after: ${formatDuration(totalDuration)}`, {
                durationMs: totalDuration,
            });
            throw error;
        }
    };

    if (wrapWithTransaction) {
        await withSentryTransaction(`catalog:refresh:${tmdbId}`, executeSeed, { op: 'job' });
        return;
    }

    await executeSeed();
}

// Run as a script
if (require.main === module) {
    const cliLogger = logger.scope('catalog-refresh:cli');

    refreshNowPlayingCatalog()
        .then(async () => {
            cliLogger.info('Disconnecting from database...');
            await prisma.$disconnect();
        })
        .catch(async (err) => {
            cliLogger.error('Daily catalog refresh failed', err as Error);
            await prisma.$disconnect();
            process.exit(1);
        });
}
