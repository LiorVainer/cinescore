'use client';

import React, {Suspense, useEffect, useMemo, useRef} from 'react';
import {Drawer, DrawerContent, DrawerTitle} from '@/components/ui/drawer';
import {AnimatePresence, LayoutGroup, motion} from 'motion/react';
import {useIsMobile} from '@/hooks/use-mobile';
import ExpandedMovieCard from '@/components/movie/movie-card-expanded';
import {ActorDetailsContent} from '@/components/actor/ActorDetailsContent';
import {useTmdbActorDetails, useTmdbActorsDetails} from '@/lib/query/actor/hooks';
import {useLocale} from 'next-intl';
import {VisuallyHidden} from '@/components/ui/visually-hidden';
import {useDrawerState} from '@/hooks/use-drawer-state';
import {useQuery} from '@tanstack/react-query';
import {getMovieById} from '@/app/actions/movies';

const DrawerLoadingFallback = React.memo(function DrawerLoadingFallback() {
    return (
        <div className='flex items-center justify-center h-[60vh]'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
    );
});

export function UnifiedDrawer() {
    const { isOpen, drawerType, movieId, tmdbActorId, currentMovie, close } = useDrawerState();
    const isMobile = useIsMobile();
    const isFirstRender = useRef(true);
    const locale = useLocale();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Fetch movie data when movieId is present
    // Use currentMovie from context as initialData for instant display
    const { data: movieData, isLoading: isLoadingMovie } = useQuery({
        queryKey: ['movie', movieId, locale],
        queryFn: () => getMovieById(movieId!, locale),
        enabled: !!movieId && drawerType === 'movie',
        staleTime: 1000 * 60 * 5, // 5 minutes
        // Use context data as initialData if available (from search results)
        // This provides instant display while the query validates in the background
        initialData: currentMovie?.id === movieId ? currentMovie : undefined,
    });

    // Fetch actor data for background image
    const tmdbActorIdNum = tmdbActorId ? parseInt(tmdbActorId, 10) : null;
    const { data: actorData } = useTmdbActorDetails(tmdbActorIdNum || 0, locale, {
        enabled: !!tmdbActorIdNum && drawerType === 'actor',
    });

    // Extract TMDB actor IDs from movie cast for prefetching
    const actorTmdbIds = useMemo(() => {
        if (drawerType === 'movie' && movieData?.cast) {
            return movieData.cast
                .map(castMember => castMember.actor.tmdbId)
                .filter((tmdbId): tmdbId is number => tmdbId !== null);
        }
        return [];
    }, [drawerType, movieData?.cast]);

    // Prefetch all actor details when drawer opens with movie content
    useTmdbActorsDetails(actorTmdbIds, locale, {
        enabled: isOpen && drawerType === 'movie' && actorTmdbIds.length > 0,
    });

    // Reset scroll position when content type changes
    useEffect(() => {
        if (drawerType && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [drawerType, tmdbActorId, movieId]);

    // Manage first render state only
    useEffect(() => {
        if (isOpen && drawerType) {
            const renderTimer = setTimeout(() => {
                isFirstRender.current = false;
            }, 100);

            return () => {
                clearTimeout(renderTimer);
            };
        } else if (!isOpen) {
            isFirstRender.current = true;
        }
    }, [isOpen, drawerType]);

    // Memoize background URL calculation
    const backgroundImageUrl = useMemo(() => {
        if (drawerType === 'movie' && movieData) {
            return movieData.posterUrl;
        } else if (drawerType === 'actor' && actorData?.profilePath) {
            return actorData.profilePath;
        }
        return null;
    }, [drawerType, movieData, actorData]);

    // Memoize background transition - match content animation speed
    const backgroundTransition = useMemo(
        () => ({
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1] as const, // easeInOut
        }),
        [],
    );

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

    if (!isMobile) return null;

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>
            <DrawerContent className='p-0 overflow-hidden'>
                {/* Add visually hidden title for accessibility */}
                <VisuallyHidden asChild>
                    <DrawerTitle>
                        {drawerType === 'movie' ? movieData?.title : drawerType === 'actor' ? 'Actor Details' : 'Content'}
                    </DrawerTitle>
                </VisuallyHidden>

                <LayoutGroup>
                    {/* Shared background layer - syncs with drawer height changes */}
                    <AnimatePresence mode='wait'>
                        {backgroundImageUrl && (
                            <motion.div
                                key={`bg-${drawerType}-${movieId || tmdbActorId}`}
                                className='absolute inset-0 z-0 overflow-hidden'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={backgroundTransition}
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

                    {/* Wrapper container with layout for smooth height transitions */}
                    <motion.div className='relative w-full' layout transition={layoutTransition}>
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
                                    initial={{ opacity: 0 }}
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
                                    className='w-full'
                                >
                                    <motion.div
                                        layout
                                        ref={scrollContainerRef}
                                        className='overflow-y-auto max-h-[80vh] touch-pan-y'
                                        transition={layoutTransition}
                                    >
                                        <Suspense fallback={<DrawerLoadingFallback />}>
                                            <ExpandedMovieCard
                                                movie={movieData}
                                                imgSrc={movieData.posterUrl || ''}
                                                idSuffix={movieId || ''}
                                                onClose={close}
                                                variant='drawer'
                                            />
                                        </Suspense>
                                    </motion.div>
                                </motion.div>
                            )}

                            {drawerType === 'actor' && tmdbActorId && (
                                <motion.div
                                    key={`actor-${tmdbActorId}`}
                                    initial={{ opacity: 0 }}
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
                                    className='w-full'
                                >
                                    <motion.div
                                        layout
                                        ref={scrollContainerRef}
                                        className='overflow-y-auto max-h-[80vh] touch-pan-y'
                                        transition={layoutTransition}
                                    >
                                        <Suspense fallback={<DrawerLoadingFallback />}>
                                            <ActorDetailsContent tmdbActorId={tmdbActorId} />
                                        </Suspense>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </LayoutGroup>
            </DrawerContent>
        </Drawer>
    );
}
