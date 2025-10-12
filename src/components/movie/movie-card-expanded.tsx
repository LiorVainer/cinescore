'use client';

import React from 'react';
import {motion} from 'motion/react';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import {MovieGenres} from '@/components/movie/movie-genres';
import {MovieCastSection} from '@/components/movie/movie-cast-section';
import {MovieTrailersSection} from '@/components/movie/movie-trailers-section';
import MovieStats from '@/components/movie/MovieStats';
import {MovieMeta} from '@/components/movie/MovieMeta';
import {mapLocaleToLanguage} from '@/constants/languages.const';
import {useLanguageLabel} from '@/hooks/use-language-label';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import {MOVIERCARD_LAYOUT_ID_GENERATORS} from '@/constants/movie-layout-id-generators.const';
import {useTranslations, useLocale} from 'next-intl';

export type ExpandedMovieCardProps = {
    movie: MovieWithLanguageTranslation;
    imgSrc: string;
    idSuffix: string; // from useId()
    onClose: () => void;
    variant?: 'modal' | 'drawer';
};

const ExpandedMovieCard = React.forwardRef<HTMLDivElement, ExpandedMovieCardProps>(
    ({movie, imgSrc, idSuffix, onClose, variant = 'modal'}, ref) => {
        const {title, originalTitle, originalLanguage, releaseDate, rating, votes, genres, cast} = movie;
        const t = useTranslations('movie');
        const locale = useLocale();
        const getLanguageLabel = useLanguageLabel();

        // date/since are rendered via MovieMeta; rating/votes via MovieStats
        const originalLangLabel = getLanguageLabel(originalLanguage);
        const isLocaleLanguageDiffrentFromOriginal = !!originalLanguage && mapLocaleToLanguage(locale) !== originalLanguage;

        // Disable shared-element layout transitions inside the mobile drawer to avoid double animations
        const layoutIdEnabled = variant !== 'drawer';

        // Calculate items per row based on grid columns

        const Content = (
            <motion.div
                layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.CARD(title, idSuffix) : undefined}
                ref={ref}
                className={
                    variant === 'drawer'
                        ? 'w-full flex flex-col lg:flex-row items-stretch rounded-t-xl'
                        : 'w-[80vw] max-w-[80%] max-h-[80%] flex flex-col lg:flex-row items-stretch rounded-xl bg-background overflow-hidden'
                }
            >
                <motion.div
                    layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.IMAGE(title, idSuffix) : undefined}
                    className='shrink-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center'
                >
                    <Image
                        height={200}
                        width={300}
                        src={imgSrc}
                        alt={title}
                        className='w-full lg:min-w-[300px] aspect-[16/9] md:aspect-[2/3] rounded-tl-lg lg:rounded-r-lg lg:rounded-tl-none object-cover object-top'
                    />
                </motion.div>

                <div className='p-6 flex flex-col gap-2 lg:gap-4 flex-1 min-w-0 overflow-y-auto w-full'>
                    <div className={`flex justify-between items-start gap-2`}>
                        <div className='flex-1 flex flex-col min-w-0 gap-2'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex justify-between gap-2 items-start'>
                                    <div className='flex-1 min-w-0'>
                                        <motion.h1
                                            layoutId={
                                                layoutIdEnabled
                                                    ? MOVIERCARD_LAYOUT_ID_GENERATORS.TITLE(title, idSuffix)
                                                    : undefined
                                            }
                                            className={`font-bold text-neutral-700 dark:text-neutral-200 truncate lg:text-xl leading-none`}
                                            title={title}
                                        >
                                            {title}
                                        </motion.h1>
                                        {isLocaleLanguageDiffrentFromOriginal && originalLangLabel && (
                                            <motion.p
                                                layoutId={
                                                    layoutIdEnabled
                                                        ? MOVIERCARD_LAYOUT_ID_GENERATORS.ORIGINAL(title, idSuffix)
                                                        : undefined
                                                }
                                                className={`text-neutral-500 dark:text-neutral-400 text-sm lg:text-base truncate`}
                                            >
                                                {originalTitle} ({originalLangLabel})
                                            </motion.p>
                                        )}
                                    </div>
                                    {variant === 'modal' && (
                                        <Button
                                            className='shrink-0 inline-flex cursor-pointer'
                                            onClick={() => onClose()}
                                        >
                                            <span>{t('close')}</span>
                                        </Button>
                                    )}
                                </div>
                                <div className='flex flex-col items-start gap-4'>
                                    <MovieGenres
                                        genres={genres}
                                        idSuffix={idSuffix}
                                        layoutIdEnabled={layoutIdEnabled}
                                    />
                                    <MovieMeta
                                        title={title}
                                        idSuffix={idSuffix}
                                        releaseDate={releaseDate}
                                        showDate
                                        className='flex flex-col'
                                        layoutIdEnabled={layoutIdEnabled}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <motion.p
                            className={`text-neutral-600 dark:text-neutral-400 text-sm lg:text-base`}
                            layoutId={
                                layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.DESCRIPTION(idSuffix) : undefined
                            }
                        >
                            {movie.description}
                        </motion.p>

                        <MovieStats rating={rating} votes={votes} size='sm' className='mt-2'/>

                        <MovieCastSection cast={cast}/>

                        <MovieTrailersSection trailers={movie.trailers}/>
                    </div>
                </div>
            </motion.div>
        );

        if (variant === 'drawer') {
            // Render content directly inside DrawerContent
            return Content;
        }

        // Default: modal-style wrapper
        return (
            <div
                className='fixed inset-0 z-[100] overflow-hidden'
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                {/* Backdrop overlay to capture events and prevent passthrough */}
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0, transition: {duration: 0.15}}}
                    className='absolute inset-0 bg-black/60 backdrop-blur-sm'
                    onClick={onClose}
                />
                {/* Content wrapper - positioned above backdrop, centered, with pointer events enabled */}
                <div className='absolute inset-0 flex items-center justify-center p-4 pointer-events-none'>
                    <div className='pointer-events-auto'>
                        {Content}
                    </div>
                </div>
            </div>
        );
    },
);

ExpandedMovieCard.displayName = 'ExpandedMovieCard';

export default ExpandedMovieCard;
