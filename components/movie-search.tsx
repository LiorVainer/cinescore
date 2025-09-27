"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/lib/useDebounce";

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);

  const { data, isFetching } = useQuery({
    queryKey: ["searchMovies", debounced],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(debounced)}`);
      if (!res.ok) throw new Error("Search failed");
      const json = await res.json();
      return json.results as Array<{
        id: number;
        title: string;
        overview: string;
        poster: string | null;
        imdbRating: number | null;
        imdbVotes: number | null;
      }>;
    },
    enabled: debounced.trim().length > 1,
  });

  return (
    <div className="space-y-4 p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="חפש סרט..."
        className="border rounded-md p-2 w-full"
      />

      {isFetching && <p>מחפש...</p>}

      {data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((m) => (
            <li key={m.id} className="flex items-center gap-4 p-2 border rounded">
              {m.poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.poster} alt={m.title} className="w-12 h-auto" />
              )}
              <div>
                <p className="font-bold">
                  {m.title}{" "}
                  {m.imdbRating && (
                    <span className="text-yellow-600">
                      ⭐ {m.imdbRating} ({m.imdbVotes ?? 0} votes)
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2">{m.overview}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
