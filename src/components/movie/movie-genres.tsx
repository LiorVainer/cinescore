import { motion } from 'motion/react';
import { MOVIERCARD_LAYOUT_ID_GENERATORS } from '@/constants/movie-layout-id-generators.const';

// Type for genres with translated names from MovieWithLanguageTranslation
type GenreWithTranslation = {
    id: string;
    name: string;
    tmdbId: number | null;
};

export type MovieGenresProps = {
    genres: GenreWithTranslation[]; // Now uses the translated genre type
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
                    className='whitespace-nowrap text-xs bg-muted text-accent-foreground px-2 py-1 rounded-full'
                >
                    {g.name}
                </span>
            ))}
        </motion.div>
    );
};
