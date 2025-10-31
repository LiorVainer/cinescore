'use server';

import { getDal } from '@/lib/server-utils';
import { mapLocaleToLanguage } from '@/constants/languages.const';
import type { Language } from '@prisma/client';
import type { MovieWithLanguageTranslation } from '@/models/movies.model';

/**
 * Fetches a movie by ID with translations
 */
export async function getMovieById(movieId: string, locale: string): Promise<MovieWithLanguageTranslation | null> {
    const language: Language = mapLocaleToLanguage(locale);
    const dal = getDal();

    const movie = await dal.movies.findByIdWithLanguageTranslation(movieId, language);

    return movie;
}

/**
 * Fetch top rated movies (by imdb rating) with language-aware translations.
 */
export async function getTopRatedMovies(locale: string, limit = 5): Promise<MovieWithLanguageTranslation[]> {
    const language: Language = mapLocaleToLanguage(locale);
    const dal = getDal();

    const movies = await dal.movies.getMoviesWithLanguageTranslation(language, {
        orderBy: [{ rating: 'desc' }, { votes: 'desc' }],
        take: limit,
    });

    return movies.slice(0, limit);
}
