'use client';

import React from 'react';
import {motion} from 'motion/react';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import {MovieGenres} from '@/components/movie/movie-genres';
import {MovieMeta} from '@/components/movie/MovieMeta';
import {mapLocaleToLanguage} from '@/constants/languages.const';
import {useLanguageLabel} from '@/hooks/use-language-label';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import {MOVIERCARD_LAYOUT_ID_GENERATORS} from '@/constants/movie-layout-id-generators.const';
import {useLocale, useTranslations} from 'next-intl';
import {MovieCardHeader} from './movie-card-header';
import {MovieCardContent} from './movie-card-content';

export type ExpandedMovieCardDesktopProps = {
    movie: MovieWithLanguageTranslation;
    imgSrc: string;
    idSuffix: string;
    onClose: () => void;
};

const ExpandedMovieCardDesktop = React.memo(
    React.forwardRef<HTMLDivElement, ExpandedMovieCardDesktopProps>(({ movie, imgSrc, idSuffix, onClose }, ref) => {
        const { title, originalTitle, originalLanguage, releaseDate, genres } = movie;
        const t = useTranslations('movie');
        const locale = useLocale();
        const getLanguageLabel = useLanguageLabel();

        const originalLangLabel = getLanguageLabel(originalLanguage);
        const isLocaleLanguageDiffrentFromOriginal =
            !!originalLanguage && mapLocaleToLanguage(locale) !== originalLanguage;


        return (
            <div
                className='fixed inset-0 z-[100] overflow-hidden'
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                {/* Backdrop overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    className='absolute inset-0 bg-black/60 backdrop-blur-sm'
                    onClick={onClose}
                />

                {/* Content wrapper */}
                <div className='absolute inset-0 flex items-center justify-center p-4 pointer-events-none'>
                    <div className='pointer-events-auto'>
                        <motion.div
                            layoutId={
                                MOVIERCARD_LAYOUT_ID_GENERATORS.CARD(title, idSuffix)
                            }
                            ref={ref}
                            className='w-[80vw] max-w-[80vw] max-h-[80vh] flex flex-col lg:flex-row items-stretch rounded-xl bg-background overflow-hidden'
                        >
                            {/* Poster section with background */}
                            <motion.div
                                layoutId={
                                        MOVIERCARD_LAYOUT_ID_GENERATORS.IMAGE(title, idSuffix)
                                }
                                className='shrink-0 flex items-center justify-center relative overflow-hidden'
                            >
                                {/* Background image with overlay */}
                                <div className='absolute inset-0 overflow-hidden'>
                                    <Image
                                        src={imgSrc}
                                        alt=''
                                        fill
                                        priority
                                        quality={50}
                                        sizes='(max-width: 1024px) 100vw, 300px'
                                        className='object-cover'
                                        style={{
                                            filter: 'blur(7px)',
                                            transform: 'scale(1.1)',
                                        }}
                                    />
                                    <div className='absolute inset-0 bg-white/80 dark:bg-black/80' />
                                </div>

                                {/* Main poster image */}
                                <Image
                                    height={200}
                                    width={300}
                                    src={imgSrc}
                                    alt={title}
                                    className='w-full lg:min-w-[300px] aspect-[16/9] md:aspect-[2/3] rounded-tl-lg lg:rounded-r-lg lg:rounded-tl-none object-cover object-top relative z-10'
                                    priority
                                    quality={85}
                                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px'
                                />
                            </motion.div>

                            {/* Content section */}
                            <div className='p-6 flex flex-col gap-2 lg:gap-4 flex-1 min-w-0 overflow-y-auto w-full relative z-10'>
                                <div className='flex justify-between items-start gap-2'>
                                    <div className='flex-1 flex flex-col min-w-0 gap-2'>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex justify-between gap-2 items-start'>
                                                <MovieCardHeader
                                                    title={title}
                                                    originalTitle={originalTitle}
                                                    originalLangLabel={originalLangLabel}
                                                    showOriginal={isLocaleLanguageDiffrentFromOriginal}
                                                    idSuffix={idSuffix}
                                                    layoutIdEnabled
                                                />
                                                <Button
                                                    className='shrink-0 inline-flex cursor-pointer'
                                                    onClick={onClose}
                                                >
                                                    <span>{t('close')}</span>
                                                </Button>
                                            </div>
                                            <div className='flex flex-col items-start gap-4'>
                                                <MovieGenres
                                                    genres={genres}
                                                    idSuffix={idSuffix}
                                                    layoutIdEnabled
                                                />
                                                <MovieMeta
                                                    title={title}
                                                    idSuffix={idSuffix}
                                                    releaseDate={releaseDate}
                                                    showDate
                                                    className='flex flex-col'
                                                    layoutIdEnabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <MovieCardContent
                                    movie={movie}
                                    idSuffix={idSuffix}
                                    layoutIdEnabled
                                    size='md'
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }),
);

ExpandedMovieCardDesktop.displayName = 'ExpandedMovieCardDesktop';

export default ExpandedMovieCardDesktop;

