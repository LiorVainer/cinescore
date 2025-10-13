'use client';

import React, {useEffect, useId, useRef, useState} from 'react';
import {AnimatePresence} from 'motion/react';
import {useOutsideClick} from '@/hooks/use-outside-click';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import CollapsedMovieCard from './movie-card-collapsed';
import ExpandedMovieCard from './movie-card-expanded';
import {useIsMobile} from '@/hooks/use-mobile';
import {useDrawerContent} from '@/contexts/drawer-content-context';

export type MovieCardProps = {
    movie: MovieWithLanguageTranslation;
    ctaText?: string;
    ctaHref?: string;
    className?: string;
};

export default function MovieCard({movie, className}: MovieCardProps) {
    const [active, setActive] = useState<boolean>(false);
    const [shouldPreload, setShouldPreload] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();
    const isMobile = useIsMobile();
    const {openMovie} = useDrawerContent();

    const imgSrc = movie.posterUrl || '/window.svg';

    const handleInteractionStart = () => {
        setShouldPreload(true);
    };

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setActive(false);
            }
        }

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

    const handleCardClick = () => {
        if (isMobile) {
            openMovie(movie, imgSrc, id);
        } else {
            setActive(true);
        }
    };

    return (
        <div
            onMouseEnter={handleInteractionStart}
            onTouchStart={handleInteractionStart}
        >
            {shouldPreload && <link rel="preload" as="image" href={imgSrc}/>}

            {/* Desktop modal only */}
            {!isMobile && (
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
                onClickAction={handleCardClick}
            />
        </div>
    );
}
