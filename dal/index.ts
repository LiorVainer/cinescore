// dal/index.ts
import {PrismaService} from "@/lib/prismaService";
import {ActorsDAL} from "./actors.dal";
import {MoviesDAL} from "./movies.dal";
import {GenresDAL} from "./genres.dal";
import {FollowDAL} from "./follows.dal";
import {InterestDAL} from "./interests.dal";
import {UserPreferencesDAL} from "./user-preferences.dal";

export function createDALs(prismaService: PrismaService) {
    return {
        actors: new ActorsDAL(prismaService.client),
        movies: new MoviesDAL(prismaService.client),
        genres: new GenresDAL(prismaService.client),
        follows: new FollowDAL(prismaService.client),
        interests: new InterestDAL(prismaService.client),
        userPreferences: new UserPreferencesDAL(prismaService.client),
    };
}

export type DAL = ReturnType<typeof createDALs>;
export * from './actors.dal';
export * from './movies.dal';
export * from './genres.dal';
export * from './follows.dal';
export * from './interests.dal';
export * from './user-preferences.dal';
