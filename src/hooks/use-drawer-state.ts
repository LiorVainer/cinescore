'use client';

import {parseAsString, parseAsStringEnum, useQueryStates} from 'nuqs';
import {useCallback} from 'react';
import {useMovieContext} from '@/contexts/movie-context';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';

type DrawerContentType = 'movie' | 'actor';

const drawerParsers = {
    drawerType: parseAsStringEnum<DrawerContentType>(['movie', 'actor']),
    movieId: parseAsString,
    tmdbActorId: parseAsString,
};

interface UseDrawerStateReturn {
    isOpen: boolean;
    drawerType: DrawerContentType | null;
    movieId: string | null;
    tmdbActorId: string | null;
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
export function useDrawerState(): UseDrawerStateReturn {
    const [state, setState] = useQueryStates(drawerParsers, {
        history: 'push',
        shallow: true,
    });
    const {currentMovie, setCurrentMovie} = useMovieContext();

    const isOpen = state.drawerType !== null;

    const openMovie = useCallback(
        (movieId: string, movieData?: MovieWithLanguageTranslation) => {
            // Store movie data in context if provided (from search results)
            if (movieData) {
                setCurrentMovie(movieData);
            }
            return setState({
                drawerType: 'movie',
                movieId,
                tmdbActorId: null,
            });
        },
        [setState, setCurrentMovie],
    );

    const openActor = useCallback(
        (tmdbActorId: string) => {
            return setState({
                drawerType: 'actor',
                tmdbActorId,
                // Keep movieId to allow going back
            });
        },
        [setState],
    );

    const close = useCallback(() => {
        // Clear movie context when closing
        setCurrentMovie(null);
        return setState({
            drawerType: null,
            movieId: null,
            tmdbActorId: null,
        });
    }, [setState, setCurrentMovie]);

    return {
        isOpen,
        drawerType: state.drawerType,
        movieId: state.movieId,
        tmdbActorId: state.tmdbActorId,
        currentMovie,
        openMovie,
        openActor,
        close,
    };
}
