'use client';

import React from 'react';
import {Star} from 'lucide-react';

type MovieVerticalCardProps = {
    title: string;
    posterUrl?: string | null;
    imdbRating?: number | null;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
};

export function MovieVerticalCard({
                                      title,
                                      posterUrl,
                                      imdbRating,
                                      onClick,
                                      className = '',
                                  }: MovieVerticalCardProps) {
    const imgSrc = posterUrl ?? '/window.svg';

    return (
        <div
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            className={
                'relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105 ' +
                className
            }
        >
            <div className="w-full aspect-[2/3] bg-gray-800">
                <img
                    src={imgSrc}
                    alt={title}
                    className="w-full h-full object-cover block"
                    loading="eager"
                />
            </div>

            <div className="absolute inset-x-0 top-0 p-2 bg-gradient-to-b from-black/85 to-transparent">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-white text-sm font-medium line-clamp-2">{title}</span>
                    {typeof imdbRating === 'number' && (
                        <span
                            className="inline-flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded text-white text-xs">
              <Star className="w-3 h-3"/>
              <span>{Number.isFinite(imdbRating) ? imdbRating.toFixed(1) : imdbRating}</span>
            </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MovieVerticalCard;

