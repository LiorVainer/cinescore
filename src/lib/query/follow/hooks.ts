/**
 * React Query Hooks for Follow Entity
 *
 * Custom hooks that wrap React Query functionality for follows.
 * These provide a clean API for components to interact with follow data.
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFollow, deleteFollow } from '@/app/actions/follows';
import { userFollowsByTypeOptions, userFollowsOptions } from './query-options';
import { followKeys } from './query-keys';
import type { FollowType } from '@prisma/client';

/**
 * Hook to fetch all follows for a user
 */
export function useUserFollows(userId?: string) {
    return useQuery({ ...userFollowsOptions(userId!), enabled: !!userId });
}

/**
 * Hook to fetch follows by type (ACTOR or GENRE)
 */
export function useUserFollowsByType(userId: string, type: 'ACTOR' | 'GENRE') {
    return useQuery(userFollowsByTypeOptions(userId, type));
}

/**
 * Hook to create a new follow
 * Automatically invalidates the follows cache on success
 */
export function useCreateFollow(userId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { type: FollowType; value: string }) => {
            const result = await createFollow(data);
            if (!result.success) {
                throw new Error(result.error || 'Failed to create follow');
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate and refetch follows
            if (userId) {
                queryClient.invalidateQueries({
                    queryKey: followKeys.byUser(userId),
                });
            }
        },
    });
}

/**
 * Hook to delete a follow
 * Supports optimistic updates for instant UI feedback
 */
export function useDeleteFollow(userId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (followId: string) => {
            const result = await deleteFollow(followId);
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete follow');
            }
            return result.data;
        },
        onMutate: async (followId) => {
            // Cancel outgoing refetches
            if (!userId) throw new Error('User not authenticated');

            await queryClient.cancelQueries({
                queryKey: followKeys.byUser(userId),
            });

            // Snapshot previous value
            const previousFollows = queryClient.getQueryData(followKeys.byUser(userId));

            // Optimistically update
            queryClient.setQueryData(followKeys.byUser(userId), (old: any) =>
                old?.filter((f: any) => f.id !== followId),
            );

            return { previousFollows };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (userId && context?.previousFollows) {
                queryClient.setQueryData(followKeys.byUser(userId), context.previousFollows);
            }
        },
        onSettled: () => {
            if (userId) {
                queryClient.invalidateQueries({ queryKey: followKeys.byUser(userId) });
            }
        },
    });
}
