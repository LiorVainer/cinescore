import { tmdb } from '@/lib/clients';
import { Language, Prisma } from '@prisma/client';
import Bluebird from 'bluebird';
import type { DAL } from '@/dal';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/sentry/logger';
import { withSentrySpan } from '@/lib/sentry/withSpan';
import { SEED_CONFIG } from './seed-config';

import type { Movie, MovieDetails, Video, ExternalIds } from 'tmdb-ts';

type TmdbVideosResponse = {
    results: Video[];
};

type TmdbCreditsResponse = {
    cast: Array<{
        id: number;
        name: string;
        character: string;
        order: number;
        profile_path: string | null;
        popularity: number;
    }>;
};

export type MovieData = {
    id: number;
    title: string;
    imdbId: string;
    tmdbId: number;
    baseMovie: Prisma.MovieGetPayload<{}>;
    detailsEn: MovieDetails;
    detailsHe: MovieDetails;
    videos: TmdbVideosResponse;
    credits: TmdbCreditsResponse;
};

export type MovieProcessInput = Pick<Movie, 'id' | 'title'>;

const movieDataLogger = logger.scope('processor:movie-data');
const movieTranslationsLogger = logger.scope('processor:movie-translations');
const movieTrailersLogger = logger.scope('processor:movie-trailers');

export async function processMovieData(movie: MovieProcessInput, dal: DAL): Promise<MovieData | null> {
    const spanMetadata = {
        tmdbId: movie.id,
        title: movie.title,
    };

    return withSentrySpan(
        'processor.movie.data',
        `Process movie data ${movie.title}`,
        async () => {
            movieDataLogger.info('Processing movie data', spanMetadata);
            Sentry.logger.info('catalog.movie.process.start', spanMetadata);

            try {
                const existing = await dal.movies.findByTmdbId(movie.id);
                if (existing) {
                    const existingContext = {
                        movie: {
                            tmdbId: movie.id,
                            title: movie.title,
                            imdbId: existing.id,
                        },
                    };

                    movieDataLogger.info('Movie already exists; skipping base upsert', existingContext.movie);
                    Sentry.logger.info('catalog.movie.skip_existing', existingContext.movie);

                    Sentry.withScope((scope) => {
                        scope.setLevel('info');
                        scope.setTag('processor', 'movie-data');
                        scope.setTag('reason', 'already-exists');
                        scope.setContext('movie', existingContext.movie);
                        Sentry.captureMessage('catalog.movie.skip_existing');
                    });

                    return null;
                }

                const [ext, detailsEn, detailsHe, videos, credits] = await Bluebird.all([
                    tmdb.movies.externalIds(movie.id),
                    tmdb.movies.details(movie.id, undefined, SEED_CONFIG.DEFAULT_LANGUAGES.SECONDARY),
                    tmdb.movies.details(movie.id, undefined, SEED_CONFIG.DEFAULT_LANGUAGES.PRIMARY),
                    tmdb.movies.videos(movie.id),
                    tmdb.movies.credits(movie.id),
                ]);

                const imdbId = ext.imdb_id ?? `tmdb-${movie.id}`;

                const movieCreateInput: Prisma.MovieCreateInput & { imdbId: string } = {
                    id: imdbId,
                    imdbId,
                    tmdbId: movie.id,
                    rating: detailsEn.vote_average ?? null,
                    votes: detailsEn.vote_count ?? null,
                    releaseDate: detailsEn.release_date ? new Date(detailsEn.release_date) : null,
                    originalLanguage: detailsEn.original_language === 'he' ? Language.he_IL : Language.en_US,
                };

                const baseMovie = await dal.movies.upsertBase(movieCreateInput);

                const movieContext = {
                    movie: {
                        tmdbId: movie.id,
                        imdbId,
                        title: movie.title,
                        releaseDate: detailsEn.release_date ?? null,
                        voteAverage: detailsEn.vote_average ?? null,
                        voteCount: detailsEn.vote_count ?? null,
                    },
                    tmdb: {
                        externalIds: {
                            imdb: ext.imdb_id ?? null,
                            facebook: ext.facebook_id ?? null,
                            instagram: ext.instagram_id ?? null,
                            twitter: ext.twitter_id ?? null,
                        },
                    },
                };

                movieDataLogger.info('Movie base upserted', movieContext.movie);
                Sentry.logger.info('catalog.movie.base_upserted', movieContext.movie);

                Sentry.withScope((scope) => {
                    scope.setLevel('info');
                    scope.setTag('processor', 'movie-data');
                    scope.setContext('movie', movieContext.movie);
                    scope.setContext('tmdb', movieContext.tmdb);
                    Sentry.captureMessage('catalog.movie.base_upserted');
                });

                return {
                    id: movie.id,
                    title: movie.title,
                    imdbId,
                    tmdbId: movie.id,
                    baseMovie,
                    detailsEn,
                    detailsHe,
                    videos,
                    credits,
                };
            } catch (error) {
                const err = error instanceof Error ? error : new Error(String(error));
                movieDataLogger.error('Failed processing movie', err);
                Sentry.logger.error('catalog.movie.process_failed', {
                    ...spanMetadata,
                    error: err.message,
                });

                Sentry.withScope((scope) => {
                    scope.setLevel('error');
                    scope.setTag('processor', 'movie-data');
                    scope.setContext('movie', spanMetadata);
                    scope.setContext('error', {
                        message: err.message,
                        stack: err.stack,
                    });
                    Sentry.captureException(err);
                });

                return null;
            }
        },
        {
            data: spanMetadata,
            tags: {
                processor: 'movie-data',
            },
        },
    );
}

export async function processMovieTranslations(movieData: MovieData, dal: DAL): Promise<void> {
    const { baseMovie, detailsEn, detailsHe } = movieData;

    const translationEn: Omit<Prisma.MovieTranslationCreateInput, 'movie' | 'language'> = {
        title: detailsEn.title ?? 'Unknown',
        description: detailsEn.overview ?? null,
        originalTitle: detailsEn.original_title ?? null,
        posterUrl: detailsEn.poster_path ? `${SEED_CONFIG.TMDB_POSTER_BASE_URL}${detailsEn.poster_path}` : null,
    };

    const translationHe: Omit<Prisma.MovieTranslationCreateInput, 'movie' | 'language'> = {
        title: detailsHe.title ?? detailsEn.title ?? 'Unknown',
        description: detailsHe.overview ?? detailsEn.overview ?? null,
        originalTitle: detailsHe.original_title ?? detailsEn.original_title ?? null,
        posterUrl: detailsHe.poster_path
            ? `${SEED_CONFIG.TMDB_POSTER_BASE_URL}${detailsHe.poster_path}`
            : detailsEn.poster_path
              ? `${SEED_CONFIG.TMDB_POSTER_BASE_URL}${detailsEn.poster_path}`
              : null,
    };

    const metadata = {
        imdbId: baseMovie.id,
        tmdbId: movieData.tmdbId,
        title: detailsEn.title ?? movieData.title,
    };

    await withSentrySpan(
        'processor.movie.translations',
        `Upsert translations for ${metadata.title}`,
        async () => {
            movieTranslationsLogger.info('Upserting movie translations', metadata);
            Sentry.logger.info('catalog.movie.translations_upsert.start', metadata);

            await Bluebird.all([
                dal.movies.upsertTranslation(baseMovie.id, Language.en_US, translationEn),
                dal.movies.upsertTranslation(baseMovie.id, Language.he_IL, translationHe),
            ]);

            movieTranslationsLogger.info('Movie translations saved', metadata);
            Sentry.logger.info('catalog.movie.translations_upserted', {
                ...metadata,
                languages: ['en-US', 'he-IL'],
            });

            Sentry.withScope((scope) => {
                scope.setLevel('info');
                scope.setTag('processor', 'movie-translations');
                scope.setContext('movie', metadata);
                scope.setContext('translations', {
                    languages: ['en-US', 'he-IL'],
                });
                Sentry.captureMessage('catalog.movie.translations_upserted');
            });
        },
        {
            data: metadata,
            tags: {
                processor: 'movie-translations',
            },
        },
    );
}

export async function processMovieTrailers(movieData: MovieData, dal: DAL): Promise<void> {
    const { baseMovie, videos } = movieData;

    const trailers =
        videos.results
            ?.filter((v: Video) => v.type === 'Trailer' && v.site === 'YouTube')
            ?.map((t: Video) => ({
                title: t.name,
                key: t.key,
                language: Language.en_US,
            })) ?? [];

    const metadata = {
        imdbId: baseMovie.id,
        tmdbId: movieData.tmdbId,
        title: movieData.title,
        trailerCount: trailers.length,
    };

    await withSentrySpan(
        'processor.movie.trailers',
        `Sync trailers for ${movieData.title}`,
        async () => {
            if (!trailers.length) {
                movieTrailersLogger.info('No trailers detected for movie', metadata);
                Sentry.logger.info('catalog.movie.trailers_none', metadata);
                return;
            }

            await dal.movies.upsertAllTrailers(baseMovie.id, trailers);

            movieTrailersLogger.info('Trailers upserted', metadata);
            Sentry.logger.info('catalog.movie.trailers_upserted', metadata);

            Sentry.withScope((scope) => {
                scope.setLevel('info');
                scope.setTag('processor', 'movie-trailers');
                scope.setContext('movie', metadata);
                scope.setContext('trailers', {
                    count: trailers.length,
                    languages: Array.from(new Set(trailers.map((t) => t.language))),
                });
                Sentry.captureMessage('catalog.movie.trailers_upserted');
            });
        },
        {
            data: metadata,
            tags: {
                processor: 'movie-trailers',
            },
        },
    );
}
