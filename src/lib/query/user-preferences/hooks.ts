/**
 * React Query Hooks for User Preferences Entity
 *
 * Custom hooks that wrap React Query functionality for user preferences.
 * These provide a clean API for components to interact with preference data.
 */

'use client';

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {updateUserPreferences} from '@/app/actions/user-preferences';
import {userPreferencesOptions} from './query-options';
import {userPreferencesKeys} from './query-keys';
import type {NotifyMethod} from '@prisma/client';

/**
 * Hook to fetch user preferences
 */
export function useUserPreferences(userId: string) {
    return useQuery(userPreferencesOptions(userId));
}

/**
 * Hook to update user preferences
 * Automatically invalidates the preferences cache on success
 */
export function useUpdateUserPreferences(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { notifyBy: NotifyMethod[] }) => {
            const result = await updateUserPreferences(data);
            if (!result.success) {
                throw new Error(result.error || 'Failed to update preferences');
            }
            return result.data;
        },
        onMutate: async (newPreferences) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: userPreferencesKeys.byUser(userId),
            });

            // Snapshot previous value
            const previousPreferences = queryClient.getQueryData(
                userPreferencesKeys.byUser(userId)
            );

            // Optimistically update
            queryClient.setQueryData(
                userPreferencesKeys.byUser(userId),
                newPreferences
            );

            return {previousPreferences};
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousPreferences) {
                queryClient.setQueryData(
                    userPreferencesKeys.byUser(userId),
                    context.previousPreferences
                );
            }
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({
                queryKey: userPreferencesKeys.byUser(userId),
            });
        },
    });
}

