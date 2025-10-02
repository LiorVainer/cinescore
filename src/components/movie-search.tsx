'use client';

import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/lib/useDebounce';
import MovieCard from '@/components/movie-card';
import type { PopulatedMovie } from '@/models/movies.model';
import { listGenres, type MovieFilters, searchMoviesFiltered } from '@/app/actions/searchMovies';
import { FilterBar } from '@/components/movie-search/FilterBar';
import type { GenreOption, SortValue } from '@/components/movie-search/constants';
import CollapsedMovieCardSkeleton from '@/components/movie-card-collapsed.skeleton';

const DEFAULT_SORT: SortValue = 'rating:desc';

type MoviesResult = {
    items: PopulatedMovie[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export default function MovieSearch() {
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

    // Genres via server action + TanStack Query
    const { data: genresData } = useQuery<GenreOption[]>({
        queryKey: ['genres'],
        queryFn: async () => listGenres(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    const genres = genresData ?? [];

    // Movies via server action + TanStack Query (simple-query)
    const {
        data: moviesData,
        isFetching,
        isError,
    } = useQuery<MoviesResult>({
        queryKey: ['simple-query', { search: debouncedSearch, sort, selectedGenres, page, pageSize }],
        queryFn: async () =>
            searchMoviesFiltered({
                search: debouncedSearch,
                sort,
                selectedGenres,
                page,
                pageSize,
            } as MovieFilters),
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
        <div className='h-full flex flex-col gap-4 py-4'>
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

            {isError && <div className='text-destructive'>שגיאה בטעינת הנתונים. נסה שוב.</div>}

            {isFetching && items.length === 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {Array.from({ length: 9 }).map((_, i) => (
                        <CollapsedMovieCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto'>
                    {items.map((movie) => (
                        <MovieCard ctaText={'פרטים'} key={movie.id} movie={movie} />
                    ))}

                    {items.length === 0 && !isFetching && (
                        <div className='text-sm text-muted-foreground'>לא נמצאו תוצאות לפי הסינון הנוכחי.</div>
                    )}
                </div>
            )}
        </div>
    );
}
