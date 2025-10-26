'use client';

import { Badge } from '@/components/ui/badge';
import { XIcon } from 'lucide-react';
import type { GenreOption } from '@/constants/sort.const';
import { useTranslations } from 'next-intl';

export function SelectedGenreChips({
    genres,
    selected,
    onRemove,
}: {
    genres: GenreOption[];
    selected: number[];
    onRemove: (id: number) => void;
}) {
    const t = useTranslations('genres');

    if (selected.length === 0) return null;

    return (
        <div className='flex flex-wrap gap-2'>
            {selected.map((id) => {
                const g = genres.find((x) => x.id === id);
                if (!g) return null;
                return (
                    <Badge
                        key={id}
                        variant='secondary'
                        onClick={() => onRemove(id)}
                        className='flex items-center gap-1 px-0 ps-2 cursor-pointer'
                    >
                        {g.name}
                        <button className='p-1' aria-label={t('removeGenre', { name: g.name })}>
                            <XIcon className='size-3 opacity-70' />
                        </button>
                    </Badge>
                );
            })}
        </div>
    );
}
