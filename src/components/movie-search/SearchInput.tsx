'use client';

import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

export function SearchInput({ value, onChange }: { value: string; onChange: (next: string) => void }) {
    const t = useTranslations('search');

    return (
        <div className='flex-1 min-w-0'>
            <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={t('placeholder')} />
        </div>
    );
}
