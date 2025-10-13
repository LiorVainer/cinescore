/**
 * Query Keys for Actor Entity
 *
 * Centralized query key factory for actor-related queries.
 * Follows React Query best practices for key organization.
 */

export const actorKeys = {
    all: ['actors'] as const,
    allDetails: () => [...actorKeys.all, 'details'] as const,
    tmdbDetails: (tmdbId: number, locale: string) => [...actorKeys.allDetails(), 'tmdb', tmdbId, locale] as const,
    dbDetails: (id: string, locale: string) => [...actorKeys.allDetails(), 'db', id, locale] as const,
};
