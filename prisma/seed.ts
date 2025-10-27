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

            // Step 1: Cache genre translations upfront to avoid repeated API calls
            await runSpan(transactionLogger, 'Genre translations caching', 'db', async () => {
                await cacheGenreTranslations();
            });

            // Add delay to let connections settle
            await wait(SEED_CONFIG.DB_OPERATION_DELAY);

            // Step 2: Fetch now-playing movies
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
                Sentry.withScope((scope) => {
                    scope.setLevel('warning');
                    scope.setTag('job', 'catalog-refresh');
                    scope.setContext('refresh', refreshContext);
                    Sentry.captureMessage('catalog.refresh.no_results');
                });
                return;
            }

            transactionLogger.info(`Found ${nowPlaying.results.length} movies to process`);

            // Step 3: Process basic movie data with reduced concurrency
            const movieDataList = await runSpan(
                transactionLogger,
                'Processing movie data in parallel',
                'job.step',
                async () => {
                    transactionLogger.info('Processing movie data with controlled concurrency');
                    return Bluebird.map(
                        nowPlaying.results,
                        async (movie, index) => {
                            if (index > 0) {
                                await wait(SEED_CONFIG.DB_OPERATION_DELAY / 2);
                            }
                            return processMovieData(movie, dal, MovieStatus.NOW_PLAYING);
                        },
                        { concurrency: SEED_CONFIG.MOVIE_PROCESSING_CONCURRENCY },
                    );
                },
            );

            // Filter out null results and add delay
            const validMovieData = movieDataList.filter((data): data is MovieData => data !== null);

            if (!validMovieData.length) {
                const totalDuration = Date.now() - totalStartTime;
                transactionLogger.info('All movies already exist in database. Catalog refresh complete!');
                transactionLogger.info(`Total time: ${formatDuration(totalDuration)}`, { durationMs: totalDuration });
                return;
            }

            transactionLogger.info(`Processing ${validMovieData.length} new movies...`);
            await wait(SEED_CONFIG.DB_OPERATION_DELAY);

            // Step 4: Process all translations with controlled concurrency
            await runSpan(transactionLogger, 'Processing movie translations', 'job.step', async () => {
                transactionLogger.info('Processing movie translations');
                await Bluebird.map(
                    validMovieData,
                    async (movieData, index) => {
                        if (index > 0) {
                            await wait(25); // Small delay between translations
                        }
                        return processMovieTranslations(movieData, dal);
                    },
                    { concurrency: SEED_CONFIG.TRANSLATION_PROCESSING_CONCURRENCY },
                );
            });

            await wait(SEED_CONFIG.DB_OPERATION_DELAY);

            // Step 5: Process genres with controlled concurrency
            await runSpan(transactionLogger, 'Processing movie genres', 'job.step', async () => {
                transactionLogger.info('Processing movie genres');
                await Bluebird.map(
                    validMovieData,
                    async (movieData, index) => {
                        if (index > 0) {
                            await wait(50); // Delay between genre processing
                        }
                        return processMovieGenres(movieData, dal);
                    },
                    { concurrency: SEED_CONFIG.GENRE_PROCESSING_CONCURRENCY },
                );
            });

            await wait(SEED_CONFIG.DB_OPERATION_DELAY);

            // Step 6: Process trailers with controlled concurrency
            await runSpan(transactionLogger, 'Processing movie trailers', 'job.step', async () => {
                transactionLogger.info('Processing movie trailers');
                await Bluebird.map(
                    validMovieData,
                    async (movieData, index) => {
                        if (index > 0) {
                            await wait(25); // Small delay between trailers
                        }
                        return processMovieTrailers(movieData, dal);
                    },
                    { concurrency: SEED_CONFIG.TRAILER_PROCESSING_CONCURRENCY },
                );
            });

            await wait(SEED_CONFIG.DB_OPERATION_DELAY * 2); // Longer delay before actors

            // Step 7: Process actors sequentially (most DB intensive)
            await runSpan(transactionLogger, 'Processing movie cast', 'job.step', async () => {
                transactionLogger.info('Processing movie cast with connection management');
                await batchProcessActors(validMovieData, dal);
            });

            const totalDuration = Date.now() - totalStartTime;
            transactionLogger.info(
                `Catalog refresh complete. Processed ${validMovieData.length} movies successfully.`,
                { processedCount: validMovieData.length },
            );
            transactionLogger.info(`Finished at: ${new Date().toISOString()}`);
            transactionLogger.info(`Total catalog refresh time: ${formatDuration(totalDuration)}`, {
                durationMs: totalDuration,
            });
            transactionLogger.info(`Average time per movie: ${formatDuration(totalDuration / validMovieData.length)}`, {
                durationMs: totalDuration / validMovieData.length,
            });
        } catch (error) {
            const totalDuration = Date.now() - totalStartTime;
            transactionLogger.error('Catalog refresh failed', error as Error);
            transactionLogger.info(`Failed after: ${formatDuration(totalDuration)}`, {
                durationMs: totalDuration,
            });
            throw error;
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
