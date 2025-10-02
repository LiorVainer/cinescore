'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useOutsideClick } from '@/hooks/use-outside-click';
import type { PopulatedMovie } from '@/models/movies.model';
import CollapsedMovieCard from './movie-card-collapsed';
import ExpandedMovieCard from './movie-card-expanded';

export type MovieCardProps = {
    movie: PopulatedMovie;
    // Optional CTA override. If not provided and movie.id looks like an IMDb id (ttXXXX), we link to IMDb.
    ctaText?: string;
    ctaHref?: string;
    className?: string;
};

export default function MovieCard({ movie, ctaText = 'Details', ctaHref, className }: MovieCardProps) {
    const [active, setActive] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();

    const imgSrc = movie.posterUrl || '/window.svg'; // fallback asset from public/
    const imdbUrl = ctaHref ?? (movie.id?.startsWith('tt') ? `https://www.imdb.com/title/${movie.id}/` : undefined);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setActive(false);
            }
        }

        if (active) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(false));

    return (
        <>
            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 bg-black/20 h-full w-full z-10'
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
                        ctaText={ctaText}
                        imdbUrl={imdbUrl}
                        onClose={() => setActive(false)}
                    />
                ) : null}
            </AnimatePresence>

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
