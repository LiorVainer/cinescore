'use server';

import { omdb, tmdb } from '@/lib/clients';
import { prisma } from '@/lib/prisma';

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

export async function searchMovies(query: string): Promise<SearchedMovie[]> {
    if (!query || query.trim().length < 2) return [];

    const results = await tmdb.search.movies({
        query,
        language: 'he-IL',
    });

    return Promise.all(
        results.results.map(async (m: any) => {
            try {
                const external = await tmdb.movies.externalIds(m.id);

                let imdbRating: number | null = null;
                let imdbVotes: number | null = null;
                const imdbId: string | null = external.imdb_id ?? null;

                if (imdbId) {
                    const imdbData = await omdb.title.getById({ i: imdbId });
                    imdbRating =
                        imdbData.imdbRating && imdbData.imdbRating !== 'N/A' ? parseFloat(imdbData.imdbRating) : null;
                    imdbVotes =
                        imdbData.imdbVotes && imdbData.imdbVotes !== 'N/A'
                            ? parseInt(imdbData.imdbVotes.replace(/,/g, ''), 10)
                            : null;
                }

                return {
                    id: m.id,
                    title: m.title,
                    originalTitle: m.original_title,
                    overview: m.overview,
                    releaseDate: m.release_date,
                    poster: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : null,
                    imdbId,
                    imdbRating,
                    imdbVotes,
                } satisfies SearchedMovie;
            } catch {
                return {
                    id: m.id,
                    title: m.title,
                    originalTitle: m.original_title,
                    overview: m.overview,
                    releaseDate: m.release_date,
                    poster: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : null,
                    imdbId: null,
                    imdbRating: null,
                    imdbVotes: null,
                } satisfies SearchedMovie;
            }
        }),
    );
}

export const searchMoviesInDB = async (query: string) => {
    const q = query.trim();
    if (!q) return [];

    return await prisma.movie.findMany({
        where: {
            OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { originalTitle: { contains: q, mode: 'insensitive' } },
            ],
        },
        include: {
            genres: true,
            trailers: true,
        },
        orderBy: [{ rating: 'desc' }, { votes: 'desc' }],
        take: 50,
    });
};

export type MovieFilters = {
    search?: string;
    sort?: 'rating:desc' | 'rating:asc' | 'votes:desc' | 'releaseDate:desc' | 'releaseDate:asc';
    selectedGenres?: number[];
    page?: number;
    pageSize?: number;
};

export const searchMoviesFiltered = async (filters: MovieFilters) => {
    const { search = '', sort = 'rating:desc', selectedGenres = [], page = 1, pageSize = 24 } = filters ?? {};

    const q = search.trim();

    // Build where
    const where: any = {};

    if (q.length > 0) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { originalTitle: { contains: q, mode: 'insensitive' } },
        ];
    }

    if (selectedGenres.length > 0) {
        where.genres = {
            some: { id: { in: selectedGenres } },
        };
    }

    // Build orderBy
    const [field, direction] = (sort || 'rating:desc').split(':') as [
        'rating' | 'votes' | 'releaseDate',
        'asc' | 'desc',
    ];
    const orderBy = { [field]: direction } as unknown as Record<string, 'asc' | 'desc'>;

    const skip = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const take = Math.max(1, Math.min(100, pageSize));

    const [items, total] = await Promise.all([
        prisma.movie.findMany({
            where,
            include: { genres: true, trailers: true },
            orderBy,
            skip,
            take,
        }),
        prisma.movie.count({ where }),
    ]);

    return {
        items,
        total,
        page,
        pageSize: take,
        totalPages: Math.ceil(total / take) || 1,
    };
};

export const listGenres = async () => {
    return prisma.genre.findMany({ orderBy: { name: 'asc' } });
};
