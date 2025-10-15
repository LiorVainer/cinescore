'use client';

import React from 'react';
import {useIsMobile} from '@/hooks/use-mobile';
import {useOverlayState} from '@/hooks/use-overlay-state';
import {useOverlayContent} from '@/hooks/use-overlay-content';
import {AnimatedContentContainer} from '@/components/shared/AnimatedContentContainer';
import {Dialog, DialogContent} from '@/components/ui/dialog';
import {VisuallyHidden} from "@/components/ui/visually-hidden";
import {DrawerTitle} from "@/components/ui/drawer";

export function DesktopModal() {
    const {isOpen, entityType, movieId, actorId, close} = useOverlayState();
    const isMobile = useIsMobile();

    // Use the custom hook to handle all data fetching logic
    const {movieData, isLoadingMovie, actorProfilePath} = useOverlayContent();


    // Don't render on mobile (handled by MobileDrawer)
    if (isMobile) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
            <DialogContent className='p-0 max-w-[95vw] w-[800px] max-h-[75vh] border-none overflow-hidden'>
                <VisuallyHidden asChild>
                    <DrawerTitle>
                        {entityType === 'movie' ? movieData?.title : entityType === 'actor' ? 'Actor Details' : 'Content'}
                    </DrawerTitle>
                </VisuallyHidden>
                <AnimatedContentContainer
                    drawerType={entityType}
                    movieId={movieId}
                    tmdbActorId={actorId}
                    movieData={movieData}
                    actorProfilePath={actorProfilePath}
                    isLoadingMovie={isLoadingMovie}
                    onClose={close}
                    variant='modal'
                    containerClassName='rounded-xl'
                />
            </DialogContent>
        </Dialog>
    );
}
