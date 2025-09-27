import type { Prisma } from "@prisma/client";

export type MovieWithGenres = Prisma.MovieGetPayload<{
  include: { genres: true };
}>;
