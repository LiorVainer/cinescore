'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MOVIERCARD_LAYOUT_ID_GENERATORS } from '@/constants/movie-layout-id-generators.const';
import { useTranslations } from 'next-intl';

type MovieCardHeaderProps = {
    title: string;
    originalTitle?: string | null;
    originalLangLabel?: string | null;
    showOriginal: boolean;
    idSuffix: string;
    layoutIdEnabled: boolean;
    runtime?: number | null;
    className?: string;
};

export const MovieCardHeader = ({
    title,
    originalTitle,
    originalLangLabel,
    showOriginal,
    idSuffix,
    layoutIdEnabled,
    runtime,
    className = '',
}: MovieCardHeaderProps) => {
    const t = useTranslations('time');
    return (
        <div className={`flex-1 min-w-0 ${className}`}>
            <motion.h1
                layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.TITLE(title, idSuffix) : undefined}
                className='font-bold text-neutral-700 dark:text-neutral-200 text-lg lg:text-xl leading-none'
                title={title}
            >
                {title}
            </motion.h1>
            {showOriginal && originalLangLabel && (
                <motion.p
                    layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.ORIGINAL(title, idSuffix) : undefined}
                    className='text-neutral-500 dark:text-neutral-400 text-sm lg:text-base'
                >
                    {originalTitle} ({originalLangLabel})
                </motion.p>
            )}
            {!!runtime && runtime !== 0 && (
                <motion.p
                    layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.RUNTIME(title, idSuffix) : undefined}
                    className='text-neutral-500 dark:text-neutral-400 text-sm lg:text-base'
                >
                    {t('minutes', { count: runtime })}
                </motion.p>
            )}
        </div>
    );
};
