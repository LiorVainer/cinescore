'use server';

import {getDal} from '@/lib/server-utils';
import type {Language} from '@prisma/client';
import {tmdb} from "@/lib/clients";
import {PersonDetails} from "tmdb-ts";
import {ActorDetailsDto} from "@/models/actors.model";
import {TMDB} from "@/constants/movies/api";

/**
 * Fetches an actor by ID with translations and filmography
 */
export async function getActorByIdFromDB(actorId: string, locale: string) {
    const language: Language = locale === 'he' ? 'he_IL' : 'en_US';
    const dal = getDal();

    const actor = await dal.actors.findByIdWithMovies(actorId, language, 20);

    if (!actor) return null;

    // Transform to a simpler structure for the component
    return {
        ...actor,
        name: actor.translations[0]?.name || 'Unknown Actor',
        biography: actor.translations[0]?.biography,
        movies: actor.cast.map((c) => ({
            id: c.movie.id,
            title: c.movie.translations[0]?.title || 'Untitled',
            posterPath: c.movie.translations[0]?.posterUrl,
            releaseDate: c.movie.releaseDate,
            rating: c.movie.rating,
        })),
    };
}

/**
 * Converts TMDB PersonDetails (snake_case) to ActorDetailsDto (camelCase)
 */
function convertPersonDetailsToDto(personDetails: PersonDetails): ActorDetailsDto {
    return {
        id: personDetails.id,
        imdbId: personDetails.imdb_id ?? null,
        tmdbId: personDetails.id,
        name: personDetails.name ?? 'Unknown Actor',
        biography: personDetails.biography ?? null,
        birthday: personDetails.birthday ?? null,
        deathday: personDetails.deathday ?? null,
        placeOfBirth: personDetails.place_of_birth ?? null,
        profilePath: personDetails.profile_path ? `${TMDB.POSTER_BASE_URL}${personDetails.profile_path}` : null,
        popularity: personDetails.popularity ?? null,
    };
}

export async function getActorByIdFromTmdb(actorId: number, locale: string): Promise<ActorDetailsDto | null> {
    try {
        const actorDetails = await tmdb.people.details(actorId, undefined, locale) as PersonDetails;

        return convertPersonDetailsToDto(actorDetails);
    } catch (error) {
        console.error('Failed to fetch actor from TMDB API:', error);
        return null;
    }
}