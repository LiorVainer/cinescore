'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SORT_OPTIONS, type SortValue } from './constants';

export function SortSelect({ value, onChange }: { value: SortValue; onChange: (v: SortValue) => void }) {
    return (
        <Select dir='rtl' value={value} onValueChange={(v) => onChange(v as SortValue)}>
            <SelectTrigger className='min-w-[220px] w-full sm:w-auto'>
                <SelectValue placeholder='סדר לפי' />
            </SelectTrigger>
            <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
