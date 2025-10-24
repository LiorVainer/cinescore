'use client';

import React from 'react';
import ThumbnailButton from '@/components/thumbnail-button-video-player';
import { useTranslations } from 'next-intl';
import { motion, Variants } from 'motion/react';
import type { MovieWithLanguageTranslation } from '@/models/movies.model';

type MovieTrailersSectionProps = {
    trailers: MovieWithLanguageTranslation['trailers'];
};

export const MovieTrailersSection = ({ trailers }: MovieTrailersSectionProps) => {
    const t = useTranslations('movie');

    if (!trailers || trailers.length === 0) {
        return null;
    }

    // Container animation variants with stagger
    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    // Individual trailer animation variants
    const trailerVariants: Variants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    return (
        <div className='flex flex-col gap-2'>
            <h3 className='font-semibold text-sm'>{t('trailers')}</h3>
            <motion.div
                className='flex gap-4 overflow-x-auto py-2'
                variants={containerVariants}
                initial='hidden'
                animate='visible'
            >
                {trailers.map((trailer) => (
                    <motion.div key={trailer.id} variants={trailerVariants}>
                        <ThumbnailButton
                            youtubeId={trailer.youtubeId!}
                            title={trailer.title}
                            className='aspect-video h-32 shrink-0'
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};
