/**
 * React Query Hooks for Actor Entity
 *
 * Custom hooks that wrap React Query functionality for actors.
 * These provide a clean API for components to interact with actor data.
 */

'use client';

import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { actorDetailOptions } from './query-options';

/**
 * Hook to fetch a single actor by ID
 * Automatically handles loading, error states, and caching
 */
export function useActorDetail(actorId: string, locale: string, options?: { enabled?: boolean }) {
    return useQuery({
        ...actorDetailOptions(actorId, locale),
        enabled: options?.enabled ?? true,
    });
}

/**
 * Hook to fetch actor details with Suspense
 */
export function useSuspenseActorDetail(actorId: string, locale: string) {
    return useSuspenseQuery(actorDetailOptions(actorId, locale));
}
