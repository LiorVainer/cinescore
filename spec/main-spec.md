
# 🎬 CineScore MVP Spec (Updated with PascalCase Prisma Models)

## 📖 Project Description
CineScore is a web application that allows users to:
- View which movies are currently showing in Israeli cinemas.
- See IMDb ratings for each movie (via OMDb API).
- View movie details in Hebrew (via TMDB API).
- Subscribe to alerts (via Email/SMS) when new movies with certain IMDb ratings are released.
- Search interactively for movies with Hebrew details + IMDb scores.

Built with **Next.js (App Router) + Prisma + React Query v5 + Better Auth**.

---

## ⚙️ Tech Stack
- **Frontend/Backend**: Next.js App Router (Server Components + Server Actions)
- **Auth**: Better Auth (with Prisma Adapter)
- **Database**: PostgreSQL (via Prisma ORM)
- **Notifications**: Email (SendGrid) + SMS (Messaggio / BulkGate)
- **CRON**: Vercel Cron Jobs
- **APIs**:
  - TMDB (via `tmdb-ts`) – for Hebrew titles, overviews, posters, external IDs
  - OMDb (via `omdbapi`) – for IMDb ratings/votes

---

## 🗄️ Database Schema (Prisma, PascalCase Models)

```prisma
model Account {
  id                    String   @id
  accountId             String
  providerId            String
  userId                String
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime
  updatedAt             DateTime
  User                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  User      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String          @id
  name          String
  email         String          @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  Accounts      Account[]
  Sessions      Session[]

  Subscriptions Subscription[]
  Notifications Notification[]
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?
}

// --------------------------
// 🚀 Application-specific models
// --------------------------

model Subscription {
  id        String   @id @default(cuid())
  userId    String
  threshold Float
  genre     String?
  notifyBy  String   // "email" | "sms"
  createdAt DateTime @default(now())

  User User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Movie {
  id          String   @id          // imdbID
  title       String
  posterUrl   String?
  genres      String[]
  rating      Float?
  votes       Int?
  releaseDate DateTime?
  updatedAt   DateTime @updatedAt

  Notifications Notification[]
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  movieId   String
  sentAt    DateTime

  User  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  Movie Movie @relation(fields: [movieId], references: [id], onDelete: Cascade)
}
```

---

## 🔑 Core Features

### 1. User Auth & Sync
- Managed by **Better Auth** with Prisma Adapter.
- `onSignIn` event syncs user to Prisma `User` table.

### 2. Subscriptions
- Users subscribe with threshold rating + notifyBy (email/sms).
- Linked directly to `User` from `session.user.id`.

### 3. CRON Job
- Runs via **Vercel Cron** (`/api/cron/check-movies`).
- Fetches "Now Playing" movies from cinemas → enrich with TMDB + OMDb.
- Sends alerts if ratings cross thresholds.

### 4. Search Movies
- Server Action: `searchMovies(query)`
- Uses `tmdb-ts` to search with `language=he`
- For each TMDB result → fetch `external_ids` → enrich with IMDb rating/votes from `omdbapi`
- Returns enriched results

---

## 📂 Example Server Action – Search Movies

```ts
"use server";

import { tmdb, omdb } from "@/lib/clients";

export async function searchMovies(query: string) {
  if (!query || query.length < 2) return [];

  const results = await tmdb.search.movies({
    query,
    language: "he",
  });

  const enriched = await Promise.all(
    results.results.map(async (m) => {
      try {
        const external = await tmdb.movies.external_ids(m.id);

        let imdbRating: number | null = null;
        let imdbVotes: number | null = null;

        if (external.imdb_id) {
          const imdbData = await omdb.get({ id: external.imdb_id });
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
          poster: m.poster_path
            ? `https://image.tmdb.org/t/p/w200${m.poster_path}`
            : null,
          imdbId: external.imdb_id ?? null,
          imdbRating,
          imdbVotes,
        };
      } catch {
        return {
          id: m.id,
          title: m.title,
          originalTitle: m.original_title,
          overview: m.overview,
          releaseDate: m.release_date,
          poster: m.poster_path
            ? `https://image.tmdb.org/t/p/w200${m.poster_path}`
            : null,
          imdbId: null,
          imdbRating: null,
          imdbVotes: null,
        };
      }
    })
  );

  return enriched;
}
```

---

## 📂 Example Client Component – Interactive Search with Debounce

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../actions/searchMovies";
import { useState } from "react";
import { useDebounce } from "@/lib/useDebounce";

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["searchMovies", debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="חפש סרט..."
        className="border rounded-md p-2 w-full"
      />

      {isLoading && <p>מחפש...</p>}

      {data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((m: any) => (
            <li key={m.id} className="flex items-center gap-4 p-2 border rounded">
              {m.poster && <img src={m.poster} alt={m.title} className="w-12" />}
              <div>
                <p className="font-bold">
                  {m.title}{" "}
                  {m.imdbRating && (
                    <span className="text-yellow-600">
                      ⭐ {m.imdbRating} ({m.imdbVotes} votes)
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-600">{m.overview}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 📂 Debounce Hook

```ts
// lib/useDebounce.ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
```

---

## 🚀 Next Steps
1. Build `/api/cron/check-movies` endpoint with Prisma + Vercel Cron.
2. Connect subscription flow with Better Auth (session.user.id → Subscription.userId).
3. Add `subscribe` + `getSubscriptions` server actions with React Query integration.
4. Implement Email + SMS sending adapters (SendGrid, Messaggio).
