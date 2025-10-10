'use server';

import {omdb, tmdb} from '@/lib/clients';
import {prisma} from '@/lib/prisma';
import {MoviesDAL} from '@/dal';
import {Language} from '@prisma/client';
import {MovieWithLanguageTranslation} from '@/models/movies.model';
// Import official types from tmdb-ts and omdbapi
import type {MovieSearchResult, ExternalIds} from 'tmdb-ts';
import type {Movie as OmdbMovie} from '@/lib/omdbapi';

export type SearchedMovie = {
    id: number;
    title: string;
    originalTitle: string;
    overview: string;
    releaseDate: string | null;
    poster: string | null;
    imdbId: string | null;
    imdbRating: number | null;
    imdbVotes: number | null;
};

const moviesDAL = new MoviesDAL(prisma);

export async function searchMovies(query: string): Promise<SearchedMovie[]> {
    if (!query || query.trim().length < 2) return [];

    const results = await tmdb.search.movies({
        query,
        language: 'he-IL',
    });

    return Promise.all(
        results.results.map(async (tmdbMovie: MovieSearchResult) => {
            try {
                const external = await tmdb.movies.externalIds(tmdbMovie.id) as ExternalIds;

                let imdbRating: number | null = null;
                let imdbVotes: number | null = null;
                const imdbId: string | null = external.imdb_id ?? null;

                if (imdbId) {
                    const omdbMovie = await omdb.title.getById({i: imdbId}) as OmdbMovie;
                    imdbRating =
                        omdbMovie.imdbRating && omdbMovie.imdbRating !== 'N/A' ? parseFloat(omdbMovie.imdbRating) : null;
                    imdbVotes =
                        omdbMovie.imdbVotes && omdbMovie.imdbVotes !== 'N/A'
                            ? parseInt(omdbMovie.imdbVotes.replace(/,/g, ''), 10)
                            : null;

                    console.log({omdbMovie})
                }

                return {
                    id: tmdbMovie.id,
                    title: tmdbMovie.title,
                    originalTitle: tmdbMovie.original_title,
                    overview: tmdbMovie.overview,
                    releaseDate: tmdbMovie.release_date,
                    poster: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w200${tmdbMovie.poster_path}` : null,
                    imdbId,
                    imdbRating,
                    imdbVotes,
                } satisfies SearchedMovie;
            } catch {
                return {
                    id: tmdbMovie.id,
                    title: tmdbMovie.title,
                    originalTitle: tmdbMovie.original_title,
                    overview: tmdbMovie.overview,
                    releaseDate: tmdbMovie.release_date,
                    poster: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w200${tmdbMovie.poster_path}` : null,
                    imdbId: null,
                    imdbRating: null,
                    imdbVotes: null,
                } satisfies SearchedMovie;
            }
        }),
    );
}

export const searchMoviesInDB = async (query: string, language: Language = Language.he_IL) => {
    const q = query.trim();
    if (!q) return [];

    const movies = await moviesDAL.getMoviesWithLanguageTranslation(language, {
        where: {
            translations: {
                some: {
                    OR: [
                        {title: {contains: q, mode: 'insensitive'}},
                        {originalTitle: {contains: q, mode: 'insensitive'}},
                    ],
                },
            },
        },
        orderBy: [{rating: 'desc'}, {votes: 'desc'}],
        take: 50,
    });

    console.dir({movies}, {depth: Infinity});

    return movies as MovieWithLanguageTranslation[];
};

export type MovieFilters = {
    search?: string;
    sort?: 'rating:desc' | 'rating:asc' | 'votes:desc' | 'releaseDate:desc' | 'releaseDate:asc';
    selectedGenres?: number[];
    page?: number;
    pageSize?: number;
    language?: Language;
};

export const searchMoviesFiltered = async (filters: MovieFilters) => {
    const {
        search = '',
        sort = 'rating:desc',
        selectedGenres = [],
        page = 1,
        pageSize = 24,
        language = Language.he_IL
    } = filters ?? {};

    const q = search.trim();

    // Build where
    const where: any = {};

    if (q.length > 0) {
        where.translations = {
            some: {
                OR: [
                    {title: {contains: q, mode: 'insensitive'}},
                    {originalTitle: {contains: q, mode: 'insensitive'}},
                ],
            },
        };
    }

    if (selectedGenres.length > 0) {
        where.genres = {
            some: {tmdbId: {in: selectedGenres}}, // Use tmdbId instead of id
        };
    }

    // Build orderBy
    const [field, direction] = (sort || 'rating:desc').split(':') as [
            'rating' | 'votes' | 'releaseDate',
            'asc' | 'desc',
    ];
    const orderBy = {[field]: direction} as unknown as Record<string, 'asc' | 'desc'>;

    const skip = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const take = Math.max(1, Math.min(100, pageSize));

    const [items, total] = await Promise.all([
        moviesDAL.getMoviesWithLanguageTranslation(language, {
            where,
            orderBy,
            skip,
            take,
        }),
        moviesDAL.countMovies(where),
    ]);

    console.dir({items}, {depth: Infinity});

    return {
        items,
        total,
        page,
        pageSize: take,
        totalPages: Math.ceil(total / take) || 1,
    };
};

export const listGenres = async (language: Language = Language.he_IL) => {
    const genres = await prisma.genre.findMany({
        include: {
            translations: true // Include all translations, not just the requested language
        },
        orderBy: {tmdbId: 'asc'}
    });

    // Transform to the expected GenreOption format
    return genres.map(genre => {
        // Find translation for the requested language, fallback to English, then any available
        const requestedTranslation = genre.translations.find(t => t.language === language);
        const englishTranslation = genre.translations.find(t => t.language === Language.en_US);
        const anyTranslation = genre.translations[0];

        const translation = requestedTranslation || englishTranslation || anyTranslation;

        return {
            id: genre.tmdbId || 0, // Use tmdbId for filtering
            name: translation?.name || `Genre ${genre.tmdbId}` // Use translated name with proper fallback
        };
    });
};
