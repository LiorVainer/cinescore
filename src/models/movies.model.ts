import type { Prisma } from '@prisma/client';

export type PopulatedMovie = Prisma.MovieGetPayload<{
    include: { genres: true; trailers: true };
}>;
