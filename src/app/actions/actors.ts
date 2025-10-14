'use server';

import {getDal} from '@/lib/server-utils';
import type {Language} from '@prisma/client';
import {omdb, tmdb} from "@/lib/clients";
import {TMDB} from "@/constants/movies/api";
import {ActorCreditDto, ActorDetailsDto} from "@/models/actors.model";
import {mapLocalToTmdbLanguage} from "@/constants/languages.const";

import {revalidateTag} from 'next/cache';
import {
    PersonDetails,
    PersonCombinedCredits,
    PersonMovieCast,
    PersonTvShowCast,
} from 'tmdb-ts';

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

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// MAIN SERVER ACTION
// -----------------------------------------------------------------------------

export async function getActorFullDetails(actorId: number, locale: string): Promise<ActorDetailsDto | null> {
    try {
        const [details, combinedCredits] = await Promise.all([
            tmdb.people.details(actorId, undefined, locale),
            tmdb.people.combinedCredits(actorId, {language: mapLocalToTmdbLanguage(locale)}),
        ]);

        const dto = convertPersonDetailsToDto(details as PersonDetails);
        const credits = await enrichCreditsWithOmdb(combinedCredits);

        const knownFor = credits
            ?.filter((c) => !!c.imdbRating)
            .sort((a, b) => (b.imdbRating ?? 0) - (a.imdbRating ?? 0))
            .slice(0, 5)
            .map((c) => c.title);

        return {...dto, credits, knownFor};
    } catch (error) {
        console.error('❌ Failed to fetch full actor details:', error);
        return null;
    }
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function convertPersonDetailsToDto(person: PersonDetails): ActorDetailsDto {
    return {
        id: person.id,
        imdbId: person.imdb_id ?? null,
        tmdbId: person.id,
        name: person.name ?? 'Unknown Actor',
        biography: person.biography ?? null,
        birthday: person.birthday ?? null,
        deathday: person.deathday ?? null,
        placeOfBirth: person.place_of_birth ?? null,
        profilePath: person.profile_path
            ? `${TMDB.POSTER_BASE_URL}${person.profile_path}`
            : null,
        popularity: person.popularity ?? null,
        knownForDepartment: person.known_for_department ?? null,
        alsoKnownAs: person.also_known_as ?? [],
        homepage: person.homepage ?? null,
    };
}

async function enrichCreditsWithOmdb(
    combinedCredits: PersonCombinedCredits
): Promise<ActorCreditDto[]> {
    const credits = [...(combinedCredits.cast ?? [])] as (
        | PersonMovieCast
        | PersonTvShowCast
        )[];

    const topCredits = credits
        .filter((c) => c.popularity > 1)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20);

    return Promise.all(
        topCredits.map(async (c) => {
            const mediaType = (c as any).title ? 'movie' : 'tv';
            const title = (c as any).title ?? (c as any).name;
            const releaseDate =
                (c as any).release_date ?? (c as any).first_air_date ?? null;

            try {
                const external =
                    mediaType === 'movie'
                        ? await tmdb.movies.externalIds(c.id)
                        : await tmdb.tvShows.externalIds(c.id);

                let imdbRating: number | null = null;
                let imdbVotes: number | null = null;

                if (external.imdb_id) {
                    const imdbData = await omdb.title.getById({i: external.imdb_id});
                    imdbRating =
                        imdbData.imdbRating && imdbData.imdbRating !== 'N/A'
                            ? parseFloat(imdbData.imdbRating)
                            : null;
                    imdbVotes =
                        imdbData.imdbVotes && imdbData.imdbVotes !== 'N/A'
                            ? parseInt(imdbData.imdbVotes.replace(/,/g, ''), 10)
                            : null;
                }

                return {
                    id: c.id,
                    title,
                    mediaType,
                    character: c.character ?? null,
                    releaseDate,
                    poster: c.poster_path
                        ? `${TMDB.POSTER_BASE_URL}${c.poster_path}`
                        : null,
                    imdbId: external.imdb_id ?? null,
                    imdbRating,
                    imdbVotes,
                    popularity: c.popularity ?? null,
                };
            } catch {
                return {
                    id: c.id,
                    title,
                    mediaType,
                    character: c.character ?? null,
                    releaseDate,
                    poster: c.poster_path
                        ? `${TMDB.POSTER_BASE_URL}${c.poster_path}`
                        : null,
                    imdbId: null,
                    imdbRating: null,
                    imdbVotes: null,
                    popularity: c.popularity ?? null,
                };
            }
        })
    );
}
