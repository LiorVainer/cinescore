// src/constants/cache-tags.const.ts

/**
 * Cache revalidation tags for Server Components and Server Actions
 */
export const CACHE_TAGS = {
    USER_FOLLOWS: 'user-follows',
    USER_TRIGGERS: 'user-triggers',
    USER_PREFERENCES: 'user-preferences',
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
