import {createDALs} from "@/dal";
import {tmdb} from "@/lib/clients";
import {prisma} from "@/lib/prisma";
import {PrismaService} from "@/lib/prismaService";
import Bluebird from "bluebird";

// Import our optimized processors
import {
    type MovieData,
    processMovieData,
    processMovieTrailers,
    processMovieTranslations
} from "./seeders/movie-processor";
import {cacheGenreTranslations, processMovieGenres} from "./seeders/genre-processor";
import {batchProcessActors} from "./seeders/actor-processor";
import {SEED_CONFIG} from "./seeders/seed-config";

const prismaService = new PrismaService(prisma);
const dal = createDALs(prismaService);

// Utility function to format duration
function formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

// Utility function to add delay between operations
async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility function to time async operations
async function timeOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    console.log(`⏱️ Starting: ${name}...`);

    try {
        const result = await operation();
        const duration = Date.now() - startTime;
        console.log(`✅ Completed: ${name} (${formatDuration(duration)})`);
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ Failed: ${name} (${formatDuration(duration)})`);
        throw error;
    }
}

export async function seedNowPlayingMovies() {
    const totalStartTime = Date.now();
    console.log("🚀 Starting optimized movie seeding process...");
    console.log(`📅 Started at: ${new Date().toLocaleString()}`);

    try {
        // Step 1: Cache genre translations upfront to avoid repeated API calls
        await timeOperation("Genre translations caching", async () => {
            await cacheGenreTranslations();
        });

        // Add delay to let connections settle
        await delay(SEED_CONFIG.DB_OPERATION_DELAY);

        // Step 2: Fetch now-playing movies
        const nowPlaying = await timeOperation("Fetching now-playing movies", async () => {
            console.log("🎬 Fetching now-playing movies...");
            return await tmdb.movies.nowPlaying({
                language: SEED_CONFIG.DEFAULT_LANGUAGES.PRIMARY,
                region: SEED_CONFIG.TMDB_REGION,
            });
        });

        if (!nowPlaying.results?.length) {
            console.warn("⚠️ No movies found in TMDB feed.");
            return;
        }

        console.log(`📋 Found ${nowPlaying.results.length} movies to process`);

        // Step 3: Process basic movie data with reduced concurrency
        const movieDataList = await timeOperation("Processing movie data in parallel", async () => {
            console.log("🔄 Processing movie data with controlled concurrency...");
            return Bluebird.map(
                nowPlaying.results,
                async (movie, index) => {
                    // Add small delay between movie processing
                    if (index > 0) {
                        await delay(SEED_CONFIG.DB_OPERATION_DELAY / 2);
                    }
                    return processMovieData(movie, dal);
                },
                {concurrency: SEED_CONFIG.MOVIE_PROCESSING_CONCURRENCY}
            );
        });

        // Filter out null results and add delay
        const validMovieData = movieDataList.filter((data): data is MovieData => data !== null);

        if (!validMovieData.length) {
            const totalDuration = Date.now() - totalStartTime;
            console.log("✅ All movies already exist in database. Seeding complete!");
            console.log(`🎯 Total time: ${formatDuration(totalDuration)}`);
            return;
        }

        console.log(`📊 Processing ${validMovieData.length} new movies...`);
        await delay(SEED_CONFIG.DB_OPERATION_DELAY);

        // Step 4: Process all translations with controlled concurrency
        await timeOperation("Processing movie translations", async () => {
            console.log("🌐 Processing movie translations...");
            await Bluebird.map(
                validMovieData,
                async (movieData, index) => {
                    if (index > 0) {
                        await delay(25); // Small delay between translations
                    }
                    return processMovieTranslations(movieData, dal);
                },
                {concurrency: SEED_CONFIG.TRANSLATION_PROCESSING_CONCURRENCY}
            );
        });

        await delay(SEED_CONFIG.DB_OPERATION_DELAY);

        // Step 5: Process genres with controlled concurrency
        await timeOperation("Processing movie genres", async () => {
            console.log("🏷️ Processing movie genres...");
            await Bluebird.map(
                validMovieData,
                async (movieData, index) => {
                    if (index > 0) {
                        await delay(50); // Delay between genre processing
                    }
                    return processMovieGenres(movieData, dal);
                },
                {concurrency: SEED_CONFIG.GENRE_PROCESSING_CONCURRENCY}
            );
        });

        await delay(SEED_CONFIG.DB_OPERATION_DELAY);

        // Step 6: Process trailers with controlled concurrency
        await timeOperation("Processing movie trailers", async () => {
            console.log("🎞️ Processing movie trailers...");
            await Bluebird.map(
                validMovieData,
                async (movieData, index) => {
                    if (index > 0) {
                        await delay(25); // Small delay between trailers
                    }
                    return processMovieTrailers(movieData, dal);
                },
                {concurrency: SEED_CONFIG.TRAILER_PROCESSING_CONCURRENCY}
            );
        });

        await delay(SEED_CONFIG.DB_OPERATION_DELAY * 2); // Longer delay before actors

        // Step 7: Process actors sequentially (most DB intensive)
        await timeOperation("Processing movie cast", async () => {
            console.log("👥 Processing movie cast with connection management...");
            await batchProcessActors(validMovieData, dal);
        });

        const totalDuration = Date.now() - totalStartTime;
        console.log(`\n🎉 Seeding complete! Processed ${validMovieData.length} movies successfully.`);
        console.log(`📅 Finished at: ${new Date().toLocaleString()}`);
        console.log(`🎯 Total seeding time: ${formatDuration(totalDuration)}`);
        console.log(`⚡ Average time per movie: ${formatDuration(totalDuration / validMovieData.length)}`);

    } catch (err) {
        const totalDuration = Date.now() - totalStartTime;
        console.error("💥 Seeding failed:", err);
        console.log(`⏱️ Failed after: ${formatDuration(totalDuration)}`);
        throw err;
    }
}

// Utility function for targeted seeding
export async function seedSpecificMovie(tmdbId: number) {
    const startTime = Date.now();
    console.log(`🎬 Seeding specific movie: ${tmdbId}`);
    console.log(`📅 Started at: ${new Date().toLocaleString()}`);

    try {
        await timeOperation("Genre translations caching", async () => {
            await cacheGenreTranslations();
        });

        const movieDetails = await timeOperation(`Fetching movie details for ${tmdbId}`, async () => {
            return await tmdb.movies.details(tmdbId);
        });

        const movieData = await timeOperation("Processing movie data", async () => {
            return await processMovieData(movieDetails, dal);
        });

        if (!movieData) {
            console.log("Movie already exists or failed to process");
            return;
        }

        // Process all aspects of the movie
        await timeOperation("Processing movie aspects", async () => {
            await Bluebird.all([
                processMovieTranslations(movieData, dal),
                processMovieGenres(movieData, dal),
                processMovieTrailers(movieData, dal),
            ]);
        });

        await timeOperation("Processing movie actors", async () => {
            await batchProcessActors([movieData], dal);
        });

        const totalDuration = Date.now() - startTime;
        console.log(`✅ Successfully seeded movie: ${movieData.title}`);
        console.log(`📅 Finished at: ${new Date().toLocaleString()}`);
        console.log(`🎯 Total time: ${formatDuration(totalDuration)}`);
    } catch (err) {
        const totalDuration = Date.now() - startTime;
        console.error(`❌ Failed to seed movie ${tmdbId}:`, err);
        console.log(`⏱️ Failed after: ${formatDuration(totalDuration)}`);
        throw err;
    }
}

// Run as a script
if (require.main === module) {
    seedNowPlayingMovies()
        .then(() => {
            console.log("🔌 Disconnecting from database...");
            return prisma.$disconnect();
        })
        .catch(async (err) => {
            console.error("💥 Seed failed:", err);
            await prisma.$disconnect();
            process.exit(1);
        });
}
