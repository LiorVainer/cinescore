/**
 * Query Keys for Actor Entity
 *
 * Centralized query key factory for actor-related queries.
 * Follows React Query best practices for key organization.
 */

export const actorKeys = {
    all: ['actors'] as const,
    details: () => [...actorKeys.all, 'detail'] as const,
    detail: (id: string, locale: string) => [...actorKeys.details(), id, locale] as const,
};

