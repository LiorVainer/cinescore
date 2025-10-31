/**
 * Query Options for Trigger Entity
 *
 * Reusable query configurations using queryOptions helper.
 * These are used across useQuery, prefetchQuery, and other React Query methods.
 */

import { queryOptions } from '@tanstack/react-query';
import { getUserTriggers } from '@/app/actions/triggers';
import { triggerKeys } from '@/lib/query';

/**
 * Get all triggers for a user
 */
export const userTriggersOptions = (userId: string) =>
    queryOptions({
        queryKey: triggerKeys.byUser(userId),
        queryFn: async () => {
            const result = await getUserTriggers();
            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch triggers');
            }
            return result.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!userId,
    });

/**
 * Get triggers filtered by condition type
 */
export const userTriggersByConditionTypeOptions = (userId: string, conditionType: string) =>
    queryOptions({
        queryKey: triggerKeys.byConditionType(userId, conditionType),
        queryFn: async () => {
            const result = await getUserTriggers();
            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch triggers');
            }
            // Filter triggers that have at least one condition of the specified type
            return result.data.filter((trigger) => trigger.conditions.some((c) => c.type === conditionType));
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!userId && !!conditionType,
    });
