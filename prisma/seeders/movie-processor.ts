import {tmdb} from "@/lib/clients";
import {Language, Prisma} from "@prisma/client";
import Bluebird from "bluebird";
import type {DAL} from "@/dal";
import {SEED_CONFIG} from "./seed-config";

import type {
    Movie, // Instead of MovieSearchResult
    MovieDetails,
    Video,
    ExternalIds
} from "tmdb-ts";

// Define the correct types based on what tmdb-ts actually provides
type TmdbVideosResponse = {
    results: Video[];
};

type TmdbCreditsResponse = {
    cast: Array<{
        id: number;
        name: string;
        character: string;
        order: number;
        profile_path: string | null;
        popularity: number;
    }>;
};

// Use Prisma-generated types with official TMDB API types
export type MovieData = {
    id: number;
    title: string;
    imdbId: string;
    tmdbId: number;
    baseMovie: Prisma.MovieGetPayload<{}>;
    detailsEn: MovieDetails;
    detailsHe: MovieDetails;
    videos: TmdbVideosResponse;
    credits: TmdbCreditsResponse;
};

export type MovieProcessInput = Pick<Movie, 'id' | 'title'>;

export async function processMovieData(movie: MovieProcessInput, dal: DAL): Promise<MovieData | null> {
    try {
        console.log(`\n🎬 Processing: ${movie.title} (${movie.id})`);

        // Check if movie already exists
        const existing = await dal.movies.findByTmdbId(movie.id);
        if (existing) {
            console.log(`⏩ Skipping (already exists): ${movie.title}`);
            return null;
        }

        // Fetch all data in parallel with official types
        const [ext, detailsEn, detailsHe, videos, credits] = await Bluebird.all([
            tmdb.movies.externalIds(movie.id) as Promise<ExternalIds>,
            tmdb.movies.details(movie.id, undefined, SEED_CONFIG.DEFAULT_LANGUAGES.SECONDARY) as Promise<MovieDetails>,
            tmdb.movies.details(movie.id, undefined, SEED_CONFIG.DEFAULT_LANGUAGES.PRIMARY) as Promise<MovieDetails>,
            tmdb.movies.videos(movie.id) as Promise<TmdbVideosResponse>,
            tmdb.movies.credits(movie.id) as Promise<TmdbCreditsResponse>,
        ]);

        const imdbId = ext.imdb_id ?? `tmdb-${movie.id}`;

        // Create base movie using Prisma input type
        const movieCreateInput: Prisma.MovieCreateInput & { imdbId: string } = {
            id: imdbId,
            imdbId,
            tmdbId: movie.id,
            rating: detailsEn.vote_average ?? null,
            votes: detailsEn.vote_count ?? null,
            releaseDate: detailsEn.release_date ? new Date(detailsEn.release_date) : null,
            originalLanguage: detailsEn.original_language === 'he' ? Language.he_IL : Language.en_US,
        };

        const baseMovie = await dal.movies.upsertBase(movieCreateInput);

        return {
            id: movie.id,
            title: movie.title,
            imdbId,
            tmdbId: movie.id,
            baseMovie,
            detailsEn,
            detailsHe,
            videos,
            credits,
        };
    } catch (err) {
        console.error(`❌ Failed processing movie ${movie.title}:`, err);
        return null;
    }
}

export async function processMovieTranslations(movieData: MovieData, dal: DAL): Promise<void> {
    const {baseMovie, detailsEn, detailsHe} = movieData;

    // Use Prisma input types for translations
    const translationEn: Omit<Prisma.MovieTranslationCreateInput, "movie" | "language"> = {
        title: detailsEn.title ?? "Unknown",
        description: detailsEn.overview ?? null,
        originalTitle: detailsEn.original_title ?? null,
        posterUrl: detailsEn.poster_path
            ? `${SEED_CONFIG.TMDB_POSTER_BASE_URL}${detailsEn.poster_path}`
            : null,
    };

    const translationHe: Omit<Prisma.MovieTranslationCreateInput, "movie" | "language"> = {
        title: detailsHe.title ?? detailsEn.title ?? "Unknown",
        description: detailsHe.overview ?? detailsEn.overview ?? null,
        originalTitle: detailsHe.original_title ?? detailsEn.original_title ?? null,
        posterUrl: detailsHe.poster_path
            ? `${SEED_CONFIG.TMDB_POSTER_BASE_URL}${detailsHe.poster_path}`
            : (detailsEn.poster_path ? `${SEED_CONFIG.TMDB_POSTER_BASE_URL}${detailsEn.poster_path}` : null),
    };

    await Bluebird.all([
        dal.movies.upsertTranslation(baseMovie.id, Language.en_US, translationEn),
        dal.movies.upsertTranslation(baseMovie.id, Language.he_IL, translationHe),
    ]);

    console.log(`✅ Movie & translations saved: ${detailsEn.title}`);
}

export async function processMovieTrailers(movieData: MovieData, dal: DAL): Promise<void> {
    const {baseMovie, videos} = movieData;

    const trailers = videos.results
        ?.filter((v: Video) => v.type === "Trailer" && v.site === "YouTube")
        ?.map((t: Video) => ({
            title: t.name,
            key: t.key,
            language: Language.en_US, // Default to English for now
        })) ?? [];

    if (trailers.length > 0) {
        await dal.movies.upsertAllTrailers(baseMovie.id, trailers);
        console.log(`🎞️ ${trailers.length} trailer(s) processed`);
    }
}
