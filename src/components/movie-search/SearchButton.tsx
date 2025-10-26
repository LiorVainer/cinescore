'use client';

import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFilters } from '@/components/movie-search/FiltersContext';
import { Spinner } from '../ui/spinner';

interface SearchButtonProps {
    onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
    const t = useTranslations('nav');
    const isMobile = useIsMobile();
    const { isLoading } = useFilters();

    return (
        <Button
            variant='outline'
            size={'sm'}
            className='rounded-full font-semibold flex items-center gap-2 flex-1'
            onClick={onClick}
        >
            {isLoading ? <Spinner /> : <Search className='size-4' />}
            <span className='text-xs md:text-sm'>{t('search')}</span>
        </Button>
    );
}
