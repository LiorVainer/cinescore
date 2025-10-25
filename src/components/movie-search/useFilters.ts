'use client';

import {useCallback, useMemo} from 'react';
import {
    debounce,
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
    useQueryStates,
    type UseQueryStatesKeysMap,
} from 'nuqs';
import {useDebounce} from '@/lib/useDebounce';
import {SORT_VALUES, SortValue} from '@/constants/sort.const';
import type {Language} from '@prisma/client';
import type {MovieFilters} from '@/app/actions/searchMovies';

const DEFAULT_SORT: SortValue = 'rating:desc';
const DEFAULT_PAGE_SIZE = 24;
const DEFAULT_PAGE = 1;

type RawFilters = {
    readonly search: string;
    readonly actor: string;
    readonly sort: SortValue;
    readonly genres: number[];
    readonly page: number;
};

const filterParsers = {
    search: parseAsString.withDefault(''),
    actor: parseAsString.withDefault(''),
    sort: parseAsStringEnum(SORT_VALUES).withDefault(DEFAULT_SORT),
    genres: parseAsArrayOf(parseAsInteger).withDefault([]),
    page: parseAsInteger.withDefault(DEFAULT_PAGE),
} satisfies UseQueryStatesKeysMap<RawFilters>;

const DEFAULT_SET_OPTIONS = {
    history: 'replace' as const,
    shallow: true,
};

export type FiltersState = {
    readonly search: string;
    readonly searchDebounced: string;
    readonly actorName: string;
    readonly actorDebounced: string;
    readonly sort: SortValue;
    readonly selectedGenres: number[];
    readonly page: number;
    readonly pageSize: number;
    readonly language: Language;
    readonly filters: MovieFilters;
    setSearch: (next: string) => Promise<URLSearchParams>;
    setActorName: (next: string) => Promise<URLSearchParams>;
    setSort: (next: SortValue) => Promise<URLSearchParams>;
    toggleGenre: (id: number) => Promise<URLSearchParams>;
    clearGenres: () => Promise<URLSearchParams>;
    clearAll: () => Promise<URLSearchParams>;
    setPage: (page: number) => Promise<URLSearchParams>;
};

export function useFiltersState(language: Language): FiltersState {
    const [rawFilters, setRawFilters] = useQueryStates(filterParsers, {
        history: 'replace',
        shallow: true,
        clearOnDefault: true,
    });

    const searchDebounced = useDebounce(rawFilters.search, 400);
    const actorDebounced = useDebounce(rawFilters.actor, 400);

    const setSearch = useCallback(
        (next: string) =>
            setRawFilters(
                (prev: RawFilters) => ({
                    ...prev,
                    search: next,
                    page: DEFAULT_PAGE,
                }),
                {
                    ...DEFAULT_SET_OPTIONS,
                    limit: debounce(400),
                },
            ),
        [setRawFilters],
    );

    const setActorName = useCallback(
        (next: string) =>
            setRawFilters(
                (prev: RawFilters) => ({
                    ...prev,
                    actor: next,
                    page: DEFAULT_PAGE,
                }),
                {
                    ...DEFAULT_SET_OPTIONS,
                    limit: debounce(400),
                },
            ),
        [setRawFilters],
    );

    const setSort = useCallback(
        (next: SortValue) =>
            setRawFilters(
                (prev: RawFilters) => ({
                    ...prev,
                    sort: next,
                    page: DEFAULT_PAGE,
                }),
                DEFAULT_SET_OPTIONS,
            ),
        [setRawFilters],
    );

    const toggleGenre = useCallback(
        (id: number) =>
            setRawFilters(
                (prev: RawFilters) => {
                    const exists = prev.genres.includes(id);
                    const nextGenres = exists ? prev.genres.filter((genreId) => genreId !== id) : [...prev.genres, id];
                    return {
                        ...prev,
                        genres: nextGenres,
                        page: DEFAULT_PAGE,
                    };
                },
                DEFAULT_SET_OPTIONS,
            ),
        [setRawFilters],
    );

    const clearGenres = useCallback(
        () =>
            setRawFilters(
                (prev: RawFilters) => ({
                    ...prev,
                    genres: [],
                    page: DEFAULT_PAGE,
                }),
                DEFAULT_SET_OPTIONS,
            ),
        [setRawFilters],
    );

    const clearAll = useCallback(
        () =>
            setRawFilters(
                {
                    search: '',
                    actor: '',
                    sort: DEFAULT_SORT,
                    genres: [],
                    page: DEFAULT_PAGE,
                },
                DEFAULT_SET_OPTIONS,
            ),
        [setRawFilters],
    );

    const setPage = useCallback(
        (page: number) =>
            setRawFilters(
                (prev: RawFilters) => ({
                    ...prev,
                    page: Math.max(DEFAULT_PAGE, page),
                }),
                DEFAULT_SET_OPTIONS,
            ),
        [setRawFilters],
    );

    const {search, actor, sort, genres, page} = rawFilters;

    const filters = useMemo<MovieFilters>(
        () => ({
            search,
            searchDebounced,
            actorName: actor,
            actorNameDebounced: actorDebounced,
            sort,
            selectedGenres: genres,
            page,
            pageSize: DEFAULT_PAGE_SIZE,
            language,
        }),
        [actor, actorDebounced, genres, language, page, search, searchDebounced, sort],
    );

    return {
        search: rawFilters.search,
        searchDebounced,
        actorName: rawFilters.actor,
        actorDebounced,
        sort: rawFilters.sort,
        selectedGenres: rawFilters.genres,
        page: rawFilters.page,
        pageSize: DEFAULT_PAGE_SIZE,
        language,
        filters,
        setSearch,
        setActorName,
        setSort,
        toggleGenre,
        clearGenres,
        clearAll,
        setPage,
    };
}
