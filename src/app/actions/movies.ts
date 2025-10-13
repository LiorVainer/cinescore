'use server';

import {getDal} from '@/lib/server-utils';
import {mapLocaleToLanguage} from '@/constants/languages.const';
import type {Language} from '@prisma/client';
import type {MovieWithLanguageTranslation} from '@/models/movies.model';

/**
 * Fetches a movie by ID with translations
 */
export async function getMovieById(movieId: string, locale: string): Promise<MovieWithLanguageTranslation | null> {
    const language: Language = mapLocaleToLanguage(locale);
    const dal = getDal();

    const movie = await dal.movies.findByIdWithLanguageTranslation(movieId, language);

    return movie;
}
