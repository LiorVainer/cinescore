'use client';

import {motion} from 'motion/react';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import {MovieGenres} from '@/components/movie/movie-genres';
import React from 'react';
import Image from 'next/image';
import {MOVIERCARD_LAYOUT_ID_GENERATORS} from '@/constants/movie-layout-id-generators.const';
import MovieStats from '@/components/movie/MovieStats';
import {MovieMeta} from '@/components/movie/MovieMeta';

export type CollapsedMovieCardProps = {
    movie: MovieWithLanguageTranslation;
    imgSrc: string;
    idSuffix: string; // from useId()
    className?: string;
    onClickAction: () => void; // open handler (renamed for Next.js client props rule)
};

export default function CollapsedMovieCard({
                                               imgSrc,
                                               idSuffix,
                                               movie,
                                               className,
                                               onClickAction,
                                           }: CollapsedMovieCardProps) {
    const {title, releaseDate, rating, votes} = movie;

    return (
        <motion.div
            layoutId={MOVIERCARD_LAYOUT_ID_GENERATORS.CARD(title, idSuffix)}
            key={`card-${title}-${idSuffix}`}
            onClick={onClickAction}
            className={[
                'flex justify-between items-stretch hover:bg-muted  rounded-xl cursor-pointer border overflow-hidden',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <div className='flex w-full items-stretch'>
                <motion.div layoutId={MOVIERCARD_LAYOUT_ID_GENERATORS.IMAGE(title, idSuffix)} className='shrink-0'>
                    <Image
                        height={200}
                        width={300}
                        src={imgSrc}
                        alt={title}
                        className='w-24 md:w-32 lg:w-40 rounded-r-lg object-cover object-top'
                    />
                </motion.div>

                <div className='flex-1 min-w-0 p-4 box-border flex flex-col justify-between h-full'>
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
                        <MovieGenres genres={movie.genres} idSuffix={idSuffix}/>
                        <MovieMeta title={title} idSuffix={idSuffix} releaseDate={releaseDate}/>
                    </div>

                    <motion.div layoutId={MOVIERCARD_LAYOUT_ID_GENERATORS.DESCRIPTION(idSuffix)}>
                        <MovieStats rating={rating} votes={votes} size='sm'/>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
