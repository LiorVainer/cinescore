'use client';

import React, {useEffect, useRef} from 'react';
import {Drawer, DrawerContent, DrawerTitle} from '@/components/ui/drawer';
import {useIsMobile} from '@/hooks/use-mobile';
import {VisuallyHidden} from '@/components/ui/visually-hidden';
import {useOverlayState} from '@/hooks/use-overlay-state';
import {AnimatedContentContainer} from './AnimatedContentContainer';
import {useOverlayContent} from '@/hooks/use-overlay-content';

export function MobileDrawer() {
    const {isOpen, entityType, movieId, actorId, close} = useOverlayState();
    const isMobile = useIsMobile();
    const isFirstRender = useRef(true);

    // Use the custom hook to handle all data fetching logic
    const {movieData, isLoadingMovie, actorProfilePath} = useOverlayContent();

    // Manage first render state only
    useEffect(() => {
        if (isOpen && entityType) {
            const renderTimer = setTimeout(() => {
                isFirstRender.current = false;
            }, 100);

            return () => {
                clearTimeout(renderTimer);
            };
        } else if (!isOpen) {
            isFirstRender.current = true;
        }
    }, [isOpen, entityType]);

    if (!isMobile) return null;

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>
            <DrawerContent className='p-0'>
                {/* Add visually hidden title for accessibility */}
                <VisuallyHidden asChild>
                    <DrawerTitle>
                        {entityType === 'movie' ? movieData?.title : entityType === 'actor' ? 'Actor Details' : 'Content'}
                    </DrawerTitle>
                </VisuallyHidden>

                <div className="max-h-[90vh] overflow-y-auto">
                    <AnimatedContentContainer
                        drawerType={entityType}
                        movieId={movieId}
                        tmdbActorId={actorId}
                        movieData={movieData}
                        actorProfilePath={actorProfilePath}
                        isLoadingMovie={isLoadingMovie}
                        onClose={close}
                        variant='drawer'
                    />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
