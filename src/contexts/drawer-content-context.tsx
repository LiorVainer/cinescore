'use client';

import React, { createContext, useContext, useState, useTransition, useCallback, ReactNode } from 'react';
import type { MovieWithLanguageTranslation } from '@/models/movies.model';

type DrawerContentType = 'movie' | 'actor';
type NavigationDirection = 'forward' | 'backward';

interface DrawerContentState {
    type: DrawerContentType;
    movieId?: string;
    actorId?: string;
    movieData?: MovieWithLanguageTranslation;
    imgSrc?: string;
    idSuffix?: string;
}

interface DrawerContentContextType {
    isOpen: boolean;
    content: DrawerContentState | null;
    direction: NavigationDirection;
    isPending: boolean; // Add loading state indicator
    openMovie: (movie: MovieWithLanguageTranslation, imgSrc: string, idSuffix: string) => void;
    openActor: (actorId: string) => void;
    goBackToMovie: () => void;
    close: () => void;
}

const DrawerContentContext = createContext<DrawerContentContextType | undefined>(undefined);

export function DrawerContentProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<DrawerContentState | null>(null);
    const [previousMovieState, setPreviousMovieState] = useState<Omit<DrawerContentState, 'type'> | null>(null);
    const [direction, setDirection] = useState<NavigationDirection>('forward');
    const [isPending, startTransition] = useTransition();

    const openMovie = useCallback((movie: MovieWithLanguageTranslation, imgSrc: string, idSuffix: string) => {
        const movieState = { movieData: movie, imgSrc, idSuffix, movieId: movie.id };
        setDirection('forward');
        startTransition(() => {
            setContent({ type: 'movie', ...movieState });
            setPreviousMovieState(movieState);
        });
        setIsOpen(true);
    }, []);

    const openActor = useCallback((actorId: string) => {
        setDirection('forward');
        startTransition(() => {
            setContent((prev) => ({
                type: 'actor',
                actorId,
                movieData: prev?.movieData,
                imgSrc: prev?.imgSrc,
                idSuffix: prev?.idSuffix,
                movieId: prev?.movieId,
            }));
        });
        setIsOpen(true);
    }, []);

    const goBackToMovie = useCallback(() => {
        if (previousMovieState?.movieData) {
            setDirection('backward');
            startTransition(() => {
                setContent({ type: 'movie', ...previousMovieState });
            });
        }
    }, [previousMovieState]);

    const close = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => {
            setContent(null);
            setPreviousMovieState(null);
            setDirection('forward');
        }, 150);
    }, []);

    return (
        <DrawerContentContext.Provider
            value={{
                isOpen,
                content,
                direction,
                isPending,
                openMovie,
                openActor,
                goBackToMovie,
                close,
            }}
        >
            {children}
        </DrawerContentContext.Provider>
    );
}

export function useDrawerContent() {
    const context = useContext(DrawerContentContext);
    if (context === undefined) {
        throw new Error('useDrawerContent must be used within a DrawerContentProvider');
    }
    return context;
}
