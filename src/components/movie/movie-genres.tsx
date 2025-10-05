import { motion } from 'motion/react';
import { Genre } from '@prisma/client';
import { MOVIERCARD_LAYOUT_ID_GENERATORS } from '@/constants/movie-layout-id-generators.const';

export type MovieGenresProps = {
    genres: Genre[];
    idSuffix: string;
    layoutIdEnabled?: boolean;
};

export const MovieGenres = ({ genres, idSuffix, layoutIdEnabled = true }: MovieGenresProps) => {
    return (
        <motion.div
            layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.GENRES(idSuffix) : undefined}
            className='flex flex-nowrap items-center overflow-x-auto gap-1 mt-1'
        >
            {genres?.map((g) => (
                <span
                    key={g.id}
                    className='whitespace-nowrap text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-full'
                >
                    {g.name}
                </span>
            ))}
        </motion.div>
    );
};
