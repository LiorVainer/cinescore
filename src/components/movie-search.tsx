'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/lib/useDebounce';
import { searchMoviesInDB } from '@/app/actions/searchMovies';
import MovieCard from '@/components/movie-card';

export default function MovieSearch() {
    const [query, setQuery] = useState('');
    const debounced = useDebounce(query, 400);

    const { data, isFetching } = useQuery({
        queryKey: ['searchMovies', debounced],
        queryFn: async () => searchMoviesInDB(query),
    });

    return (
        <div className='space-y-4 p-4 h-full'>
            <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='חפש סרט...'
                className='border rounded-md p-2 w-full'
            />

            {isFetching && <p>מחפש...</p>}

            {data && data.length > 0 && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-full'>
                    {data.map((movie) => (
                        <MovieCard ctaText={'פרטים'} key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}
