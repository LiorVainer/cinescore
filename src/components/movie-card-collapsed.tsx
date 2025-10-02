'use client';

import { motion } from 'motion/react';
import type { PopulatedMovie } from '@/models/movies.model';
import { ImdbLogo } from './imdb-logo';
import { MovieGenres } from '@/components/movie/movie-genres';
import { Star, Users } from 'lucide-react';
import React from 'react';

export type CollapsedMovieCardProps = {
    movie: PopulatedMovie;
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
    const { title, releaseDate, rating, votes } = movie;

    const date = releaseDate ? new Date(releaseDate).toLocaleDateString() : undefined;
    const ratingText = rating != null ? rating.toFixed(1) : 'לא דורג עדיין';
    const votesText = votes != null ? Intl.NumberFormat().format(votes) : undefined;

    return (
        <motion.div
            layoutId={`card-${title}-${idSuffix}`}
            key={`card-${title}-${idSuffix}`}
            onClick={onClickAction}
            className={[
                'p-4 flex justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <div className='flex gap-4 flex-col w-full'>
                <motion.div layoutId={`image-${title}-${idSuffix}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgSrc} alt={title} className='w-full max-h-60 rounded-lg object-cover object-top' />
                </motion.div>

                <div className='flex-1 min-w-0'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between items-center'>
                            <motion.h3
                                layoutId={`title-${title}-${idSuffix}`}
                                className={`font-bold text-neutral-700 dark:text-neutral-200 truncate`}
                                title={title}
                            >
                                {title}
                            </motion.h3>
                            <motion.p
                                layoutId={`year-${title}-${idSuffix}`}
                                className={`text-sm text-neutral-500 dark:text-neutral-400`}
                            >
                                {date}
                            </motion.p>
                        </div>
                        <MovieGenres genres={movie.genres} idSuffix={idSuffix} />
                    </div>

                    <motion.div
                        layoutId={`description-${idSuffix}`}
                        className='text-neutral-600 dark:text-neutral-400 truncate mt-2'
                    >
                        <div className='flex flex-wrap items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <span className='sr-only'>IMDb rating</span>
                                <ImdbLogo className='w-9' height={30} width={30} />
                                {rating && <Star className='w-3 h-3 text-yellow-400' fill='currentColor' />}
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
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
