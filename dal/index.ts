// dal/index.ts
import {PrismaService} from "@/lib/prismaService";
import {ActorsDAL} from "./actors.dal";
import {MoviesDAL} from "./movies.dal";
import {GenresDAL} from "./genres.dal";

export function createDALs(prismaService: PrismaService) {
    return {
        actors: new ActorsDAL(prismaService.client),
        movies: new MoviesDAL(prismaService.client),
        genres: new GenresDAL(prismaService.client),
    };
}

export type DAL = ReturnType<typeof createDALs>;
export * from './actors.dal';
export * from './movies.dal';