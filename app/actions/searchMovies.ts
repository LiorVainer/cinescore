"use server";

import { tmdb, omdb } from "@/lib/clients";

export type SearchedMovie = {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string | null;
  poster: string | null;
  imdbId: string | null;
  imdbRating: number | null;
  imdbVotes: number | null;
};

export async function searchMovies(query: string): Promise<SearchedMovie[]> {
  if (!query || query.trim().length < 2) return [];

  const results = await tmdb.search.movies({
    query,
    language: "he-IL",
  });

  return Promise.all(
    results.results.map(async (m: any) => {
      try {
        const external = await tmdb.movies.externalIds(m.id);

        let imdbRating: number | null = null;
        let imdbVotes: number | null = null;
        const imdbId: string | null = external.imdb_id ?? null;

        if (imdbId) {
          const imdbData = await omdb.get({ id: imdbId });
          imdbRating =
            imdbData.imdbRating && imdbData.imdbRating !== "N/A"
              ? parseFloat(imdbData.imdbRating)
              : null;
          imdbVotes =
            imdbData.imdbVotes && imdbData.imdbVotes !== "N/A"
              ? parseInt(imdbData.imdbVotes.replace(/,/g, ""), 10)
              : null;
        }

        return {
          id: m.id,
          title: m.title,
          originalTitle: m.original_title,
          overview: m.overview,
          releaseDate: m.release_date,
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : null,
          imdbId,
          imdbRating,
          imdbVotes,
        } satisfies SearchedMovie;
      } catch {
        return {
          id: m.id,
          title: m.title,
          originalTitle: m.original_title,
          overview: m.overview,
          releaseDate: m.release_date,
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : null,
          imdbId: null,
          imdbRating: null,
          imdbVotes: null,
        } satisfies SearchedMovie;
      }
    })
  );
}
