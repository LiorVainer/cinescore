import {motion} from 'motion/react';
import {MOVIERCARD_LAYOUT_ID_GENERATORS} from '@/constants/movie-layout-id-generators.const';
import {RelativeDate} from '@/components/ui/relative-date';

export function MovieMeta({
                              title,
                              idSuffix,
                              releaseDate,
                              showDate = false,
                              className,
                              layoutIdEnabled = true,
                          }: {
    title: string;
    idSuffix: string;
    releaseDate?: Date | string | null;
    showDate?: boolean;
    className?: string;
    layoutIdEnabled?: boolean;
}) {
    const date = releaseDate
        ? new Date(releaseDate).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : undefined;

    return (
        <div className={className}>
            {showDate && (
                <motion.p
                    layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.DATE(title, idSuffix) : undefined}
                    className='text-sm text-neutral-500 dark:text-neutral-300'
                >
                    {date}
                </motion.p>
            )}
            {releaseDate && (
                <motion.div
                    layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.SINCE(title, idSuffix) : undefined}
                    className='text-sm text-neutral-500 dark:text-neutral-300'
                >
                    <RelativeDate date={releaseDate} />
                </motion.div>
            )}
        </div>
    );
}

