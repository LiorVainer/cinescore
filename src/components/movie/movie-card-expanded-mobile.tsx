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

export type ExpandedMovieCardMobileProps = {
    movie: MovieWithLanguageTranslation;
    imgSrc: string;
    idSuffix: string;
};

const ExpandedMovieCardMobile = React.memo<ExpandedMovieCardMobileProps>(({ movie, imgSrc, idSuffix }) => {
    const { title, originalTitle, originalLanguage, releaseDate, genres, rating, votes } = movie;
    const locale = useLocale();
    const getLanguageLabel = useLanguageLabel();

    const originalLangLabel = getLanguageLabel(originalLanguage);
    const isLocaleLanguageDiffrentFromOriginal =
        !!originalLanguage && mapLocaleToLanguage(locale) !== originalLanguage;

    return (
        <div className='w-full flex flex-col items-stretch rounded-t-xl relative overflow-hidden'>
            <div className='flex flex-col overflow-y-auto relative z-10'>
                {/* Top section: poster image + title/metadata in row */}
                <div className='flex flex-row gap-4 p-4'>
                    {/* Title and metadata */}
                    <div className='flex-1 min-w-0 flex flex-col gap-2'>
                        <div className='flex-1 min-w-0 py-2'>
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
                        <MovieGenres genres={genres} idSuffix={idSuffix} layoutIdEnabled={false} />
                        <MovieMeta
                            title={title}
                            idSuffix={idSuffix}
                            releaseDate={releaseDate}
                            showDate
                            className='flex flex-col'
                            layoutIdEnabled={false}
                        />
                        <MovieStats rating={rating} votes={votes} size='sm' />
                    </div>

                    {/* Poster image - portrait 2/3 aspect ratio */}
                    <div className='shrink-0'>
                        <Image
                            height={240}
                            width={160}
                            src={imgSrc}
                            alt={title}
                            className='w-32 aspect-[2/3] rounded-lg object-cover object-top'
                            priority
                        />
                    </div>
                </div>

                {/* Bottom section: description, cast, trailers */}
                <div className='flex flex-col gap-4 px-4 pb-4'>
                    <MovieCardContent
                        movie={movie}
                        idSuffix={idSuffix}
                        layoutIdEnabled={false}
                        size='sm'
                    />
                </div>
            </div>
        </div>
    );
});

ExpandedMovieCardMobile.displayName = 'ExpandedMovieCardMobile';

export default ExpandedMovieCardMobile;
