/**
 * Query Keys for Movie Entity
 *
 * Centralized query key definitions for movies.
 * Using factory pattern for consistent and type-safe query keys.
 */

export const movieKeys = {
    all: ['movies'] as const,

    // All movies list (with pagination)
    list: (page?: number, limit?: number) => [...movieKeys.all, 'list', { page, limit }] as const,

    // Single movie by ID
    detail: (movieId: string) => [...movieKeys.all, 'detail', movieId] as const,

    // Movies by genre
    byGenre: (genre: string, page?: number) => [...movieKeys.all, 'genre', genre, { page }] as const,

    // Movies by actor
    byActor: (actorName: string, page?: number) => [...movieKeys.all, 'actor', actorName, { page }] as const,

    // Search movies
    search: (query: string, page?: number) => [...movieKeys.all, 'search', query, { page }] as const,

    // Trending/popular movies
    trending: () => [...movieKeys.all, 'trending'] as const,

    // Recent movies
    recent: (limit?: number) => [...movieKeys.all, 'recent', { limit }] as const,
};
