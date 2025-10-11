'use client';

import React from 'react';
import {motion} from 'motion/react';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import {CloseIcon} from './movie-card-utils';
import {MovieGenres} from '@/components/movie/movie-genres';
import ThumbnailButton from '@/components/thumbnail-button-video-player';
import MovieStats from '@/components/movie/MovieStats';
import MovieMeta from '@/components/movie/MovieMeta';
import {getLanguageLabel, LANGUAGE_LABELS} from '@/constants/languages.const';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import {MOVIERCARD_LAYOUT_ID_GENERATORS} from '@/constants/movie-layout-id-generators.const';

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

        // date/since are rendered via MovieMeta; rating/votes via MovieStats
        const originalLangLabel = originalLanguage && LANGUAGE_LABELS[originalLanguage] ? LANGUAGE_LABELS[originalLanguage] : undefined;

        // Disable shared-element layout transitions inside the mobile drawer to avoid double animations
        const layoutIdEnabled = variant !== 'drawer';
        const castMembersToShowAmount = 4;

        const Content = (
            <motion.div
                layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.CARD(title, idSuffix) : undefined}
                ref={ref}
                className={
                    variant === 'drawer'
                        ? 'w-full flex flex-col lg:flex-row items-stretch rounded-t-xl'
                        : 'w-full max-w-[80%] h-[80%] max-h-[80%] flex flex-col lg:flex-row items-stretch rounded-xl bg-background'
                }
            >
                <motion.div
                    layoutId={layoutIdEnabled ? MOVIERCARD_LAYOUT_ID_GENERATORS.IMAGE(title, idSuffix) : undefined}
                    className='shrink-0'
                >
                    <Image
                        height={200}
                        width={300}
                        src={imgSrc}
                        alt={title}
                        className='w-full lg:min-w-[300px] aspect-[16/9] h-full rounded-tl-lg lg:rounded-r-lg lg:rounded-tl-none object-cover object-top'
                    />
                </motion.div>

                <div className='p-6 flex flex-col gap-2 lg:gap-4 flex-1 min-w-0 scrollable h-full w-full'>
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
                                        {originalTitle && originalLangLabel && (
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
                                            size={'sm'}
                                        >
                                            <span className='text-xs'>סגור</span>
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

                        {/* Display cast information */}
                        {cast && cast.length > 0 && (
                            <div className='flex flex-col gap-2'>
                                <h3 className='font-semibold text-sm'>שחקנים:</h3>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-wrap gap-2'>
                                        {cast.slice(0, castMembersToShowAmount).map((castMember) => (
                                            <div key={castMember.id}
                                                 className='text-xs bg-muted p-1 rounded flex flex-col items-center gap-1 flex-1'>
                                                <img src={castMember.actor.profileUrl ?? ''} alt={castMember.actor.name}
                                                     className='w-full aspect-2/3 rounded object-cover object-center'/>
                                                <span className='font-medium'>{castMember.actor.name}</span>
                                                {/*{castMember.character && (*/}
                                                {/*    <span className='text-muted-foreground'> כ{castMember.character}</span>*/}
                                                {/*)}*/}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        {cast.length > castMembersToShowAmount && (
                                            <div className='text-xs text-muted-foreground'>
                                                ועוד {cast.length - 5} שחקנים...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {movie.trailers.length > 0 && (
                        <div className='flex gap-4 mt-4 overflow-x-auto w-full py-2 h-fit'>
                            {movie.trailers.map((trailer) => (
                                <ThumbnailButton
                                    key={trailer.id}
                                    youtubeId={trailer.youtubeId!}
                                    title={trailer.title}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        );

        if (variant === 'drawer') {
            // Render content directly inside DrawerContent
            return Content;
        }

        // Default: modal-style wrapper
        return (
            <div className='fixed inset-0 grid place-items-center z-[100] scrollable rounded-xl '>
                <motion.button
                    key={`button-${title}-${idSuffix}`}
                    layout
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0, transition: {duration: 0.05}}}
                    className={`flex absolute top-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6`}
                    onClick={onClose}
                >
                    <CloseIcon/>
                </motion.button>
                {Content}
            </div>
        );
    },
);

ExpandedMovieCard.displayName = 'ExpandedMovieCard';

export default ExpandedMovieCard;
