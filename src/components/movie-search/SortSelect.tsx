'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SortValue, useSortOptions } from '@/constants/sort.const';
import { useTranslations } from 'next-intl';

export function SortSelect({ value, onChange }: { value: SortValue; onChange: (v: SortValue) => void }) {
    const sortOptions = useSortOptions();
    const t = useTranslations('filters');

    return (
        <Select value={value} onValueChange={(v) => onChange(v as SortValue)}>
            <SelectTrigger className='min-w-[220px] w-full sm:w-auto'>
                <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
                {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
