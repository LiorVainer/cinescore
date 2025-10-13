'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ChevronDownIcon, FilterIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { GenreOption } from '@/constants/sort.const';
import { useTranslations } from 'next-intl';

export function GenresMultiSelect({
    genres,
    selected,
    onToggle,
    onClear,
}: {
    genres: GenreOption[];
    selected: number[];
    onToggle: (id: number) => void;
    onClear?: () => void;
}) {
    const [query, setQuery] = useState('');
    const t = useTranslations('genres');

    const filtered = useMemo(() => {
        const f = query.trim().toLowerCase();
        if (!f) return genres;
        return genres.filter((g) => g.name.toLowerCase().includes(f));
    }, [genres, query]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' className='gap-2 w-full sm:w-auto justify-between'>
                    <span className='inline-flex items-center gap-2'>
                        <FilterIcon className='size-4' /> {t('title')}
                    </span>
                    <span className='opacity-60 text-xs'>
                        {selected.length > 0 ? t('selected', { count: selected.length }) : t('noFilter')}
                    </span>
                    <ChevronDownIcon className='size-4 opacity-60' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-64 p-2'>
                <DropdownMenuLabel>{t('filter')}</DropdownMenuLabel>
                <div className='p-1'>
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('filterPlaceholder')}
                    />
                </div>
                <DropdownMenuSeparator />
                <div className='max-h-72 overflow-y-auto pe-1'>
                    {filtered.map((g) => (
                        <DropdownMenuCheckboxItem
                            key={g.id}
                            checked={selected.includes(g.id)}
                            onCheckedChange={() => onToggle(g.id)}
                            onSelect={(e) => e.preventDefault()}
                        >
                            {g.name}
                        </DropdownMenuCheckboxItem>
                    ))}
                    {filtered.length === 0 && <DropdownMenuItem disabled>{t('noGenresFound')}</DropdownMenuItem>}
                </div>
                {selected.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className='p-2'>
                            <Button size='sm' variant='ghost' onClick={onClear} className='w-full'>
                                {t('clearSelection')}
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
