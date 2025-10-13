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
                        ? 'w-full flex flex-col items-stretch rounded-t-xl relative overflow-hidden'
                        : 'w-[80vw] max-w-[80vw] max-h-[80vh] flex flex-col lg:flex-row items-stretch rounded-xl bg-background overflow-hidden'
                }
            >
                {/* Background image with overlay - only for mobile/drawer variant */}
                {variant === 'drawer' && (
                    <div
                        className='absolute inset-0 z-0'
                        style={{
                            backgroundImage: `url(${imgSrc})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(15px)',
                            transform: 'scale(1.1)',
                        }}
                    >
                        <div className='absolute inset-0 bg-background/80 dark:bg-background/80'/>
                    </div>
                )}

                {/* Desktop modal layout - side by side */}
                {variant === 'modal' && (
                    <>
                        <motion.div
                            layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.IMAGE(title, idSuffix) : undefined}
                            className='shrink-0 flex items-center justify-center relative overflow-hidden'
                        >
                            {/* Background image with overlay - only for desktop/modal variant */}
                            <div
                                className='absolute inset-0'
                                style={{
                                    backgroundImage: `url(${imgSrc})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: 'blur(7px)',
                                    transform: 'scale(1.1)',
                                }}
                            >
                                <div className='absolute inset-0 bg-white/80 dark:bg-black/80'/>
                            </div>

                            {/* Main poster image */}
                            <Image
                                height={200}
                                width={300}
                                src={imgSrc}
                                alt={title}
                                className='w-full lg:min-w-[300px] aspect-[16/9] md:aspect-[2/3] rounded-tl-lg lg:rounded-r-lg lg:rounded-tl-none object-cover object-top relative z-10'
                                priority
                            />
                        </motion.div>

                        <div
                            className='p-6 flex flex-col gap-2 lg:gap-4 flex-1 min-w-0 overflow-y-auto w-full relative z-10'>
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
                                            <Button
                                                className='shrink-0 inline-flex cursor-pointer'
                                                onClick={() => onClose()}
                                            >
                                                <span>{t('close')}</span>
                                            </Button>
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
                    </>
                )}

                {/* Mobile drawer layout - poster in flex row with title/metadata */}
                {variant === 'drawer' && (
                    <div className='flex flex-col overflow-y-auto relative z-10'>
                        {/* Top section: poster image + title/metadata in row */}
                        <div className='flex flex-row gap-4 p-4'>

                            {/* Title and metadata */}
                            <div className='flex-1 min-w-0 flex flex-col gap-2'>
                                <div className='flex-1 min-w-0 py-2'>
                                    <motion.h1
                                        layoutId={
                                            layoutIdEnabled
                                                ? MOVIERCARD_LAYOUT_ID_GENERATORS.TITLE(title, idSuffix)
                                                : undefined
                                        }
                                        className={`font-bold text-neutral-700 dark:text-neutral-200 text-lg leading-tight mb-1`}
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
                                            className={`text-neutral-500 dark:text-neutral-400 text-sm`}
                                        >
                                            {originalTitle} ({originalLangLabel})
                                        </motion.p>
                                    )}
                                </div>
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
                                <MovieStats rating={rating} votes={votes} size='sm'/>

                                {/* Poster image - portrait 2/3 aspect ratio */}
                            </div>
                            <motion.div
                                layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.IMAGE(title, idSuffix) : undefined}
                                className='shrink-0'
                            >
                                <Image
                                    height={240}
                                    width={160}
                                    src={imgSrc}
                                    alt={title}
                                    className='w-32 aspect-[2/3] rounded-lg object-cover object-top'
                                    priority
                                />
                            </motion.div>
                        </div>

                        {/* Bottom section: description, cast, trailers */}
                        <div className='flex flex-col gap-4 px-4 pb-4'>
                            <motion.p
                                className={`text-neutral-600 dark:text-neutral-400 text-sm`}
                                layoutId={
                                    layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.DESCRIPTION(idSuffix) : undefined
                                }
                            >
                                {movie.description}
                            </motion.p>

                            <MovieCastSection cast={cast}/>

                            <MovieTrailersSection trailers={movie.trailers}/>
                        </div>
                    </div>
                )}
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
