'use client';

import { Input } from '@/components/ui/input';

export function SearchInput({
    value,
    onChange,
    placeholder = 'חפש לפי כותרת או שם מקורי...',
}: {
    value: string;
    onChange: (next: string) => void;
    placeholder?: string;
}) {
    return (
        <div className='flex-1 min-w-0'>
            <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        </div>
    );
}
