'use client';

import React, {createContext, useContext, useState} from 'react';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';

interface MovieContextState {
    currentMovie: MovieWithLanguageTranslation | null;
    setCurrentMovie: (movie: MovieWithLanguageTranslation | null) => void;
}

const MovieContext = createContext<MovieContextState | undefined>(undefined);

export function MovieProvider({ children }: { children: React.ReactNode }) {
    const [currentMovie, setCurrentMovie] = useState<MovieWithLanguageTranslation | null>(null);

    return (
        <MovieContext.Provider value={{ currentMovie, setCurrentMovie }}>
            {children}
        </MovieContext.Provider>
    );
}

export function useMovieContext(): MovieContextState {
    const context = useContext(MovieContext);
    if (context === undefined) {
        throw new Error('useMovieContext must be used within a MovieProvider');
    }
    return context;
}

