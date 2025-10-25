'use client';

import {MovieSearchContent} from './movie-search';
import {FilterBar} from "@/components/movie-search/FilterBar";
import {useFilters} from "@/components/movie-search/FiltersContext";
import {useQuery} from "@tanstack/react-query";
import {listGenres} from "@/app/actions/searchMovies";

export function SearchModalContent() {
    const {
        search,
        searchDebounced,
        actorName,
        actorDebounced,
        sort,
        selectedGenres,
        page,
        pageSize,
        language,
        filters,
        setSearch,
        setActorName,
        setSort,
        toggleGenre,
        clearGenres,
        clearAll,
    } = useFilters();

    const {data: genresData} = useQuery({
        queryKey: ['genres', language],
        queryFn: () => listGenres(language),
        staleTime: 1000 * 60 * 60,
    });

    const genres = genresData ?? [];

    return (
        <div className='flex flex-col gap-4'>
            <FilterBar
                search={search}
                onSearchChange={(value) => {
                    void setSearch(value);
                }}
                actorName={actorName}
                onActorChange={(value) => {
                    void setActorName(value);
                }}
                sort={sort}
                onSortChange={(value) => {
                    void setSort(value);
                }}
                genres={genres}
                selectedGenres={selectedGenres}
                onToggleGenre={(id) => {
                    void toggleGenre(id);
                }}
                onClearGenres={() => {
                    void clearGenres();
                }}
                onClearAll={() => {
                    void clearAll();
                }}
            />
        </div>
    );
}
