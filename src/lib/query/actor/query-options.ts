/**
 * Query Options for Actor Entity
 *
 * Defines query configurations that can be used both on server and client.
 * These options can be prefetched on the server and reused on the client.
 */

import {queryOptions} from '@tanstack/react-query';
import {getActorByIdFromDB, getActorFullDetails, getActorBasicDetail} from '@/app/actions/actors';
import {actorKeys} from './query-keys';

/**
 * Query options for fetching a single actor by ID
 */
export function dbActorDetailsOptions(actorId: string, locale: string) {
    return queryOptions({
        queryKey: actorKeys.dbDetails(actorId, locale),
        queryFn: () => getActorByIdFromDB(actorId, locale),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function actorFullDetailsOptions(tmdbActorId: number, locale: string) {
    return queryOptions({
        queryKey: actorKeys.tmdbDetails(tmdbActorId, locale),
        queryFn: () => getActorFullDetails(tmdbActorId, locale),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Lightweight/basic actor details used for lists/prefetching (no credits or heavy enrichment)
export function actorBasicDetailsOptions(tmdbActorId: number, locale: string) {
    return queryOptions({
        queryKey: actorKeys.tmdbBasic(tmdbActorId, locale),
        queryFn: () => getActorBasicDetail(tmdbActorId, locale),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
