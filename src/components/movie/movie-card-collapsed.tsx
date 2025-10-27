'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { MovieWithLanguageTranslation } from '@/models/movies.model';
import { MovieGenres } from '@/components/movie/movie-genres';
import React from 'react';
import Image from 'next/image';
import { MOVIERCARD_LAYOUT_ID_GENERATORS } from '@/constants/movie-layout-id-generators.const';
import MovieStats from '@/components/movie/MovieStats';
import { MovieMeta } from '@/components/movie/MovieMeta';
import { BackgroundImageTransition } from '@/components/shared/AnimatedContentContainer';

export type CollapsedMovieCardProps = {
    movie: MovieWithLanguageTranslation;
    imgSrc: string;
    idSuffix: string; // from useId()
    className?: string;
    containerClassName?: string;
    onClickAction: () => void; // open handler (renamed for Next.js client props rule)
};

export default function CollapsedMovieCard({
    imgSrc,
    idSuffix,
    movie,
    className,
    containerClassName,
    onClickAction,
}: CollapsedMovieCardProps) {
    const { title, releaseDate, rating, votes } = movie;

    return (
        <motion.div
            layoutId={MOVIERCARD_LAYOUT_ID_GENERATORS.CARD(title, idSuffix)}
            key={`card-${title}-${idSuffix}`}
            onClick={onClickAction}
            className={[
                'flex justify-between items-stretch hover:bg-muted rounded-xl cursor-pointer shadow-md overflow-hidden relative',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {/* Background image layer */}
            <AnimatePresence mode='wait'>
                {imgSrc && (
                    <motion.div
                        key={`bg-${idSuffix}`}
                        className={`absolute inset-0 z-0 overflow-hidden rounded-xl ${containerClassName}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={BackgroundImageTransition}
                    >
                        <motion.img
                            src={imgSrc}
                            alt=''
                            className='w-full h-full object-cover'
                            style={{
                                filter: 'blur(15px)',
                                transform: 'scale(1.1)',
                            }}
                        />
                        <div className='absolute inset-0 bg-background/70' />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content layer */}
            <div className='flex w-full items-stretch relative z-10 h-full'>
                <motion.div layoutId={MOVIERCARD_LAYOUT_ID_GENERATORS.IMAGE(title, idSuffix)} className='shrink-0'>
                    <Image
                        height={200}
                        width={300}
                        src={imgSrc}
                        alt={title}
                        className='w-24 md:w-32 lg:w-40 rounded-r-lg object-cover object-top aspect-[2/3]'
                        loading='eager'
                        sizes='(max-width: 768px) 96px, (max-width: 1024px) 128px, 160px'
                        quality={75}
                    />
                </motion.div>

                <div className='flex-1 min-w-0 p-4 box-border flex flex-col justify-between h-full justify-between gap-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between items-center'>
                            <motion.h3
                                layoutId={MOVIERCARD_LAYOUT_ID_GENERATORS.TITLE(title, idSuffix)}
                                className={`font-bold text-sm md:text-lg text-neutral-700 dark:text-neutral-200 truncate leading-none`}
                                title={title}
                            >
                                {title}
                            </motion.h3>
                        </div>
                        <MovieGenres genres={movie.genres} idSuffix={idSuffix} />
                        <MovieMeta title={title} idSuffix={idSuffix} releaseDate={releaseDate} />
                    </div>

                    <motion.div layoutId={MOVIERCARD_LAYOUT_ID_GENERATORS.DESCRIPTION(idSuffix)}>
                        <MovieStats rating={rating} votes={votes} size='sm' />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
