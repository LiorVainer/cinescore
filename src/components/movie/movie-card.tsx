'use client';

import React, {useEffect, useId, useRef, useState} from 'react';
import {AnimatePresence} from 'motion/react';
import {useOutsideClick} from '@/hooks/use-outside-click';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import CollapsedMovieCard from './movie-card-collapsed';
import ExpandedMovieCard from './movie-card-expanded';
import {useIsMobile} from '@/hooks/use-mobile';
import {Drawer, DrawerContent} from '@/components/ui/drawer';

export type MovieCardProps = {
    movie: MovieWithLanguageTranslation;
    ctaText?: string;
    ctaHref?: string;
    className?: string;
};

export default function MovieCard({movie, className}: MovieCardProps) {
    const [active, setActive] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();
    const isMobile = useIsMobile();

    const imgSrc = movie.posterUrl || '/window.svg'; // Now uses posterUrl from translation

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setActive(false);
            }
        }

        // Lock body scroll only for desktop modal; Drawer handles its own scroll lock
        if (!isMobile) {
            if (active) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [active, isMobile]);

    useOutsideClick(ref, () => setActive(false));

    return (
        <>
            {/* Expanded view: Desktop modal; Mobile bottom drawer */}
            {isMobile ? (
                <Drawer open={active} onOpenChange={setActive}>
                    <DrawerContent className='p-0 max-h-[90vh] overflow-hidden'>
                        <div className='overflow-y-auto max-h-full touch-pan-y'>
                            <ExpandedMovieCard
                                ref={ref}
                                movie={movie}
                                imgSrc={imgSrc}
                                idSuffix={id}
                                onClose={() => setActive(false)}
                                variant='drawer'
                            />
                        </div>
                    </DrawerContent>
                </Drawer>
            ) : (
                <AnimatePresence>
                    {active ? (
                        <ExpandedMovieCard
                            ref={ref}
                            movie={movie}
                            imgSrc={imgSrc}
                            idSuffix={id}
                            onClose={() => setActive(false)}
                            variant='modal'
                        />
                    ) : null}
                </AnimatePresence>
            )}

            <CollapsedMovieCard
                movie={movie}
                imgSrc={imgSrc}
                idSuffix={id}
                className={className}
                onClickAction={() => setActive(true)}
            />
        </>
    );
}
