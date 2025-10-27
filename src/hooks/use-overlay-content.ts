import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { useActorBasicDetail, useTmdbActorsDetails } from '@/lib/query/actor/hooks';
import { getMovieById } from '@/app/actions/movies';
import { useOverlayState } from './use-overlay-state';

/**
 * Custom hook that manages all data fetching logic for drawer/modal content
 * Handles movie data, actor data, and prefetching of related actors
 */
export function useOverlayContent() {
    const { isOpen, entityType, movieId, actorId, currentMovie } = useOverlayState();
    const locale = useLocale();

    // Fetch movie data when movieId is present
    // Use currentMovie from context as initialData for instant display
    const { data: movieData, isLoading: isLoadingMovie } = useQuery({
        queryKey: ['movie', movieId, locale],
        queryFn: () => getMovieById(movieId!, locale),
        enabled: !!movieId && entityType === 'movie',
        staleTime: 1000 * 60 * 5, // 5 minutes
        // Use context data as initialData if available (from search results)
        // This provides instant display while the query validates in the background
        initialData: currentMovie?.id === movieId ? currentMovie : undefined,
    });

    // Fetch actor data for background image
    const tmdbActorIdNum = actorId ? parseInt(actorId, 10) : null;
    const { data: actorData } = useActorBasicDetail(tmdbActorIdNum || 0, locale, {
        enabled: !!tmdbActorIdNum && entityType === 'actor',
    });

    // Extract TMDB actor IDs from movie cast for prefetching
    const actorTmdbIds = useMemo(() => {
        if (entityType === 'movie' && movieData?.cast) {
            return movieData.cast
                .map((castMember) => castMember.actor.tmdbId)
                .filter((tmdbId): tmdbId is number => tmdbId !== null);
        }
        return [];
    }, [entityType, movieData?.cast]);

    // Prefetch all actor details when drawer opens with movie content
    useTmdbActorsDetails(actorTmdbIds, locale, {
        enabled: isOpen && entityType === 'movie' && actorTmdbIds.length > 0,
    });

    return {
        movieData,
        isLoadingMovie,
        actorData,
        actorProfilePath: actorData?.profilePath,
    };
}
