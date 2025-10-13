'use client';

import React, {Suspense, useRef, useEffect, useState} from 'react';
import {Drawer, DrawerContent} from '@/components/ui/drawer';
import {useDrawerContent} from '@/contexts/drawer-content-context';
import {AnimatePresence, motion} from 'motion/react';
import {useIsMobile} from '@/hooks/use-mobile';
import ExpandedMovieCard from '@/components/movie/movie-card-expanded';
import {ActorDetailContent} from '@/components/actor/ActorDetailContent';
import {useActorDetail} from '@/lib/query/actor/hooks';
import {useLocale} from 'next-intl';

function DrawerLoadingFallback() {
    return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
}

export function UnifiedDrawer() {
    const {isOpen, content, direction, close, isPending} = useDrawerContent();
    const isMobile = useIsMobile();
    const isFirstRender = useRef(true);
    const [showBackground, setShowBackground] = useState(false);
    const locale = useLocale();

    // Fetch actor details when viewing actor content
    const {data: actor} = useActorDetail(
        content?.type === 'actor' ? content.actorId! : '',
        locale,
        {enabled: content?.type === 'actor' && !!content.actorId}
    );

    // Track if this is the first time content is being shown
    useEffect(() => {
        if (isOpen && content) {
            // Delay showing background to let drawer animation complete first
            const bgTimer = setTimeout(() => {
                setShowBackground(true);
            }, 200);

            // Set to false after a small delay to allow drawer animation to complete
            const timer = setTimeout(() => {
                isFirstRender.current = false;
            }, 100);

            return () => {
                clearTimeout(bgTimer);
                clearTimeout(timer);
            };
        }
    }, [isOpen, content]);

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setShowBackground(false);
            isFirstRender.current = true;
        }
    }, [isOpen]);

    if (!isMobile) return null;

    // Get the background image URL based on content type
    const backgroundImageUrl = content?.type === 'movie'
        ? content.movieData?.posterUrl
        : content?.type === 'actor' && actor?.profileUrl
            ? actor.profileUrl
            : content?.imgSrc; // Fallback to movie image while actor is loading

    // Simplified slide animations with reduced stiffness for smoother performance
    const slideVariants = {
        enter: (direction: 'forward' | 'backward') => ({
            y: direction === 'forward' ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            y: 0,
            opacity: 1,
        },
        exit: (direction: 'forward' | 'backward') => ({
            y: direction === 'forward' ? '-100%' : '100%',
            opacity: 0,
        }),
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>
            <DrawerContent className='p-0 max-h-[80vh] overflow-hidden'>
                {/* Shared background layer - only show after drawer has opened */}
                {content && backgroundImageUrl && showBackground && (
                    <div className='absolute inset-0 z-0 overflow-hidden'>
                        <motion.img
                            key={backgroundImageUrl}
                            layoutId='drawer-bg-image'
                            src={backgroundImageUrl}
                            alt=""
                            className='w-full h-full object-cover'
                            style={{
                                filter: 'blur(15px)',
                                transform: 'scale(1.1)',
                            }}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{
                                opacity: {duration: 0.25},
                                layout: {type: 'spring', stiffness: 300, damping: 30}
                            }}
                        />
                        <div className='absolute inset-0 bg-background/80 dark:bg-background/80'/>
                    </div>
                )}

                <div className='overflow-y-auto max-h-full touch-pan-y relative'>
                    {/* Show loading indicator during transitions */}
                    {isPending && (
                        <div className="absolute top-4 right-4 z-50">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Conditionally disable initial animation on first render */}
                    <AnimatePresence mode='wait' initial={false} custom={direction}>
                        {content?.type === 'movie' && content.movieData && (
                            <motion.div
                                key='movie-content'
                                custom={direction}
                                variants={slideVariants}
                                initial={isFirstRender.current ? 'center' : 'enter'}
                                animate='center'
                                exit='exit'
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            >
                                <Suspense fallback={<DrawerLoadingFallback/>}>
                                    <ExpandedMovieCard
                                        movie={content.movieData}
                                        imgSrc={content.imgSrc || ''}
                                        idSuffix={content.idSuffix || ''}
                                        onClose={close}
                                        variant='drawer'
                                    />
                                </Suspense>
                            </motion.div>
                        )}

                        {content?.type === 'actor' && content.actorId && (
                            <motion.div
                                key='actor-content'
                                custom={direction}
                                variants={slideVariants}
                                initial='enter'
                                animate='center'
                                exit='exit'
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            >
                                <Suspense fallback={<DrawerLoadingFallback/>}>
                                    <ActorDetailContent
                                        actorId={content.actorId}
                                        movieData={content.movieData}
                                        movieImgSrc={content.imgSrc}
                                    />
                                </Suspense>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
