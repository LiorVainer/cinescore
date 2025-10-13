/**
 * Query Options for Follow Entity
 *
 * Reusable query configurations using queryOptions helper.
 * These are used across useQuery, prefetchQuery, and other React Query methods.
 */

import { queryOptions } from '@tanstack/react-query';
import { getUserFollows } from '@/app/actions/follows';
import { followKeys } from './query-keys';

/**
 * Get all follows for a user
 */
export const userFollowsOptions = (userId: string) =>
    queryOptions({
        queryKey: followKeys.byUser(userId),
        queryFn: async () => {
            const result = await getUserFollows();
            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch follows');
            }
            return result.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!userId,
    });

/**
 * Get follows filtered by type (ACTOR or GENRE)
 */
export const userFollowsByTypeOptions = (userId: string, type: 'ACTOR' | 'GENRE') =>
    queryOptions({
        queryKey: followKeys.byType(userId, type),
        queryFn: async () => {
            const result = await getUserFollows();
            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch follows');
            }
            return result.data.filter((follow) => follow.type === type);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!userId && !!type,
    });
