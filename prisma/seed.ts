import {prisma} from '../src/lib/prisma';
import {imdb, omdb, tmdb} from "@/lib/clients";

export async function seedNowPlayingMovies() {
    // Preload TMDB genres (id + localized name) and ensure they exist in DB
    const tmdbGenres = await tmdb.genres.movies({language: "he-IL"});
    const genreNameById = new Map<number, string>(
        tmdbGenres.genres.map((g) => [g.id, g.name]),
    );

    // Upsert all TMDB genres into the DB to guarantee connect works later
    for (const genre of tmdbGenres.genres) {
        await prisma.genre.upsert({
            where: {id: genre.id},
            create: {id: genre.id, name: genre.name},
            update: {name: genre.name},
        });
    }

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
                const omdbMovieData = await omdb.title.getById({i: imdbId});
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
                    rating = imdbMovieData.rating?.aggregateRating ?? undefined;
                    votes = imdbMovieData.rating?.voteCount ?? undefined;
                }
            }

            const genreIds = (movie.genre_ids as number[] | undefined) ?? [];
            // Back-compat legacy string ids array

            // Ensure all movie genres exist in DB (in case TMDB list missed any id for the locale)
            for (const gid of genreIds) {
                const name = genreNameById.get(gid) ?? String(gid);
                await prisma.genre.upsert({
                    where: {id: gid},
                    create: {id: gid, name},
                    update: {name},
                });
            }

            const imdbKey = imdbId ?? `tmdb-${movie.id}`; // Fallback id if no IMDB
            const title = movie.title ?? movie.original_title ?? "";
            await prisma.movie.upsert({
                where: {id: imdbKey},
                create: {
                    id: imdbKey,
                    title,
                    description: movie.overview ?? "",
                    posterUrl: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                        : null,
                    rating,
                    votes,
                    releaseDate: movie.release_date
                        ? new Date(movie.release_date)
                        : undefined,
                    // Link genres by id
                    genres: {connect: genreIds.map((id) => ({id}))},
                },
                update: {
                    title,
                    posterUrl: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                        : null,
                    rating,
                    votes,
                    releaseDate: movie.release_date
                        ? new Date(movie.release_date)
                        : undefined,
                    // Replace genre links to match current TMDB ids
                    genres: {set: genreIds.map((id) => ({id}))},
                },
            });

            // 3) Notify users who subscribed and haven't been notified for this movie
            if (rating != null) {
                const subs = await prisma.subscription.findMany({
                    where: {threshold: {lte: rating}},
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
                    // const { notifyUser } = await import("@/lib/notify");
                    // await notifyUser({ userId: sub.userId, method: sub.notifyBy, movie: { id: imdbKey, title, rating } });

                    await prisma.notification.create({
                        data: {userId: sub.userId, movieId: imdbKey},
                    });
                }
            }
        } catch (e) {
            console.error("cron item error", e);
        }
    }
    console.log(`Seeded ${items.length} now playing movies.`);

    return items.length;
}

seedNowPlayingMovies()
    .then(() => console.log('Database seeded'))
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
