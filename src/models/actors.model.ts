/**
 * Actor Details DTO
 * Represents actor information from external APIs in camelCase format
 */
export type ActorDetailsDto = {
    id: number;
    imdbId: string | null;
    tmdbId: number;
    name: string;
    biography: string | null;
    birthday: string | null;
    deathday: string | null;
    placeOfBirth: string | null;
    profilePath: string | null;
    popularity: number | null;
};

