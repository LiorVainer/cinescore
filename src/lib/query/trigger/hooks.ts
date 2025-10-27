/**
 * React Query Hooks for Trigger Entity
 *
 * Custom hooks that wrap React Query functionality for triggers.
 * These provide a clean API for components to interact with trigger data.
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrigger, updateTrigger, deleteTrigger } from '@/app/actions/triggers';
import { userTriggersOptions, userTriggersByConditionTypeOptions } from './query-options';
import { triggerKeys } from './query-keys';
import type { TriggerConditionInput } from '@/types/trigger';

/**
 * Hook to fetch all triggers for a user
 */
export function useUserTriggers(userId: string) {
    return useQuery(userTriggersOptions(userId));
}

/**
 * Hook to fetch triggers by condition type
 */
export function useUserTriggersByConditionType(userId: string, conditionType: string) {
    return useQuery(userTriggersByConditionTypeOptions(userId, conditionType));
}

/**
 * Hook to create a new trigger
 * Automatically invalidates the triggers cache on success
 */
export function useCreateTrigger(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name?: string; conditions: TriggerConditionInput[] }) => {
            const result = await createTrigger(data);
            if (!result.success) {
                throw new Error(result.error || 'Failed to create trigger');
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate and refetch triggers
            queryClient.invalidateQueries({
                queryKey: triggerKeys.byUser(userId),
            });
        },
    });
}

/**
 * Hook to update an existing trigger
 * Automatically invalidates the triggers cache on success
 */
export function useUpdateTrigger(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { triggerId: string; name?: string; conditions?: TriggerConditionInput[] }) => {
            const { triggerId, ...updateData } = data;
            const result = await updateTrigger(triggerId, updateData);
            if (!result.success) {
                throw new Error(result.error || 'Failed to update trigger');
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate and refetch triggers
            queryClient.invalidateQueries({
                queryKey: triggerKeys.byUser(userId),
            });
        },
    });
}

/**
 * Hook to delete an trigger
 * Supports optimistic updates for instant UI feedback
 */
export function useDeleteTrigger(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (triggerId: string) => {
            const result = await deleteTrigger(triggerId);
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete trigger');
            }
            return result.data;
        },
        onMutate: async (triggerId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: triggerKeys.byUser(userId),
            });

            // Snapshot previous value
            const previousTriggers = queryClient.getQueryData(triggerKeys.byUser(userId));

            // Optimistically update
            queryClient.setQueryData(triggerKeys.byUser(userId), (old: any) =>
                old?.filter((i: any) => i.id !== triggerId),
            );

            return { previousTriggers };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousTriggers) {
                queryClient.setQueryData(triggerKeys.byUser(userId), context.previousTriggers);
            }
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({
                queryKey: triggerKeys.byUser(userId),
            });
        },
    });
}
