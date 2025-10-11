import {ImdbLogo} from '@/components/movie/imdb-logo';
import {cn} from '@/lib/utils';
import {Star, Users} from 'lucide-react';

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
    const ratingText = rating != null ? rating.toFixed(1) : 'לא דורג עדיין';
    const votesText = votes != null ? Intl.NumberFormat().format(votes) : undefined;

    const imdbSize = size === 'sm' ? 'w-7' : 'w-9';
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    const textSize = size === 'sm' ? 'text-sm' : 'text-base';

    return (
        <div className={cn('flex items-center gap-4', textSize, className)}>
            <div className='flex items-center gap-2'>
                <ImdbLogo className={imdbSize} height={30} width={30} />
                <span className='sr-only'>IMDb rating</span>
                {rating && <Star className={`${starSize} text-yellow-400`} fill='currentColor' />}
                <span>{ratingText}</span>
            </div>

            {votesText && (
                <div className='flex items-center gap-2 text-neutral-500 dark:text-neutral-400'>
                    <Users className='w-4 h-4' />
                    <span className='sr-only'>Votes</span>
                    <span>{votesText}</span>
                </div>
            )}
        </div>
    );
}

export default MovieStats;
