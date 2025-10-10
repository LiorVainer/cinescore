import {tmdb} from "@/lib/clients";
import {Language} from "@prisma/client";
import Bluebird from "bluebird";
import type {DAL} from "@/dal";
import type {MovieData} from "./movie-processor";
import {SEED_CONFIG} from "./seed-config";

// Cache for already processed genres to avoid duplicate processing
const processedGenres = new Set<number>();

export async function processMovieGenres(movieData: MovieData, dal: DAL): Promise<void> {
    const {baseMovie, detailsEn} = movieData;

    if (!detailsEn.genres?.length) {
        console.log(`🏷️ No genres found for ${detailsEn.title}`);
        return;
    }

    // Process genres sequentially to avoid race conditions with upsert
    for (const genre of detailsEn.genres) {
        // Skip if we've already processed this genre in this session
        if (processedGenres.has(genre.id)) {
            continue;
        }

        try {
            // Upsert base genre using TMDB ID
            const baseGenre = await dal.genres.upsertBaseGenre(genre.id);

            // Mark as processed
            processedGenres.add(genre.id);

            // Get cached translations or use the genre name from TMDB details
            const genreNameEn = genre.name; // English name from TMDB details
            const genreNameHe = getCachedGenreTranslation(genre.id, SEED_CONFIG.DEFAULT_LANGUAGES.PRIMARY) || genre.name;

            // Upsert genre translations in parallel using the Prisma-generated genre ID
            await Bluebird.all([
                dal.genres.upsertTranslation(baseGenre.id, Language.en_US, genreNameEn),
                dal.genres.upsertTranslation(baseGenre.id, Language.he_IL, genreNameHe),
            ]);
        } catch (error: any) {
            // If it's a unique constraint error, the genre already exists - that's OK
            if (error.code === 'P2002' && error.meta?.target?.includes('tmdbId')) {
                console.log(`🏷️ Genre ${genre.name} (${genre.id}) already exists, skipping...`);
                processedGenres.add(genre.id);
                continue;
            } else {
                // Re-throw other errors
                throw error;
            }
        }
    }

    // Connect genres to movie using TMDB genre IDs
    await dal.movies.connectGenres(baseMovie.id, detailsEn.genres.map((g) => g.id));
    console.log(`🏷️ Linked ${detailsEn.genres.length} genres with translations`);
}

// Cache for genre translations to avoid repeated API calls
const genreCache = new Map<string, string>();

export async function cacheGenreTranslations(): Promise<void> {
    console.log("🏷️ Caching genre translations...");

    try {
        // Use the correct TMDB API method for genres
        const [genresEn, genresHe] = await Bluebird.all([
            tmdb.genres.movies({language: SEED_CONFIG.DEFAULT_LANGUAGES.SECONDARY}),
            tmdb.genres.movies({language: SEED_CONFIG.DEFAULT_LANGUAGES.PRIMARY}),
        ]);

        // Cache English genres
        genresEn.genres?.forEach((genre) => {
            genreCache.set(`${genre.id}-${SEED_CONFIG.DEFAULT_LANGUAGES.SECONDARY}`, genre.name);
        });

        // Cache Hebrew genres
        genresHe.genres?.forEach((genre) => {
            genreCache.set(`${genre.id}-${SEED_CONFIG.DEFAULT_LANGUAGES.PRIMARY}`, genre.name);
        });

        console.log(`✅ Cached ${genreCache.size} genre translations`);
    } catch (err) {
        console.error("❌ Failed to cache genre translations:", err);
    }
}

export function getCachedGenreTranslation(genreId: number, language: string): string {
    const cached = genreCache.get(`${genreId}-${language}`);
    return cached || `Genre ${genreId}`;
}

// Clear the processed genres cache (useful for testing)
export function clearProcessedGenresCache(): void {
    processedGenres.clear();
}
