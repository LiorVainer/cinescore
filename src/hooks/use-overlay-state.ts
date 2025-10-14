'use client';

import {parseAsString, parseAsStringEnum, useQueryStates} from 'nuqs';
import {useCallback} from 'react';
import {useMovieContext} from '@/contexts/movie-context';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';

type OverlayContentType = 'movie' | 'actor';

const overlayParsers = {
    entityType: parseAsStringEnum<OverlayContentType>(['movie', 'actor']),
    movieId: parseAsString,
    actorId: parseAsString,
};

interface UseOverlayStateReturn {
    isOpen: boolean;
    entityType: OverlayContentType | null;
    movieId: string | null;
    actorId: string | null;
    currentMovie: MovieWithLanguageTranslation | null;
    openMovie: (movieId: string, movieData?: MovieWithLanguageTranslation) => Promise<URLSearchParams>;
    openActor: (tmdbActorId: string) => Promise<URLSearchParams>;
    close: () => Promise<URLSearchParams>;
}

/**
 * Hook to manage drawer state via URL query parameters
 * Replaces the DrawerContentContext with URL-based state management
 * Also manages movie context data for initial data optimization
 */
export function useOverlayState(): UseOverlayStateReturn {
    const [state, setState] = useQueryStates(overlayParsers, {
        history: 'replace',
        shallow: true,
    });
    const {currentMovie, setCurrentMovie} = useMovieContext();

    const isOpen = state.entityType !== null;

    const openMovie = useCallback(
        (movieId: string, movieData?: MovieWithLanguageTranslation) => {
            // Store movie data in context if provided (from search results)
            if (movieData) {
                setCurrentMovie(movieData);
            }
            return setState({
                entityType: 'movie',
                movieId,
                actorId: null,
            });
        },
        [setState, setCurrentMovie],
    );

    const openActor = useCallback(
        (tmdbActorId: string) => {
            return setState({
                entityType: 'actor',
                actorId: tmdbActorId,
            });
        },
        [setState],
    );

    const close = useCallback(() => {
        // Clear movie context when closing
        setCurrentMovie(null);
        return setState({
            entityType: null,
            movieId: null,
            actorId: null,
        });
    }, [setState, setCurrentMovie]);

    return {
        isOpen,
        entityType: state.entityType,
        movieId: state.movieId,
        actorId: state.actorId,
        currentMovie,
        openMovie,
        openActor,
        close,
    };
}
