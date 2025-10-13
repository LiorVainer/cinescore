'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useDrawerContent } from '@/contexts/drawer-content-context';
import { AnimatePresence, motion } from 'motion/react';
import { useIsMobile } from '@/hooks/use-mobile';
import ExpandedMovieCard from '@/components/movie/movie-card-expanded';
import { ActorDetailContent } from '@/components/actor/ActorDetailContent';
import { useActorDetail } from '@/lib/query/actor/hooks';
import { useLocale } from 'next-intl';

const DrawerLoadingFallback = React.memo(function DrawerLoadingFallback() {
    return (
        <div className='flex items-center justify-center h-[60vh]'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
    );
});

export function UnifiedDrawer() {
    const { isOpen, content, direction, close, isPending } = useDrawerContent();
    const isMobile = useIsMobile();
    const isFirstRender = useRef(true);
    const [showBackground, setShowBackground] = useState(false);
    const locale = useLocale();

    // Memoize actor query to prevent recreation
    const actorQueryEnabled = useMemo(
        () => content?.type === 'actor' && !!content.actorId,
        [content?.type, content?.actorId],
    );

    // Fetch actor details when viewing actor content - now with stable enabled value
    const { data: actor } = useActorDetail(content?.type === 'actor' ? content.actorId! : '', locale, {
        enabled: actorQueryEnabled,
    });

    // Manage background visibility and first render state
    useEffect(() => {
        if (isOpen && content) {
            const bgTimer = setTimeout(() => {
                setShowBackground(true);
            }, 150);

            const renderTimer = setTimeout(() => {
                isFirstRender.current = false;
            }, 100);

            return () => {
                clearTimeout(bgTimer);
                clearTimeout(renderTimer);
            };
        } else if (!isOpen) {
            setShowBackground(false);
            isFirstRender.current = true;
        }
    }, [isOpen, content]);

    // Memoize background URL calculation
    const backgroundImageUrl = useMemo(() => {
        if (!content) return null;

        if (content.type === 'movie') {
            return content.movieData?.posterUrl;
        } else if (content.type === 'actor' && actor?.profileUrl) {
            return actor.profileUrl;
        }
        return content.imgSrc;
    }, [content, actor?.profileUrl]);

    // Memoize slide variants (constant object)
    const slideVariants = useMemo(
        () => ({
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
        }),
        [],
    );

    // Memoize transition config
    const contentTransition = useMemo(
        () => ({
            type: 'spring' as const,
            stiffness: 350,
            damping: 32,
        }),
        [],
    );

    // Memoize background transition
    const backgroundTransition = useMemo(
        () => ({
            opacity: { duration: 0.2 },
            layout: { type: 'spring' as const, stiffness: 400, damping: 35 },
        }),
        [],
    );

    if (!isMobile) return null;

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
                            alt=''
                            className='w-full h-full object-cover'
                            style={{
                                filter: 'blur(15px)',
                                transform: 'scale(1.1)',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={backgroundTransition}
                        />
                        <div className='absolute inset-0 bg-background/80 dark:bg-background/80' />
                    </div>
                )}

                <div className='overflow-y-auto max-h-full touch-pan-y relative'>
                    {/* Show loading indicator during transitions */}
                    {isPending && (
                        <div className='absolute top-4 right-4 z-50'>
                            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
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
                                transition={contentTransition}
                            >
                                <Suspense fallback={<DrawerLoadingFallback />}>
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
                                transition={contentTransition}
                            >
                                <Suspense fallback={<DrawerLoadingFallback />}>
                                    <ActorDetailContent actorId={content.actorId} />
                                </Suspense>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
