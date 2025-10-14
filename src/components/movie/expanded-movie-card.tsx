'use client';

import React from 'react';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import {MovieGenres} from '@/components/movie/movie-genres';
import {MovieMeta} from '@/components/movie/MovieMeta';
import {mapLocaleToLanguage} from '@/constants/languages.const';
import {useLanguageLabel} from '@/hooks/use-language-label';
import Image from 'next/image';
import {useLocale} from 'next-intl';
import {MovieCardHeader} from './movie-card-header';
import {MovieCardContent} from './movie-card-content';
import {MovieStats} from '@/components/movie/MovieStats';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '@/lib/utils';

const expandedMovieCardMobileVariants = cva(
    'w-full flex flex-col items-stretch rounded-t-xl relative',
    {
        variants: {
            size: {
                sm: 'text-xs',
                md: 'text-sm',
                lg: 'text-base',
            },
            spacing: {
                compact: 'gap-2',
                normal: 'gap-4',
                relaxed: 'gap-6',
            },
        },
        defaultVariants: {
            size: 'md',
            spacing: 'normal',
        },
    }
);

const posterVariants = cva('shrink-0', {
    variants: {
        size: {
            sm: 'w-24',
            md: 'w-32',
            lg: 'w-40',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

const posterDimensions = {
    sm: {width: 120, height: 180},
    md: {width: 160, height: 240},
    lg: {width: 200, height: 300},
};

const paddingVariants = cva('', {
    variants: {
        size: {
            sm: 'p-2',
            md: 'p-4',
            lg: 'p-6',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

export type ExpandedMovieCardMobileProps = {
    movie: MovieWithLanguageTranslation;
    imgSrc: string;
    idSuffix: string;
    className?: string;
} & VariantProps<typeof expandedMovieCardMobileVariants>;

const ExpandedMovieCard = React.memo<ExpandedMovieCardMobileProps>(
    ({movie, imgSrc, idSuffix, size = 'md', spacing = 'normal', className}) => {
        const {title, originalTitle, originalLanguage, releaseDate, genres, rating, votes} = movie;
        const locale = useLocale();
        const getLanguageLabel = useLanguageLabel();

        const originalLangLabel = getLanguageLabel(originalLanguage);
        const isLocaleLanguageDiffrentFromOriginal =
            !!originalLanguage && mapLocaleToLanguage(locale) !== originalLanguage;

        const dimensions = posterDimensions[size || 'md'];

        return (
            <div className={cn(expandedMovieCardMobileVariants({size, spacing}), className)}>
                <div className='flex flex-col overflow-y-auto relative z-10'>
                    {/* Top section: poster image + title/metadata in row */}
                    <div
                        className={cn('flex flex-row', paddingVariants({size}), spacing === 'compact' ? 'gap-2' : spacing === 'normal' ? 'gap-4' : 'gap-6')}>
                        {/* Title and metadata */}
                        <div
                            className={cn('flex-1 min-w-0 flex flex-col', spacing === 'compact' ? 'gap-1' : spacing === 'normal' ? 'gap-2' : 'gap-3')}>
                            <div
                                className={cn('flex-1 min-w-0', size === 'sm' ? 'py-1' : size === 'md' ? 'py-2' : 'py-3')}>
                                <MovieCardHeader
                                    title={title}
                                    originalTitle={originalTitle}
                                    originalLangLabel={originalLangLabel}
                                    showOriginal={isLocaleLanguageDiffrentFromOriginal}
                                    idSuffix={idSuffix}
                                    layoutIdEnabled={false}
                                    className='mb-1'
                                />
                            </div>
                            <MovieGenres genres={genres} idSuffix={idSuffix} layoutIdEnabled={false}/>
                            <MovieMeta
                                title={title}
                                idSuffix={idSuffix}
                                releaseDate={releaseDate}
                                showDate
                                className='flex flex-col'
                                layoutIdEnabled={false}
                            />
                            <MovieStats rating={rating} votes={votes} size={size === 'lg' ? 'md' : 'sm'}/>
                        </div>

                        {/* Poster image - portrait 2/3 aspect ratio */}
                        <div className={posterVariants({size})}>
                            <Image
                                height={dimensions.height}
                                width={dimensions.width}
                                src={imgSrc}
                                alt={title}
                                className='w-full aspect-[2/3] rounded-lg object-cover object-top'
                                priority
                            />
                        </div>
                    </div>

                    {/* Bottom section: description, cast, trailers */}
                    <div
                        className={cn('flex flex-col', paddingVariants({size}), spacing === 'compact' ? 'gap-2 pb-2' : spacing === 'normal' ? 'gap-4 pb-4' : 'gap-6 pb-6')}>
                        <MovieCardContent
                            movie={movie}
                            idSuffix={idSuffix}
                            layoutIdEnabled={false}
                            size={size === 'lg' ? 'md' : 'sm'}
                        />
                    </div>
                </div>
            </div>
        );
    }
);

ExpandedMovieCard.displayName = 'ExpandedMovieCardMobile';

export default ExpandedMovieCard;
