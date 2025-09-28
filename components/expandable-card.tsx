import React, { useState } from "react";
import { CometCard } from "@/components/ui/comet-card";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: string; // prisma Movie.id is String
  title: string;
  posterUrl?: string | null;
  rating?: number | null;
  votes?: number | null;
  releaseDate?: string | null; // ISO string from API JSON
  genres?: Genre[];
}

const ExpandableCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const [expanded, setExpanded] = useState(false);
  const release = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString()
    : "";

  return (
    <CometCard className="rounded-2xl bg-background p-4">
      <div className="flex items-start gap-4">
        {movie.posterUrl && (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-32 w-24 rounded-md object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold leading-tight">
                {movie.title}
              </h2>
              {release && (
                <p className="text-xs text-muted-foreground">
                  Released: {release}
                </p>
              )}
            </div>
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-sm text-primary underline underline-offset-4"
            >
              {expanded ? "Hide Details" : "Show Details"}
            </button>
          </div>

          {expanded && (
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex gap-4 text-muted-foreground">
                <span>Rating: {movie.rating ?? "N/A"}</span>
                <span>Votes: {movie.votes ?? "N/A"}</span>
              </div>
              {!!movie.genres?.length && (
                <div>
                  <strong className="mr-2">Genres:</strong>
                  <ul className="mt-1 flex flex-wrap gap-2">
                    {movie.genres?.map((g) => (
                      <li
                        key={g.id}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {g.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </CometCard>
  );
};

export default ExpandableCard;
