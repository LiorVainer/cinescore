/**
 * Query Keys for Trigger Entity
 *
 * Centralized query key definitions for triggers.
 * Using factory pattern for consistent and type-safe query keys.
 */

export const triggerKeys = {
    all: ['triggers'] as const,

    // All triggers for a specific user
    byUser: (userId: string) => [...triggerKeys.all, 'user', userId] as const,

    // Single trigger by ID
    detail: (triggerId: string) => [...triggerKeys.all, 'detail', triggerId] as const,

    // Triggers by condition type
    byConditionType: (userId: string, conditionType: string) =>
        [...triggerKeys.all, 'user', userId, 'condition', conditionType] as const,
};
