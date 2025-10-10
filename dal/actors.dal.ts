import {PrismaClient, Language, Prisma} from "@prisma/client";

export class ActorsDAL {
    constructor(private prisma: PrismaClient) {
    }

    async upsertBase(
        data: Omit<Prisma.ActorCreateInput, "translations" | "cast">
    ) {
        return this.prisma.actor.upsert({
            where: {imdbId: data.imdbId},
            create: data,
            update: data,
        });
    }

    async upsertTranslation(
        actorId: string,
        language: Language,
        data: Omit<Prisma.ActorTranslationCreateInput, "actor" | "language">
    ) {
        return this.prisma.actorTranslation.upsert({
            where: {actorId_language: {actorId, language}},
            update: {
                name: data.name,
                biography: data.biography,
            },
            create: {
                actor: {connect: {id: actorId}},
                language,
                name: data.name,
                biography: data.biography ?? null,
            },
        });
    }

    /**
     * Connects an actor to a movie (Cast table).
     * If connection already exists, updates metadata instead.
     */
    async connectToMovie(
        movieId: string,
        actorId: string,
        data: { character?: string | null; order?: number | null }
    ) {
        return this.prisma.cast.upsert({
            where: {movieId_actorId: {movieId, actorId}},
            update: {
                character: data.character ?? null,
                order: data.order ?? null,
            },
            create: {
                movie: {connect: {id: movieId}},
                actor: {connect: {id: actorId}},
                character: data.character ?? null,
                order: data.order ?? null,
            },
        });
    }
}
