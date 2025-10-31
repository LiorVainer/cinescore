import { Language, PrismaClient } from '@prisma/client';

export class GenresDAL {
    constructor(private prisma: PrismaClient) {}

    async upsertBaseGenre(tmdbId: number) {
        return this.prisma.genre.upsert({
            where: { tmdbId },
            create: { tmdbId },
            update: {},
        });
    }

    async upsertTranslation(genreId: string, language: Language, name: string) {
        return this.prisma.genreTranslation.upsert({
            where: { genreId_language: { genreId, language } },
            create: {
                genre: { connect: { id: genreId } },
                language,
                name,
            },
            update: { name },
        });
    }

    async findByTmdbId(tmdbId: number) {
        return this.prisma.genre.findUnique({
            where: { tmdbId },
        });
    }

    /**
     * Fetches a genre by ID with all translations
     */
    async findByIdWithTranslations(genreId: string) {
        return this.prisma.genre.findUnique({
            where: { id: genreId },
            include: {
                translations: true,
            },
        });
    }

    /**
     * Fetches a genre by TMDB ID with all translations
     */
    async findByTmdbIdWithTranslations(tmdbId: number) {
        return this.prisma.genre.findUnique({
            where: { tmdbId },
            include: {
                translations: true,
            },
        });
    }
}
