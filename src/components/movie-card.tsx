'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useOutsideClick } from '@/hooks/use-outside-click';
import type { PopulatedMovie } from '@/models/movies.model';
import CollapsedMovieCard from './movie-card-collapsed';
import ExpandedMovieCard from './movie-card-expanded';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent } from '@/components/ui/drawer';

export type MovieCardProps = {
    movie: PopulatedMovie;
    ctaText?: string;
    ctaHref?: string;
    className?: string;
};

export default function MovieCard({ movie, ctaText = 'Details', ctaHref, className }: MovieCardProps) {
    const [active, setActive] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();
    const isMobile = useIsMobile();

    const imgSrc = movie.posterUrl || '/window.svg'; // fallback asset from public/
    const imdbUrl = ctaHref ?? (movie.id?.startsWith('tt') ? `https://www.imdb.com/title/${movie.id}/` : undefined);

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
                    <DrawerContent className='p-0'>
                        <ExpandedMovieCard
                            ref={ref}
                            movie={movie}
                            imgSrc={imgSrc}
                            idSuffix={id}
                            onClose={() => setActive(false)}
                            variant='drawer'
                        />
                    </DrawerContent>
                </Drawer>
            ) : (
                <>
                    <AnimatePresence>
                        {active && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className='fixed inset-0 bg-black/20 h-full w-full z-50 backdrop-blur-sm'
                            />
                        )}
                    </AnimatePresence>
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
                </>
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
