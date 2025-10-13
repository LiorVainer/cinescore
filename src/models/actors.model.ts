export interface ActorCreditDto {
    id: number;
    title: string;
    mediaType: 'movie' | 'tv';
    character?: string | null;
    releaseDate?: string | null;
    poster?: string | null;
    imdbId?: string | null;
    imdbRating?: number | null;
    imdbVotes?: number | null;
    popularity?: number | null;
}

export interface ActorDetailsDto {
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
    knownForDepartment: string | null;
    alsoKnownAs: string[];
    homepage: string | null;
    knownFor?: string[];
    credits?: ActorCreditDto[];
}

