/**
 * Query Options for Actor Entity
 *
 * Defines query configurations that can be used both on server and client.
 * These options can be prefetched on the server and reused on the client.
 */

import {queryOptions} from '@tanstack/react-query';
import {getActorById} from '@/app/actions/actors';
import {actorKeys} from './query-keys';

/**
 * Query options for fetching a single actor by ID
 */
export function actorDetailOptions(actorId: string, locale: string) {
    return queryOptions({
        queryKey: actorKeys.detail(actorId, locale),
        queryFn: () => getActorById(actorId, locale),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

