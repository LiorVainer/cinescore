import { NextResponse } from "next/server";
import { tmdb, omdb, imdb } from "@/lib/clients";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1) Fetch now playing in Israel
    const nowPlaying = await tmdb.movies.nowPlaying({
      language: "he-IL",
      region: "IL",
    });

    const items = nowPlaying.results ?? [];

    // 2) Enrich with IMDB and upsert into DB
    for (const movie of items) {
      try {
        const ext = await tmdb.movies.externalIds(movie.id);
        const imdbId = ext.imdb_id ?? null;

        let rating: number | undefined;
        let votes: number | undefined;
        if (imdbId) {
          const omdbMovieData = await omdb.title.getById({ i: imdbId });
          const isImdbRatingInOmdb =
            !!omdbMovieData.imdbRating && omdbMovieData.imdbRating !== "N/A";
          const isImdbVotesInOmdb =
            !!omdbMovieData.imdbVotes && omdbMovieData.imdbVotes !== "N/A";

          if (isImdbRatingInOmdb && isImdbVotesInOmdb) {
            rating = parseFloat(omdbMovieData.imdbRating as string);
            votes = parseInt(omdbMovieData.imdbVotes!.replace(/,/g, ""), 10);
          } else {
            const imdbMovieData = await imdb.titles.imDbApiServiceGetTitle({
              titleId: imdbId,
            });

            rating = imdbMovieData.rating?.aggregateRating;
            votes = imdbMovieData.rating?.voteCount;
          }
        }

        const genres = (movie.genre_ids as number[] | undefined) ?? [];
        // Fetch genre names lazily not necessary for MVP; store ids as strings
        const genreStrings = genres.map((g) => String(g));

        const imdbKey = imdbId ?? `tmdb-${movie.id}`; // Fallback id if no IMDB
        const title = movie.title ?? movie.original_title ?? "";
        await prisma.movie.upsert({
          where: { id: imdbKey },
          create: {
            id: imdbKey,
            title,
            posterUrl: movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : null,
            genres: genreStrings,
            rating,
            votes,
            releaseDate: movie.release_date
              ? new Date(movie.release_date)
              : undefined,
          },
          update: {
            title,
            posterUrl: movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : null,
            genres: genreStrings,
            rating,
            votes,
            releaseDate: movie.release_date
              ? new Date(movie.release_date)
              : undefined,
          },
        });

        // 3) Notify users who subscribed and haven't been notified for this movie
        if (rating != null) {
          const subs = await prisma.subscription.findMany({
            where: { threshold: { lte: rating } },
          });
          for (const sub of subs) {
            const existing = await prisma.notification.findFirst({
              where: {
                userId: sub.userId,
                movieId: imdbKey,
              },
            });
            if (existing) continue;

            // Placeholder notify by email/sms
            // We'll import lazily to avoid static import cycles
            // const { notifyUser } = await import("@/lib/notify");
            // await notifyUser({ userId: sub.userId, method: sub.notifyBy, movie: { id: imdbKey, title, rating } });

            await prisma.notification.create({
              data: { userId: sub.userId, movieId: imdbKey },
            });
          }
        }
      } catch (e) {
        console.error("cron item error", e);
      }
    }

    return NextResponse.json({ ok: true, count: items.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
