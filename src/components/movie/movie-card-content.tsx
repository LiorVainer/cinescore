'use client';

import React from 'react';
import {motion} from 'motion/react';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import {MovieCastSection} from '@/components/movie/movie-cast-section';
import {MovieTrailersSection} from '@/components/movie/movie-trailers-section';
import {MOVIERCARD_LAYOUT_ID_GENERATORS} from '@/constants/movie-layout-id-generators.const';

type MovieCardContentProps = {
    movie: MovieWithLanguageTranslation;
    idSuffix: string;
    layoutIdEnabled: boolean;
    size?: 'sm' | 'md';
};

export const MovieCardContent = ({ movie, idSuffix, layoutIdEnabled, size = 'sm' }: MovieCardContentProps) => {
    const { description, cast, trailers } = movie;

    return (
        <div className='flex flex-col gap-4'>
            <motion.p
                className={`text-neutral-600 dark:text-neutral-400 ${size === 'sm' ? 'text-sm' : 'text-sm lg:text-base'}`}
                layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.DESCRIPTION(idSuffix) : undefined}
            >
                {description}
            </motion.p>

            <MovieCastSection cast={cast} />

            <MovieTrailersSection trailers={trailers} />
        </div>
    );
};

