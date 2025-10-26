'use client';

import {Input} from '@/components/ui/input';
import {useTranslations} from 'next-intl';

interface ActorSearchInputProps {
    value: string;
    onChange: (next: string) => void;
}

export function ActorSearchInput({value, onChange}: ActorSearchInputProps) {
    const t = useTranslations('search');

    return (
        <div className='flex-1 min-w-0'>
            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={t('actorPlaceholder')}
            />
        </div>
    );
}
