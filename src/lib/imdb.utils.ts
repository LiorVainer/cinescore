// src/lib/omdb/extractOmdbRatings.ts

import { Movie } from '@/lib/omdbapi';
import { ImdbapiTitle } from '@/lib/imdbapi';

/**
 * Extract numeric rating and vote count from an OMDB API response.
 */

export type ImdbRatingResult = {
    rating: number | null;
    votes: number | null;
};

export function extractImdbRatings(imdbapiMovie: ImdbapiTitle, omdbMovie: Movie): ImdbRatingResult {
    const rating = omdbMovie.imdbRating && omdbMovie.imdbRating !== 'N/A' ? parseFloat(omdbMovie.imdbRating) : null;

    const votes =
        omdbMovie.imdbVotes && omdbMovie.imdbVotes !== 'N/A'
            ? parseInt(omdbMovie.imdbVotes.replace(/,/g, ''), 10)
            : null;

    const mostReliableImdbRating = imdbapiMovie.rating?.aggregateRating ?? rating;
    const mostReliableImdbVotes = imdbapiMovie.rating?.voteCount ?? votes;

    return { rating: mostReliableImdbRating, votes: mostReliableImdbVotes };
}
