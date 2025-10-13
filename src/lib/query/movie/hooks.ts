/**
 * React Query Hooks for Movie Entity
 *
 * Custom hooks that wrap React Query functionality for movies.
 * These provide a clean API for components to interact with movie data.
 *
 * NOTE: These are placeholder implementations. Replace with actual implementations
 * when movie-related server actions are created.
 */

'use client';

import {useQuery} from '@tanstack/react-query';
import {
    moviesListOptions,
    movieDetailOptions,
    moviesByGenreOptions,
    moviesByActorOptions,
    movieSearchOptions,
    trendingMoviesOptions,
    recentMoviesOptions,
} from './query-options';

/**
 * Hook to fetch paginated list of movies
 */
export function useMoviesList(page: number = 1, limit: number = 20) {
    return useQuery(moviesListOptions(page, limit));
}

/**
 * Hook to fetch single movie details
 */
export function useMovieDetail(movieId: string) {
    return useQuery(movieDetailOptions(movieId));
}

/**
 * Hook to fetch movies by genre
 */
export function useMoviesByGenre(genre: string, page: number = 1) {
    return useQuery(moviesByGenreOptions(genre, page));
}

/**
 * Hook to fetch movies by actor
 */
export function useMoviesByActor(actorName: string, page: number = 1) {
    return useQuery(moviesByActorOptions(actorName, page));
}

/**
 * Hook to search movies
 */
export function useMovieSearch(query: string, page: number = 1) {
    return useQuery(movieSearchOptions(query, page));
}

/**
 * Hook to fetch trending movies
 */
export function useTrendingMovies() {
    return useQuery(trendingMoviesOptions());
}

/**
 * Hook to fetch recent movies
 */
export function useRecentMovies(limit: number = 10) {
    return useQuery(recentMoviesOptions(limit));
}

