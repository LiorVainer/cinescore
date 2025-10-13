'use server';

import {getDal} from '@/lib/server-utils';
import type {Language} from '@prisma/client';

/**
 * Fetches an actor by ID with translations and filmography
 */
export async function getActorById(actorId: string, locale: string) {
    const language: Language = locale === 'he' ? 'he_IL' : 'en_US';
    const dal = getDal();

    const actor = await dal.actors.findByIdWithMovies(actorId, language, 20);

    if (!actor) return null;

    // Transform to a simpler structure for the component
    return {
        ...actor,
        name: actor.translations[0]?.name || 'Unknown Actor',
        biography: actor.translations[0]?.biography,
        movies: actor.cast.map(c => ({
            id: c.movie.id,
            title: c.movie.translations[0]?.title || 'Untitled',
            posterPath: c.movie.translations[0]?.posterUrl,
            releaseDate: c.movie.releaseDate,
            rating: c.movie.rating,
        })),
    };
}

