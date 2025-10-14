/**
 * Query Options for User Preferences Entity
 *
 * Reusable query configurations using queryOptions helper.
 * These are used across useQuery, prefetchQuery, and other React Query methods.
 */

import { queryOptions } from '@tanstack/react-query';
import { getUserPreferences } from '@/app/actions/user-preferences';
import { userPreferencesKeys } from './query-keys';

/**
 * Get user preferences
 */
export const userPreferencesOptions = (userId: string) =>
    queryOptions({
        queryKey: userPreferencesKeys.byUser(userId),
        queryFn: async () => {
            const result = await getUserPreferences();
            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch user preferences');
            }
            return result.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes - preferences change less often
        enabled: !!userId,
    });
