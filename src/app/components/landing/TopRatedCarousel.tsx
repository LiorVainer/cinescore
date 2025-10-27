'use client';

import React, { useEffect } from 'react';
import type { MovieWithLanguageTranslation } from '@/models/movies.model';
import { MovieCarousel } from '@/components/ui/movie-carousel';
import { useTranslations } from 'next-intl';

type TopRatedCarouselProps = {
    movies: MovieWithLanguageTranslation[];
};

export function TopRatedCarousel({ movies }: TopRatedCarouselProps) {
    const t = useTranslations('landing');

    // If there are no movies (or while debugging), render a small set of demo slides
    const demoSlides = [
        { title: 'Demo Movie 1', posterUrl: '/window.svg', imdbRating: 7.8, onClick: undefined },
        { title: 'Demo Movie 2', posterUrl: '/window.svg', imdbRating: 6.4, onClick: undefined },
        { title: 'Demo Movie 3', posterUrl: '/window.svg', imdbRating: 8.1, onClick: undefined },
        { title: 'Demo Movie 4', posterUrl: '/window.svg', imdbRating: 5.9, onClick: undefined },
        { title: 'Demo Movie 5', posterUrl: '/window.svg', imdbRating: 7.2, onClick: undefined },
    ];

    const isEmpty = !movies || movies.length === 0;

    if (isEmpty) {
        // Debug fallback so you can see the carousel and controls even when no movies are returned
        return (
            <div className=''>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-lg font-semibold'>Top Rated (demo)</h2>
                </div>

                <MovieCarousel movies={demoSlides} />
            </div>
        );
    }

    const slides = movies.map((movie) => ({
        title: movie.title,
        posterUrl: movie.posterUrl ?? '/window.svg',
        imdbRating: movie.rating ?? null,
        // Optionally, you can add an onClick handler to navigate to the movie details page
        onClick: undefined,
    }));

    return (
        <div className='w-[100vw] px-4 md:w-[45%]f flex flex-col gap-8 md:px-[20vw]'>
            <div className='flex items-center justify-between'>
                <h2 className='text-lg font-bold text-background'>{t('top_rated_title')}</h2>
            </div>

            <MovieCarousel movies={slides} />
        </div>
    );
}

export default TopRatedCarousel;
