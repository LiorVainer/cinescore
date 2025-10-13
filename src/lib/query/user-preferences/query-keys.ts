/**
 * Query Keys for User Preferences Entity
 *
 * Centralized query key definitions for user preferences.
 * Using factory pattern for consistent and type-safe query keys.
 */

export const userPreferencesKeys = {
    all: ['user-preferences'] as const,

    // User preferences by user ID
    byUser: (userId: string) => [...userPreferencesKeys.all, 'user', userId] as const,
};

