import {tmdb} from "@/lib/clients";
import {Language, Prisma} from "@prisma/client";
import Bluebird from "bluebird";
import type {DAL} from "@/dal";
import type {MovieData} from "./movie-processor";
import {SEED_CONFIG} from "./seed-config";
// Import official types from tmdb-ts instead of manual definitions
import type {PersonDetails} from "tmdb-ts";

// Define the correct cast member type based on TMDB credits response
type CastMember = {
    id: number;
    name: string;
    character: string;
    order: number;
    profile_path: string | null;
    popularity: number;
};

// Utility function to add delay between operations
async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function processMovieActors(movieData: MovieData, dal: DAL): Promise<void> {
    const {baseMovie, credits, detailsEn} = movieData;

    const cast = credits.cast?.slice(0, SEED_CONFIG.MAX_CAST_MEMBERS_PER_MOVIE) ?? [];
    if (!cast.length) {
        console.log(`👥 No cast found for ${detailsEn.title}`);
        return;
    }

    console.log(`👥 Processing ${cast.length} actors for ${detailsEn.title}...`);

    // Process actors with controlled concurrency and delays
    await Bluebird.map(cast, async (person: CastMember, index: number) => {
        try {
            // Add delay between actor processing to reduce connection pressure
            if (index > 0) {
                await delay(SEED_CONFIG.DB_OPERATION_DELAY);
            }

            console.log(`🎭 Processing actor: ${person.name} (ID: ${person.id})`);

            // Fetch actor details sequentially to reduce API rate limit pressure
            const actorDetailsEn = await tmdb.people.details(person.id, undefined, SEED_CONFIG.DEFAULT_LANGUAGES.SECONDARY) as PersonDetails;
            await delay(50); // Small delay between API calls
            const actorDetailsHe = await tmdb.people.details(person.id, undefined, SEED_CONFIG.DEFAULT_LANGUAGES.PRIMARY) as PersonDetails;

            // Use Prisma input type for actor creation
            const actorCreateInput: Prisma.ActorCreateInput = {
                imdbId: actorDetailsEn.imdb_id ?? `tmdb-${person.id}`,
                tmdbId: person.id,
                profileUrl: person.profile_path
                    ? `${SEED_CONFIG.TMDB_POSTER_BASE_URL}${person.profile_path}`
                    : null,
                popularity: person.popularity ?? null,
                birthday: actorDetailsEn.birthday
                    ? new Date(actorDetailsEn.birthday)
                    : null,
                deathday: actorDetailsEn.deathday
                    ? new Date(actorDetailsEn.deathday)
                    : null,
                placeOfBirth: actorDetailsEn.place_of_birth ?? null,
            };

            // Upsert base actor
            const baseActor = await dal.actors.upsertBase(actorCreateInput);
            console.log(`📝 Upserted actor: ${baseActor.id}`);

            // Add small delay before translations
            await delay(25);

            // Use Prisma input types for actor translations
            const translationEn: Omit<Prisma.ActorTranslationCreateInput, "actor" | "language"> = {
                name: actorDetailsEn.name ?? "Unknown",
                biography: actorDetailsEn.biography ?? null,
            };

            const translationHe: Omit<Prisma.ActorTranslationCreateInput, "actor" | "language"> = {
                name: actorDetailsHe.name ?? actorDetailsEn.name ?? "Unknown",
                biography: actorDetailsHe.biography ?? actorDetailsEn.biography ?? null,
            };

            // Process translations sequentially to reduce connection pressure
            await dal.actors.upsertTranslation(baseActor.id, Language.en_US, translationEn);
            await delay(25);
            await dal.actors.upsertTranslation(baseActor.id, Language.he_IL, translationHe);

            console.log(`🌐 Added translations for actor: ${actorDetailsEn.name}`);

            // Add delay before cast connection
            await delay(25);

            // Connect to movie (Cast) - use typed parameters
            const castConnection: Parameters<typeof dal.actors.connectToMovie>[2] = {
                character: person.character ?? null,
                order: person.order ?? null,
            };

            await dal.actors.connectToMovie(baseMovie.id, baseActor.id, castConnection);
            console.log(`🔗 Connected actor ${actorDetailsEn.name} to movie ${detailsEn.title}`);

            console.log(`✅ Processed actor: ${actorDetailsEn.name}`);
        } catch (err) {
            console.error(`❌ Failed to process actor ${person.name}:`, err);
            console.error(`   Person data:`, JSON.stringify(person, null, 2));
        }
    }, {concurrency: SEED_CONFIG.ACTOR_PROCESSING_CONCURRENCY});

    console.log(`👥 Completed processing ${cast.length} actors for ${detailsEn.title}`);
}

export async function batchProcessActors(movieDataList: MovieData[], dal: DAL): Promise<void> {
    console.log(`👥 Batch processing actors for ${movieDataList.length} movies...`);

    // Process movies sequentially to avoid overwhelming the database
    for (let i = 0; i < movieDataList.length; i++) {
        const movieData = movieDataList[i];
        console.log(`👥 Processing actors for movie ${i + 1}/${movieDataList.length}: ${movieData.detailsEn.title}`);

        await processMovieActors(movieData, dal);

        // Add delay between movies to prevent connection buildup
        if (i < movieDataList.length - 1) {
            await delay(SEED_CONFIG.DB_OPERATION_DELAY * 2);
        }
    }

    console.log(`👥 Completed batch processing actors for all movies`);
}
