'use client';

import React, {Suspense, useMemo, useRef} from 'react';
import {AnimatePresence, LayoutGroup, motion} from 'motion/react';
import {ActorDetailsContent} from '@/components/actor/ActorDetailsContent';
import {MovieWithLanguageTranslation} from '@/models/movies.model';
import ExpandedMovieCard from "@/components/movie/expanded-movie-card";

interface AnimatedContentContainerProps {
    drawerType: 'movie' | 'actor' | null;
    movieId: string | null;
    tmdbActorId: string | null;
    movieData: MovieWithLanguageTranslation | null | undefined;
    actorProfilePath: string | null | undefined;
    isLoadingMovie: boolean;
    onClose: () => void;
    variant: 'drawer' | 'modal';
    containerClassName?: string;
    scrollClassName?: string;
}

const DrawerLoadingFallback = React.memo(function DrawerLoadingFallback() {
    return (
        <div className='flex items-center justify-center h-[60vh]'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
    );
});

export const BackgroundImageTransition = {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as const,
}

export function AnimatedContentContainer({
                                             drawerType,
                                             movieId,
                                             tmdbActorId,
                                             movieData,
                                             actorProfilePath,
                                             isLoadingMovie,
                                             onClose,
                                             variant,
                                             containerClassName = '',
                                             scrollClassName = 'overflow-y-auto w-full',
                                         }: AnimatedContentContainerProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Memoize background URL calculation
    const backgroundImageUrl = useMemo(() => {
        if (drawerType === 'movie' && movieData) {
            return movieData.posterUrl;
        } else if (drawerType === 'actor' && actorProfilePath) {
            return actorProfilePath;
        }
        return null;
    }, [drawerType, movieData, actorProfilePath]);

    // Memoize background transition - match content animation speed

    // Memoize layout transition - synchronized with content
    const layoutTransition = useMemo(
        () => ({
            layout: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1] as const,
            },
        }),
        [],
    );


    return (
        <LayoutGroup>
            {/* Shared background layer - syncs with drawer height changes */}
            <AnimatePresence mode='wait'>
                {backgroundImageUrl && (
                    <motion.div
                        key={`bg-${drawerType}-${movieId || tmdbActorId}`}
                        className={`absolute inset-0 z-0 overflow-hidden ${containerClassName}`}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={BackgroundImageTransition}
                    >
                        <motion.img
                            src={backgroundImageUrl}
                            alt=''
                            className='w-full h-full object-cover'
                            style={{
                                filter: 'blur(15px)',
                                transform: 'scale(1.1)',
                            }}
                        />
                        <div className='absolute inset-0 bg-background/80 dark:bg-background/80'/>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Wrapper container with layout for smooth height transitions */}
            <motion.div className='relative w-full h-full' layout transition={layoutTransition}>
                {/* Show loading indicator during transitions */}
                {isLoadingMovie && (
                    <div className='absolute top-4 right-4 z-50'>
                        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
                    </div>
                )}

                {/* AnimatePresence with wait mode - content exits before new content enters */}
                <AnimatePresence mode='wait' initial={false}>
                    {drawerType === 'movie' && movieData && (
                        <motion.div
                            key={`movie-${movieId}`}
                            initial={{opacity: 0}}
                            animate={{
                                opacity: 1,
                                transition: {
                                    opacity: {
                                        duration: 0.3,
                                    }
                                }
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    opacity: {
                                        duration: 0.2,
                                    }
                                }
                            }}
                            className='w-full h-full'
                        >
                            <motion.div
                                layout
                                ref={scrollContainerRef}
                                className={scrollClassName}
                                transition={layoutTransition}
                            >
                                <Suspense fallback={<DrawerLoadingFallback/>}>
                                    <ExpandedMovieCard
                                        movie={movieData}
                                        imgSrc={movieData.posterUrl || ''}
                                        idSuffix={movieId || ''}
                                        size={variant === 'modal' ? 'lg' : 'md'}
                                    />
                                </Suspense>
                            </motion.div>
                        </motion.div>
                    )}

                    {drawerType === 'actor' && tmdbActorId && (
                        <motion.div
                            key={`actor-${tmdbActorId}`}
                            initial={{opacity: 0}}
                            animate={{
                                opacity: 1,
                                transition: {
                                    opacity: {
                                        duration: 0.3,
                                    }
                                }
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    opacity: {
                                        duration: 0.2,
                                    }
                                }
                            }}
                            className='w-full h-full'
                        >
                            <motion.div
                                layout
                                ref={scrollContainerRef}
                                className={scrollClassName}
                                transition={layoutTransition}
                            >
                                <Suspense fallback={<DrawerLoadingFallback/>}>
                                    <ActorDetailsContent tmdbActorId={tmdbActorId}/>
                                </Suspense>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </LayoutGroup>
    );
}
