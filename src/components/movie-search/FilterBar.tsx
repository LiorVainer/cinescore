'use client';

import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { SortSelect } from './SortSelect';
import { GenresMultiSelect } from './GenresMultiSelect';
import { SelectedGenreChips } from './SelectedGenreChips';
import { ActorSearchInput } from './ActorSearchInput';
import type { GenreOption, SortValue } from '@/constants/sort.const';
import { useTranslations } from 'next-intl';

export function FilterBar({
    search,
    onSearchChange,
    actorName,
    onActorChange,
    sort,
    onSortChange,
    genres,
    selectedGenres,
    onToggleGenre,
    onClearGenres,
    onClearAll,
}: {
    search: string;
    onSearchChange: (next: string) => void;
    actorName: string;
    onActorChange: (next: string) => void;
    sort: SortValue;
    onSortChange: (next: SortValue) => void;
    genres: GenreOption[];
    selectedGenres: number[];
    onToggleGenre: (id: number) => void;
    onClearGenres: () => void;
    onClearAll: () => void;
}) {
    const t = useTranslations('filters');
    const isDefault =
        search.trim() === '' && actorName.trim() === '' && sort === 'rating:desc' && selectedGenres.length === 0;

    return (
        <div className='flex flex-col gap-3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto] gap-3 items-center w-full'>
                <SearchInput value={search} onChange={onSearchChange} />
                <ActorSearchInput value={actorName} onChange={onActorChange} />
                <SortSelect value={sort} onChange={onSortChange} />
                <GenresMultiSelect
                    genres={genres}
                    selected={selectedGenres}
                    onToggle={onToggleGenre}
                    onClear={onClearGenres}
                />
                {!isDefault && (
                    <Button
                        variant='outline'
                        onClick={onClearAll}
                        className='gap-2 w-full sm:w-auto text-destructive border-destructive/40 hover:bg-destructive/10'
                    >
                        <XIcon className='size-4' /> {t('clearAll')}
                    </Button>
                )}
            </div>

            <div className='w-full'>
                <SelectedGenreChips genres={genres} selected={selectedGenres} onRemove={onToggleGenre} />
            </div>
        </div>
    );
}
