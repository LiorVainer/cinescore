import { NextResponse } from "next/server";
import { tmdb, omdb } from "@/lib/clients";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1) Fetch now playing in Israel
    const nowPlaying = await tmdb.movies.nowPlaying({ language: "he-IL", region: "IL" });

    const items = nowPlaying.results ?? [];

    // 2) Enrich with IMDB and upsert into DB
    for (const m of items) {
      try {
        const ext = await tmdb.movies.externalIds(m.id);
        const imdbId = ext.imdb_id ?? null;

        let rating: number | null = null;
        let votes: number | null = null;
        if (imdbId) {
          const imdbData = await omdb.get({ id: imdbId });
          rating = imdbData.imdbRating && imdbData.imdbRating !== "N/A" ? parseFloat(imdbData.imdbRating) : null;
          votes = imdbData.imdbVotes && imdbData.imdbVotes !== "N/A" ? parseInt(imdbData.imdbVotes.replace(/,/g, ""), 10) : null;
        }

        const genres = (m.genre_ids as number[] | undefined) ?? [];
        // Fetch genre names lazily not necessary for MVP; store ids as strings
        const genreStrings = genres.map((g) => String(g));

        const imdbKey = imdbId ?? `tmdb-${m.id}`; // Fallback id if no IMDB
        const title = m.title ?? m.original_title ?? "";
        await prisma.movie.upsert({
          where: { id: imdbKey },
          create: {
            id: imdbKey,
            title,
            posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : null,
            genres: genreStrings,
            rating: rating ?? undefined,
            votes: votes ?? undefined,
            releaseDate: m.release_date ? new Date(m.release_date) : undefined,
          },
          update: {
            title,
            posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : null,
            genres: genreStrings,
            rating: rating ?? undefined,
            votes: votes ?? undefined,
            releaseDate: m.release_date ? new Date(m.release_date) : undefined,
          },
        });

        // 3) Notify users who subscribed and haven't been notified for this movie
        if (rating != null) {
          const subs = await prisma.subscription.findMany({ where: { threshold: { lte: rating } } });
          for (const sub of subs) {
            const existing = await prisma.notification.findFirst({ where: { userId: sub.userId, movieId: imdbKey } });
            if (existing) continue;

            // Placeholder notify by email/sms
            // We'll import lazily to avoid static import cycles
            // const { notifyUser } = await import("@/lib/notify");
            // await notifyUser({ userId: sub.userId, method: sub.notifyBy, movie: { id: imdbKey, title, rating } });

            await prisma.notification.create({ data: { userId: sub.userId, movieId: imdbKey } });
          }
        }
      } catch (e) {
        console.error("cron item error", e);
        continue;
      }
    }

    return NextResponse.json({ ok: true, count: items.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
