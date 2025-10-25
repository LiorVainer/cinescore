'use client';

import {createContext, useContext} from 'react';
import type {PropsWithChildren} from 'react';
import {useLocale} from 'next-intl';
import {mapLocaleToLanguage} from '@/constants/languages.const';
import {useFiltersState, type FiltersState} from './useFilters';

const FiltersContext = createContext<FiltersState | null>(null);

export function FiltersProvider({children}: PropsWithChildren) {
    const locale = useLocale();
    const language = mapLocaleToLanguage(locale);
    const value = useFiltersState(language);

    return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters(): FiltersState {
    const context = useContext(FiltersContext);

    if (!context) {
        throw new Error('useFilters must be used within a FiltersProvider');
    }

    return context;
}
