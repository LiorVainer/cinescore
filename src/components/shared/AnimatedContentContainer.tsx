'use client';

import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ActorDetailsContent } from '@/components/actor/ActorDetailsContent';
import { MovieWithLanguageTranslation } from '@/models/movies.model';
import ExpandedMovieCard from '@/components/movie/expanded-movie-card';

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
};

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
}: AnimatedContentContainerProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // scroll to top when switching items
    useEffect(() => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    }, [drawerType, movieId, tmdbActorId]);

    const backgroundImageUrl = useMemo(() => {
        console.log({ drawerType, movieData, actorProfilePath });
        if (drawerType === 'movie' && movieData) return movieData.posterUrl;
        if (drawerType === 'actor' && actorProfilePath) return actorProfilePath;
        return null;
    }, [drawerType, movieData, actorProfilePath]);

    const layoutTransition = useMemo(
        () => ({
            layout: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
        }),
        [],
    );

    return (
        <motion.div
            layout
            transition={layoutTransition}
            className={`relative flex flex-col overflow-hidden rounded-t-xl ${variant === 'modal' ? 'rounded-xl' : ''}`}
        >
            {/* Background layer */}
            <AnimatePresence mode='wait'>
                {backgroundImageUrl && (
                    <motion.div
                        key={`bg-${drawerType}-${movieId || tmdbActorId}`}
                        className={`absolute inset-0 z-0 overflow-hidden ${containerClassName}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
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
                        <div className='absolute inset-0 bg-background/80 dark:bg-background/80' />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scrollable content area */}
            <div ref={scrollContainerRef} className='relative z-10 overflow-y-auto max-h-[90vh]'>
                {isLoadingMovie && (
                    <div className='absolute top-4 right-4 z-50'>
                        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
                    </div>
                )}

                <AnimatePresence
                    mode='wait'
                    initial={false}
                    onExitComplete={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' })}
                >
                    {drawerType === 'movie' && movieData && (
                        <motion.div
                            key={`movie-${movieId}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.3 } }}
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            layout
                        >
                            <Suspense fallback={<DrawerLoadingFallback />}>
                                <ExpandedMovieCard
                                    movie={movieData}
                                    imgSrc={movieData.posterUrl || ''}
                                    idSuffix={movieId || ''}
                                    size={variant === 'modal' ? 'lg' : 'md'}
                                />
                            </Suspense>
                        </motion.div>
                    )}

                    {drawerType === 'actor' && tmdbActorId && (
                        <motion.div
                            key={`actor-${tmdbActorId}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.3 } }}
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            layout
                        >
                            <Suspense fallback={<DrawerLoadingFallback />}>
                                <ActorDetailsContent tmdbActorId={tmdbActorId} />
                            </Suspense>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
