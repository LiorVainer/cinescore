'use client';

import React from 'react';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import ExpandedMovieCardDesktop from './movie-card-expanded-desktop';
import ExpandedMovieCardMobile from './movie-card-expanded-mobile';

export type ExpandedMovieCardProps = {
    movie: MovieWithLanguageTranslation;
    imgSrc: string;
    idSuffix: string;
    onClose: () => void;
    variant?: 'modal' | 'drawer';
};

const ExpandedMovieCard = React.memo(
    React.forwardRef<HTMLDivElement, ExpandedMovieCardProps>(
        ({ movie, imgSrc, idSuffix, onClose, variant = 'modal' }, ref) => {
            if (variant === 'drawer') {
                // Mobile drawer doesn't need ref or layoutId - drawer handles its own animations
                return <ExpandedMovieCardMobile movie={movie} imgSrc={imgSrc} idSuffix={idSuffix} />;
            }

            // Desktop modal uses ref for outside click detection and layoutId for shared element transitions
            return <ExpandedMovieCardDesktop ref={ref} movie={movie} imgSrc={imgSrc} idSuffix={idSuffix} onClose={onClose} />;
        },
    ),
);

ExpandedMovieCard.displayName = 'ExpandedMovieCard';

export default ExpandedMovieCard;
