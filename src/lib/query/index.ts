/**
 * Query Module - Central Exports
 *
 * This file provides convenient re-exports of all query-related functionality.
 * Import from here for easy access to any entity's query utilities.
 *
 * @example
 * ```typescript
 * // Import specific entity modules
 * import { useUserFollows, followKeys } from '@/lib/query';
 *
 * // Or import from specific entity
 * import { useUserFollows } from '@/lib/query/follow';
 * ```
 */

// Core Query Client
export { getQueryClient } from './query-client';

// Entity Modules
export * from './follow';
export * from './trigger';
export * from './user-preferences';
export * from './movie';
