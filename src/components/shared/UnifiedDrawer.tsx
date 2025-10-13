'use client';

import React from 'react';
import {Drawer, DrawerContent} from '@/components/ui/drawer';
import {useDrawerContent} from '@/contexts/drawer-content-context';
import {AnimatePresence, motion} from 'framer-motion';
import {useIsMobile} from '@/hooks/use-mobile';
import ExpandedMovieCard from '@/components/movie/movie-card-expanded';
import {ActorDetailContent} from '@/components/actor/ActorDetailContent';

export function UnifiedDrawer() {
    const {isOpen, content, direction, close} = useDrawerContent();
    const isMobile = useIsMobile();

    if (!isMobile) return null;

    // Direction-based slide animations
    const slideVariants = {
        enter: (direction: 'forward' | 'backward') => ({
            x: direction === 'forward' ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: 'forward' | 'backward') => ({
            x: direction === 'forward' ? '-100%' : '100%',
            opacity: 0,
        }),
    };

    const transition = {
        x: {type: 'spring', stiffness: 400, damping: 25},
        opacity: {duration: 0.15},
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>
            <DrawerContent className='p-0 max-h-[80vh] overflow-hidden'>
                <div className='overflow-y-auto max-h-full touch-pan-y relative'>
                    <AnimatePresence mode='wait' initial={false} custom={direction}>
                        {content?.type === 'movie' && content.movieData && (
                            <motion.div
                                key='movie-content'
                                custom={direction}
                                variants={slideVariants}
                                initial='enter'
                                animate='center'
                                exit='exit'
                                transition={transition}
                            >
                                <ExpandedMovieCard
                                    movie={content.movieData}
                                    imgSrc={content.imgSrc || ''}
                                    idSuffix={content.idSuffix || ''}
                                    onClose={close}
                                    variant='drawer'
                                />
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
                                transition={transition}
                            >
                                <ActorDetailContent actorId={content.actorId}/>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
