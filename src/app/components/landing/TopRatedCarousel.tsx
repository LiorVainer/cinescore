'use client';

import React from 'react';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';
import {Carousel} from '@/components/ui/carousel';

type TopRatedCarouselProps = {
    movies: MovieWithLanguageTranslation[];
};

export function TopRatedCarousel({movies}: TopRatedCarouselProps) {
    if (!movies || movies.length === 0) return null;

    const slides = movies.map((movie) => ({
        title: movie.title,
        button: 'View Details',
        src: movie.posterUrl ?? '/window.svg',
    }));

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Top Rated</h2>
            </div>

            <Carousel slides={slides}/>
        </div>
    );
}

export default TopRatedCarousel;

