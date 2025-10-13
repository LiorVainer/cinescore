/**
 * Query Keys for Interest Entity
 *
 * Centralized query key definitions for interests.
 * Using factory pattern for consistent and type-safe query keys.
 */

export const interestKeys = {
    all: ['interests'] as const,

    // All interests for a specific user
    byUser: (userId: string) => [...interestKeys.all, 'user', userId] as const,

    // Single interest by ID
    detail: (interestId: string) => [...interestKeys.all, 'detail', interestId] as const,

    // Interests by condition type
    byConditionType: (userId: string, conditionType: string) =>
        [...interestKeys.all, 'user', userId, 'condition', conditionType] as const,
};

