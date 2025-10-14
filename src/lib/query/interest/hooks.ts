/**
 * React Query Hooks for Interest Entity
 *
 * Custom hooks that wrap React Query functionality for interests.
 * These provide a clean API for components to interact with interest data.
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createInterest, updateInterest, deleteInterest } from '@/app/actions/interests';
import { userInterestsOptions, userInterestsByConditionTypeOptions } from './query-options';
import { interestKeys } from './query-keys';
import type { InterestConditionInput } from '@/types/interests';

/**
 * Hook to fetch all interests for a user
 */
export function useUserInterests(userId: string) {
    return useQuery(userInterestsOptions(userId));
}

/**
 * Hook to fetch interests by condition type
 */
export function useUserInterestsByConditionType(userId: string, conditionType: string) {
    return useQuery(userInterestsByConditionTypeOptions(userId, conditionType));
}

/**
 * Hook to create a new interest
 * Automatically invalidates the interests cache on success
 */
export function useCreateInterest(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name?: string; conditions: InterestConditionInput[] }) => {
            const result = await createInterest(data);
            if (!result.success) {
                throw new Error(result.error || 'Failed to create interest');
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate and refetch interests
            queryClient.invalidateQueries({
                queryKey: interestKeys.byUser(userId),
            });
        },
    });
}

/**
 * Hook to update an existing interest
 * Automatically invalidates the interests cache on success
 */
export function useUpdateInterest(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { interestId: string; name?: string; conditions?: InterestConditionInput[] }) => {
            const { interestId, ...updateData } = data;
            const result = await updateInterest(interestId, updateData);
            if (!result.success) {
                throw new Error(result.error || 'Failed to update interest');
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate and refetch interests
            queryClient.invalidateQueries({
                queryKey: interestKeys.byUser(userId),
            });
        },
    });
}

/**
 * Hook to delete an interest
 * Supports optimistic updates for instant UI feedback
 */
export function useDeleteInterest(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (interestId: string) => {
            const result = await deleteInterest(interestId);
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete interest');
            }
            return result.data;
        },
        onMutate: async (interestId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: interestKeys.byUser(userId),
            });

            // Snapshot previous value
            const previousInterests = queryClient.getQueryData(interestKeys.byUser(userId));

            // Optimistically update
            queryClient.setQueryData(interestKeys.byUser(userId), (old: any) =>
                old?.filter((i: any) => i.id !== interestId),
            );

            return { previousInterests };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousInterests) {
                queryClient.setQueryData(interestKeys.byUser(userId), context.previousInterests);
            }
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({
                queryKey: interestKeys.byUser(userId),
            });
        },
    });
}
