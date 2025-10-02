import type { PopulatedMovie } from '@/models/movies.model';
import { motion } from 'motion/react';
import { ImdbLogo } from '@/components/imdb-logo';

export function buildSubtitle(movie: PopulatedMovie) {
    const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : undefined;
    const rating = movie.rating != null ? movie.rating.toFixed(1) : undefined;
    const votes = movie.votes != null ? Intl.NumberFormat().format(movie.votes) : undefined;

    const parts = {
        year: year ? String(year) : undefined,
        rating: rating ? `★${rating}` : undefined,
        votes: votes ? `${votes}` : undefined,
    };

    return (
        <div className='flex flex-col gap-1'>
            {parts.year && <p>{parts.year}</p>}
            <div className='flex gap-2'>
                <ImdbLogo className={'1/1 '} height={30} width={30} /> {parts.rating}
            </div>
            {parts.votes && <p>{parts.votes}</p>}
        </div>
    );
}

export function RenderDetails({ movie }: { movie: PopulatedMovie }) {
    const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : undefined;
    return (
        <div className='flex flex-col gap-2'>
            <p>
                <strong>Title:</strong> {movie.title}
            </p>
            {year && (
                <p>
                    <strong>Year:</strong> {year}
                </p>
            )}
            {movie.rating != null && (
                <p>
                    <strong>Rating:</strong> {movie.rating.toFixed(1)} / 10
                </p>
            )}
            {movie.votes != null && (
                <p>
                    <strong>Votes:</strong> {Intl.NumberFormat().format(movie.votes)}
                </p>
            )}
            {movie.genres?.length ? (
                <p>
                    <strong>Genres:</strong> {movie.genres.map((g) => g.name).join(', ')}
                </p>
            ) : null}
        </div>
    );
}

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-4 w-4 text-black'
        >
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <path d='M18 6l-12 12' />
            <path d='M6 6l12 12' />
        </motion.svg>
    );
};
