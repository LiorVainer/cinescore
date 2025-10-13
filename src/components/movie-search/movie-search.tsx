'use client';

import {useEffect, useState} from 'react';
import {SortValue} from '@/constants/sort.const';
import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {useDebounce} from '@/lib/useDebounce';
import MovieCard from '@/components/movie/movie-card';
import {listGenres, searchMoviesFiltered} from '@/app/actions/searchMovies';
import {FilterBar} from '@/components/movie-search/FilterBar';
import CollapsedMovieCardSkeleton from '@/components/movie/movie-card-collapsed.skeleton';
import {useLocale, useTranslations} from 'next-intl';
import {mapLocaleToLanguage} from '@/constants/languages.const';

const DEFAULT_SORT = 'rating:desc';

export default function MovieSearch() {
    const t = useTranslations('search');
    const locale = useLocale();
    const currentLanguage = mapLocaleToLanguage(locale);
    const tMovie = useTranslations('movie');

    // Filters state
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 400);

    const [sort, setSort] = useState<SortValue>(DEFAULT_SORT);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const selectedGenresKey = selectedGenres.join(',');
    const [page, setPage] = useState(1);
    const pageSize = 24;

    // Reset page when core filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, sort, selectedGenresKey]);

    // Genres via server action + TanStack Query (now language-aware)
    const {data: genresData} = useQuery({
        queryKey: ['genres', currentLanguage],
        queryFn: async () => listGenres(currentLanguage),
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    const genres = genresData ?? [];

    // Movies via server action + TanStack Query (now language-aware)
    const {
        data: moviesData,
        isFetching,
        isError,
    } = useQuery({
        queryKey: [
            'movies-search',
            {
                search: debouncedSearch,
                sort,
                selectedGenres,
                page,
                pageSize,
                language: currentLanguage,
            },
        ],
        queryFn: async () =>
            searchMoviesFiltered({
                search: debouncedSearch,
                sort,
                selectedGenres,
                page,
                pageSize,
                language: currentLanguage,
            }),
        placeholderData: keepPreviousData,
    });

    // Handlers
    const toggleGenre = (id: number) => {
        setSelectedGenres((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
    };

    const clearFilters = () => {
        setSearch('');
        setSort(DEFAULT_SORT);
        setSelectedGenres([]);
        setPage(1);
    };

    const items = moviesData?.items ?? [];

    return (
        <div className='h-full flex flex-col gap-4 p-2 lg:p-0 lg:py-8 overflow-y-auto'>
            <FilterBar
                search={search}
                onSearchChange={setSearch}
                sort={sort}
                onSortChange={setSort}
                genres={genres}
                selectedGenres={selectedGenres}
                onToggleGenre={toggleGenre}
                onClearGenres={() => setSelectedGenres([])}
                onClearAll={clearFilters}
            />

            {isError && <div className='text-destructive'>{t('errorLoading')}</div>}

            {isFetching && items.length === 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8'>
                    {Array.from({length: 9}).map((_, i) => (
                        <CollapsedMovieCardSkeleton key={i}/>
                    ))}
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 overflow-y-auto'>
                    {items.map((movie) => (
                        <MovieCard ctaText={tMovie('details')} key={movie.id} movie={movie}/>
                    ))}

                    {items.length === 0 && !isFetching && (
                        <div className='text-sm text-muted-foreground'>{t('noResults')}</div>
                    )}
                </div>
            )}
        </div>
    );
}
