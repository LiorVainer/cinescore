/**
 * Query Options for Movie Entity
 *
 * Reusable query configurations using queryOptions helper.
 * These are used across useQuery, prefetchQuery, and other React Query methods.
 *
 * NOTE: These are placeholder implementations. Replace with actual server actions
 * when movie-related actions are created.
 */

import {queryOptions} from '@tanstack/react-query';
import {movieKeys} from './query-keys';

/**
 * Get paginated list of movies
 *
 * TODO: Replace with actual server action when available
 * Example: import { getMovies } from '@/app/actions/movies';
 */
export const moviesListOptions = (page: number = 1, limit: number = 20) =>
    queryOptions({
        queryKey: movieKeys.list(page, limit),
        queryFn: async () => {
            // TODO: Replace with server action call
            // const result = await getMovies({ page, limit });
            // if (!result.success) throw new Error(result.error);
            // return result.data;

            throw new Error('getMovies server action not implemented yet');
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: page > 0 && limit > 0,
    });

/**
 * Get single movie details by ID
 *
 * TODO: Replace with actual server action when available
 * Example: import { getMovieById } from '@/app/actions/movies';
 */
export const movieDetailOptions = (movieId: string) =>
    queryOptions({
        queryKey: movieKeys.detail(movieId),
        queryFn: async () => {
            // TODO: Replace with server action call
            // const result = await getMovieById(movieId);
            // if (!result.success) throw new Error(result.error);
            // return result.data;

            throw new Error('getMovieById server action not implemented yet');
        },
        staleTime: 30 * 60 * 1000, // 30 minutes - movie details don't change often
        enabled: !!movieId,
    });

/**
 * Get movies by genre
 *
 * TODO: Replace with actual server action when available
 * Example: import { getMoviesByGenre } from '@/app/actions/movies';
 */
export const moviesByGenreOptions = (genre: string, page: number = 1) =>
    queryOptions({
        queryKey: movieKeys.byGenre(genre, page),
        queryFn: async () => {
            // TODO: Replace with server action call
            // const result = await getMoviesByGenre({ genre, page });
            // if (!result.success) throw new Error(result.error);
            // return result.data;

            throw new Error('getMoviesByGenre server action not implemented yet');
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!genre && page > 0,
    });

/**
 * Get movies by actor
 *
 * TODO: Replace with actual server action when available
 * Example: import { getMoviesByActor } from '@/app/actions/movies';
 */
export const moviesByActorOptions = (actorName: string, page: number = 1) =>
    queryOptions({
        queryKey: movieKeys.byActor(actorName, page),
        queryFn: async () => {
            // TODO: Replace with server action call
            // const result = await getMoviesByActor({ actorName, page });
            // if (!result.success) throw new Error(result.error);
            // return result.data;

            throw new Error('getMoviesByActor server action not implemented yet');
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!actorName && page > 0,
    });

/**
 * Search movies
 *
 * TODO: Replace with actual server action when available
 * Example: import { searchMovies } from '@/app/actions/movies';
 */
export const movieSearchOptions = (query: string, page: number = 1) =>
    queryOptions({
        queryKey: movieKeys.search(query, page),
        queryFn: async () => {
            // TODO: Replace with server action call
            // const result = await searchMovies({ query, page });
            // if (!result.success) throw new Error(result.error);
            // return result.data;

            throw new Error('searchMovies server action not implemented yet');
        },
        staleTime: 2 * 60 * 1000, // 2 minutes - search results can be more volatile
        enabled: !!query && query.length > 0 && page > 0,
    });

/**
 * Get trending movies
 *
 * TODO: Replace with actual server action when available
 * Example: import { getTrendingMovies } from '@/app/actions/movies';
 */
export const trendingMoviesOptions = () =>
    queryOptions({
        queryKey: movieKeys.trending(),
        queryFn: async () => {
            // TODO: Replace with server action call
            // const result = await getTrendingMovies();
            // if (!result.success) throw new Error(result.error);
            // return result.data;

            throw new Error('getTrendingMovies server action not implemented yet');
        },
        staleTime: 15 * 60 * 1000, // 15 minutes
    });

/**
 * Get recent movies
 *
 * TODO: Replace with actual server action when available
 * Example: import { getRecentMovies } from '@/app/actions/movies';
 */
export const recentMoviesOptions = (limit: number = 10) =>
    queryOptions({
        queryKey: movieKeys.recent(limit),
        queryFn: async () => {
            // TODO: Replace with server action call
            // const result = await getRecentMovies({ limit });
            // if (!result.success) throw new Error(result.error);
            // return result.data;

            throw new Error('getRecentMovies server action not implemented yet');
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: limit > 0,
    });

