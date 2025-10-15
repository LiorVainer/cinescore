/**
 * React Query Hooks for Actor Entity
 *
 * Custom hooks that wrap React Query functionality for actors.
 * These provide a clean API for components to interact with actor data.
 */

'use client';

import {useQueries, useQuery, useSuspenseQuery} from '@tanstack/react-query';
import {dbActorDetailsOptions, actorFullDetailsOptions, actorBasicDetailsOptions} from './query-options';

/**
 * Hook to fetch a single actor by ID
 * Automatically handles loading, error states, and caching
 */
export function useActorDetail(actorId: string, locale: string, options?: { enabled?: boolean }) {
    return useQuery({
        ...dbActorDetailsOptions(actorId, locale),
        enabled: options?.enabled ?? true,
    });
}

export function useActorFullDetails(tmdbActorId: number, locale: string, options?: { enabled?: boolean }) {
    return useQuery({
        ...actorFullDetailsOptions(tmdbActorId, locale),
        enabled: options?.enabled ?? true,
    });
}

/**
 * Hook to fetch the basic (lightweight) details for an actor (used in lists/prefetch)
 */
export function useActorBasicDetail(tmdbActorId: number, locale: string, options?: { enabled?: boolean }) {
    return useQuery({
        ...actorBasicDetailsOptions(tmdbActorId, locale),
        enabled: options?.enabled ?? true,
    });
}

/**
 * Hook to fetch multiple TMDB actor basic details in parallel
 * Automatically handles loading, error states, and caching for all actors
 *
 * @param tmdbActorIds - Array of TMDB actor IDs to fetch
 * @param locale - Locale for translations
 * @param options - Optional configuration
 * @returns Array of query results in the same order as the input IDs
 *
 * @example
 * const actorsQueries = useTmdbActorsDetails([123, 456, 789], 'en', { enabled: true });
 *
 * // Check if all queries are loading
 * const isLoading = actorsQueries.some(query => query.isLoading);
 *
 * // Get all successfully loaded actor data
 * const actorsData = actorsQueries.map(query => query.data).filter(Boolean);
 */
export function useTmdbActorsDetails(
    tmdbActorIds: number[],
    locale: string,
    options?: { enabled?: boolean }
) {
    return useQueries({
        queries: tmdbActorIds.map((tmdbActorId) => ({
            ...actorBasicDetailsOptions(tmdbActorId, locale),
            enabled: options?.enabled ?? true,
        })),
    });
}

/**
 * Hook to fetch multiple TMDB actor basic details with combined result
 * Returns a single object with aggregated data and loading states
 *
 * @param tmdbActorIds - Array of TMDB actor IDs to fetch
 * @param locale - Locale for translations
 * @param options - Optional configuration
 * @returns Object with combined data array and isPending flag
 *
 * @example
 * const { data: actors, isPending } = useTmdbActorsDetailsCombined([123, 456, 789], 'en');
 *
 * if (isPending) return <Loading />;
 * return <ActorsList actors={actors} />;
 */
export function useTmdbActorsDetailsCombined(
    tmdbActorIds: number[],
    locale: string,
    options?: { enabled?: boolean }
) {
    return useQueries({
        queries: tmdbActorIds.map((tmdbActorId) => ({
            ...actorBasicDetailsOptions(tmdbActorId, locale),
            enabled: options?.enabled ?? true,
        })),
        combine: (results) => ({
            data: results.map((result) => result.data).filter(Boolean),
            isPending: results.some((result) => result.isPending),
            isError: results.some((result) => result.isError),
            errors: results.map((result) => result.error).filter(Boolean),
        }),
    });
}

/**
 * Hook to fetch actor details with Suspense
 */
export function useSuspenseActorDetail(actorId: string, locale: string) {
    return useSuspenseQuery(dbActorDetailsOptions(actorId, locale));
}
