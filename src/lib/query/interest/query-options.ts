/**
 * Query Options for Interest Entity
 *
 * Reusable query configurations using queryOptions helper.
 * These are used across useQuery, prefetchQuery, and other React Query methods.
 */

import {queryOptions} from '@tanstack/react-query';
import {getUserInterests} from '@/app/actions/interests';
import {interestKeys} from './query-keys';

/**
 * Get all interests for a user
 */
export const userInterestsOptions = (userId: string) =>
    queryOptions({
        queryKey: interestKeys.byUser(userId),
        queryFn: async () => {
            const result = await getUserInterests();
            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch interests');
            }
            return result.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!userId,
    });

/**
 * Get interests filtered by condition type
 */
export const userInterestsByConditionTypeOptions = (userId: string, conditionType: string) =>
    queryOptions({
        queryKey: interestKeys.byConditionType(userId, conditionType),
        queryFn: async () => {
            const result = await getUserInterests();
            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch interests');
            }
            // Filter interests that have at least one condition of the specified type
            return result.data.filter(interest =>
                interest.conditions.some(c => c.type === conditionType)
            );
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!userId && !!conditionType,
    });
