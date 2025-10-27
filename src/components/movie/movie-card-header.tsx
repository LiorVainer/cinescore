'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MOVIERCARD_LAYOUT_ID_GENERATORS } from '@/constants/movie-layout-id-generators.const';

type MovieCardHeaderProps = {
    title: string;
    originalTitle?: string | null;
    originalLangLabel?: string | null;
    showOriginal: boolean;
    idSuffix: string;
    layoutIdEnabled: boolean;
    className?: string;
};

export const MovieCardHeader = ({
    title,
    originalTitle,
    originalLangLabel,
    showOriginal,
    idSuffix,
    layoutIdEnabled,
    className = '',
}: MovieCardHeaderProps) => {
    return (
        <div className={`flex-1 min-w-0 ${className}`}>
            <motion.h1
                layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.TITLE(title, idSuffix) : undefined}
                className='font-bold text-neutral-700 dark:text-neutral-200 truncate lg:text-xl leading-none'
                title={title}
            >
                {title}
            </motion.h1>
            {showOriginal && originalLangLabel && (
                <motion.p
                    layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.ORIGINAL(title, idSuffix) : undefined}
                    className='text-neutral-500 dark:text-neutral-400 text-sm lg:text-base truncate'
                >
                    {originalTitle} ({originalLangLabel})
                </motion.p>
            )}
        </div>
    );
};
