import {createDALs} from "@/dal";
import {tmdb} from "@/lib/clients";
import {prisma} from "@/lib/prisma";
import {PrismaService} from "@/lib/prismaService";
import {Language} from "@prisma/client";

const prismaService = new PrismaService(prisma);
const dal = createDALs(prismaService);

// Hebrew genre translations mapping
const hebrewGenreMap: Record<number, string> = {
    28: "פעולה",        // Action
    12: "הרפתקאות",     // Adventure
    16: "אנימציה",      // Animation
    35: "קומדיה",       // Comedy
    80: "פשע",         // Crime
    99: "דוקומנטרי",    // Documentary
    18: "דרמה",        // Drama
    10751: "משפחה",     // Family
    14: "פנטזיה",      // Fantasy
    36: "היסטוריה",    // History
    27: "אימה",        // Horror
    10402: "מוזיקה",   // Music
    9648: "מסתורין",   // Mystery
    10749: "רומנטיקה", // Romance
    878: "מדע בדיוני",  // Science Fiction
    10770: "סרט טלוויזיה", // TV Movie
    53: "מתח",         // Thriller
    10752: "מלחמה",    // War
    37: "מערבון"       // Western
};

export async function seedGenresOnly() {
    console.log("🏷️ Starting genre-only seeding process...");
    const startTime = Date.now();

    try {
        // Fetch all genres from TMDB
        console.log("📡 Fetching genres from TMDB...");
        const genresResponse = await tmdb.genres.movies();

        if (!genresResponse.genres?.length) {
            console.warn("⚠️ No genres found from TMDB.");
            return;
        }

        console.log(`📋 Found ${genresResponse.genres.length} genres to process`);

        let processedCount = 0;
        let updatedCount = 0;

        // Process each genre
        for (const genre of genresResponse.genres) {
            try {
                console.log(`\n🏷️ Processing genre: ${genre.name} (ID: ${genre.id})`);

                // Upsert base genre
                const baseGenre = await dal.genres.upsertBaseGenre(genre.id);
                console.log(`📝 Upserted base genre: ${baseGenre.id}`);

                // Get Hebrew translation or fallback to English
                const hebrewName = hebrewGenreMap[genre.id] || genre.name;

                console.log(`🇺🇸 English: ${genre.name}`);
                console.log(`🇮🇱 Hebrew: ${hebrewName}`);

                // Upsert both translations
                await Promise.all([
                    dal.genres.upsertTranslation(baseGenre.id, Language.en_US, genre.name),
                    dal.genres.upsertTranslation(baseGenre.id, Language.he_IL, hebrewName),
                ]);

                processedCount++;
                if (hebrewGenreMap[genre.id]) {
                    updatedCount++;
                }

                console.log(`✅ Completed genre: ${genre.name}`);
            } catch (err) {
                console.error(`❌ Failed to process genre ${genre.name}:`, err);
            }
        }

        const duration = Date.now() - startTime;
        console.log(`\n🎉 Genre seeding complete!`);
        console.log(`📊 Processed: ${processedCount}/${genresResponse.genres.length} genres`);
        console.log(`🇮🇱 Hebrew translations: ${updatedCount} genres`);
        console.log(`⏱️ Total time: ${Math.floor(duration / 1000)}s`);

    } catch (err) {
        console.error("💥 Genre seeding failed:", err);
        throw err;
    }
}

// Run as a script
if (require.main === module) {
    seedGenresOnly()
        .then(() => {
            console.log("🔌 Disconnecting from database...");
            return prisma.$disconnect();
        })
        .catch(async (err) => {
            console.error("💥 Genre seed failed:", err);
            await prisma.$disconnect();
            process.exit(1);
        });
}
