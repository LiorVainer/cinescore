/**
 * Query Keys for Follow Entity
 *
 * Centralized query key definitions for follows.
 * Using factory pattern for consistent and type-safe query keys.
 */

export const followKeys = {
    all: ['follows'] as const,

    // All follows for a specific user
    byUser: (userId: string) => [...followKeys.all, 'user', userId] as const,

    // Check if user follows a specific actor/genre
    check: (userId: string, type: string, value: string) => [...followKeys.all, 'check', userId, type, value] as const,

    // Follows by type
    byType: (userId: string, type: string) => [...followKeys.all, 'user', userId, 'type', type] as const,
};
