import { ImdbLogo } from '@/components/movie/imdb-logo';
import { cn } from '@/lib/utils';
import { Star, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function MovieStats({
    rating,
    votes,
    size = 'md',
    className,
}: {
    rating?: number | null;
    votes?: number | null;
    size?: 'sm' | 'md';
    className?: string;
}) {
    const t = useTranslations('rating');

    const ratingText = rating != null ? rating.toFixed(1) : 'לא דורג עדיין';

    const imdbSize = size === 'sm' ? 'w-7' : 'w-9';
    const textSize = size === 'sm' ? 'text-sm' : 'text-base';

    return (
        <div className={cn('flex items-center gap-4', textSize, className)}>
            <div className='flex items-center gap-2'>
                <ImdbLogo className={imdbSize} height={30} width={30} />
                <span className='sr-only'>IMDb rating</span>
                {/*{rating && <Star className={`${starSize} text-yellow-400`} fill='currentColor' />}*/}
                <span className='font-semibold'>{ratingText}</span>
                {votes && <span className='text-neutral-400'>({t('votes', { count: votes })})</span>}
            </div>
        </div>
    );
}

export default MovieStats;
