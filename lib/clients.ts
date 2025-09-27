import { TMDB } from "tmdb-ts";
import OmdbApi from "omdbapi";

if (!process.env.TMDB_API_KEY) {
  // Provide a clear error in development; in prod this will surface on first call
  console.warn("TMDB_API_KEY is not set");
}
if (!process.env.OMDB_API_KEY) {
  console.warn("OMDB_API_KEY is not set");
}

export const tmdb = new TMDB(
    process.env.TMDB_API_READ_ACCESS_TOKEN || "")

export const omdb = new OmdbApi(
 process.env.OMDB_API_KEY || "",
);

