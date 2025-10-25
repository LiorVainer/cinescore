# 🎬 Feature Spec — Unified Movie Search (Single Server Action + FiltersContext + Responsive Modal/Drawer)

## 🧭 Objective
Create a **responsive, unified search experience** for CineScore that centralizes all filtering logic, uses a single backend server action (`searchMoviesFiltered`), and provides a modern UX with a **Modal (desktop)** and **Drawer (mobile)**.

This feature will consolidate:
- Title/original title text search  
- Actor name filtering (via TMDB People API)  
- Genre & sort filters  
- Future: movie `duration` filter (once supported in schema)  
- URL sync with **nuqs**  
- Context-driven filter state (`FiltersContext`)  
- Responsive shadcn components for modal/drawer

---

## ⚙️ Architecture Overview

```
components/
└── movie-search/
    ├── movie-search.tsx             # existing orchestrator (TanStack Query + debounced filters)
    ├── FilterBar.tsx                # existing UI shell for Search/Sort/Genres
    ├── SearchInput.tsx              # existing controlled input + debounce awareness
    ├── SortSelect.tsx               # existing sort dropdown (SortValue-aware)
    ├── GenresMultiSelect.tsx        # existing async select for genres
    ├── SelectedGenreChips.tsx       # existing chip list with remove callbacks
    ├── FiltersContext.tsx           # new context provider wrapping filter state + setters
    ├── useFilters.ts                # new typed nuqs hook syncing context <-> URL
    ├── ActorSearchInput.tsx         # new TMDB people autocomplete (async + debounce)
    ├── SearchModalOrDrawer.tsx      # new responsive shell (Dialog/Drawer, leverages `useIsMobile`)
    ├── SearchButton.tsx             # new navbar trigger launching modal/drawer
    └── SearchModalContent.tsx       # new modal body composed from FilterBar + results
app/
└── actions/
    └── searchMoviesFiltered.ts      # UPDATED: supports actor filtering
```

---

## 🧠 Filter Model (Strongly Typed)

```ts
export type MovieFilters = {
  search?: string;
  searchDebounced?: string;          // derived, keep explicit to avoid accidental mismatches
  actorName?: string;
  sort?: SortValue;              // 'rating:desc' | 'votes:desc' | 'releaseDate:desc'
  selectedGenres?: number[];
  // duration?: [number, number]; // future field once Movie schema supports it
  page?: number;
  pageSize?: number;
  language?: Language;
};
```

---

## ⚙️ Unified Server Action — `searchMoviesFiltered`

### File: `/app/actions/searchMovies.ts` (existing export)

#### Responsibilities
- Maintain a single code path for:
  - search term
  - genres (TMDB ids)
  - sort order
  - **actor name** (needs new TMDB movie credits lookup)
  - pagination + locale-aware translations
- Handle pagination and language translation via Prisma.
- Reuse `MoviesDAL.getMoviesWithLanguageTranslation` and `countMovies`.
- Return enriched movie data in the same structure used today (movie cards expect `MovieWithLanguageTranslation`).

#### Future Support:
- Add duration filtering (`gte` / `lte`) once `Movie` schema includes a `duration` field (in minutes).

#### Implementation Outline
```ts
export const searchMoviesFiltered = async (filters: MovieFilters) => {
  const {
    search = '',
    searchDebounced = search,       // use debounced value for API calls
    actorName = '',
    sort = 'rating:desc',
    selectedGenres = [],
    page = 1,
    pageSize = 24,
    language = Language.he_IL,
  } = filters;

  const q = search.trim();
  const actor = actorName.trim();
  const [field, direction] = (sort || 'rating:desc').split(':') as [
    'rating' | 'votes' | 'releaseDate',
    'asc' | 'desc',
  ];

  const where: Prisma.MovieWhereInput = {};

  // --- Text search
  if (q.length > 0) {
    where.translations = {
      some: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { originalTitle: { contains: q, mode: 'insensitive' } },
        ],
      },
    };
  }

  // --- Genres
  if (selectedGenres.length > 0) {
    where.genres = { some: { tmdbId: { in: selectedGenres } } };
  }

  // --- Actor filter (via TMDB)
  if (actor.length > 0) {
    try {
      const actorSearch = await tmdb.search.people({ query: actor, language: 'he-IL' });
      const actorMatch = actorSearch.results[0];
      if (actorMatch) {
        const credits = await tmdb.people.movie_credits(actorMatch.id);
        const movieIds = credits.cast.map((m) => m.id);
        where.tmdbId = { in: movieIds };
      }
    } catch (err) {
      console.error('Actor filter failed', err);
    }
  }

  // --- Pagination
  const skip = (Math.max(1, page) - 1) * Math.max(1, pageSize);
  const take = Math.max(1, Math.min(100, pageSize));

  const [items, total] = await Promise.all([
    moviesDAL.getMoviesWithLanguageTranslation(language, {
      where,
      orderBy: [{ [field]: direction }],
      skip,
      take,
    }),
    moviesDAL.countMovies(where),
  ]);

  return {
    items,
    total,
    page,
    pageSize: take,
    totalPages: Math.ceil(total / take) || 1,
  };
};
```

---

## 🧰 FilterBar Composition (existing code)

- `FilterBar.tsx` expects fully controlled props (`search`, `sort`, `selectedGenres`) and emits setters.
- Internally renders:
  - `SearchInput` (debounce handled in parent via `useDebounce`).
  - `SortSelect` (uses `SortValue` type from `@/constants/sort.const`).
  - `GenresMultiSelect` (TanStack Query-fed options).
  - `SelectedGenreChips` (mirrors multi-select for quick removal).
- Spec goal: keep this component pure/dumb; context hook will feed it.

---

## 🧱 Filters Context + URL Sync

- Introduce `FiltersContext` (React context + provider) housing the canonical filter state.
- Provide a `useFilters()` hook that:
  - Reads from context.
  - Uses `nuqs` to sync query string (`?search=…&actor=…&genres=1,2` etc.) with replace-state navigation.
  - Exposes typed setters that:
    - Update internal state.
    - Update URL (debounced for search and actor fields).
- `movie-search.tsx` will consume context values rather than local `useState`.
- `SearchModalOrDrawer` wraps provider to ensure both modal content and navbar trigger access shared state.

---

## 🪟 Responsive Modal & Drawer (shadcn)

| Platform | Component | Library | Description |
|-----------|------------|----------|--------------|
| **Desktop** | `Dialog` | shadcn/ui | Detached modal, backdrop blur |
| **Mobile** | `Drawer` | shadcn/ui | Full-height bottom sheet |

Both render:
- `FilterBar`
- `ActorSearchInput`
- (future) `DurationSlider`
- `MovieSearch` results grid (same TanStack Query instance; provider ensures cached data shared)
- `useIsMobile` hook (already available in the project) drives which shell to render.

---

## ✅ Acceptance Criteria

| Category | Criteria |
|-----------|-----------|
| 🔁 Unified backend | `searchMoviesFiltered` handles search, genres, actor |
| 🧠 Strong typing | No `any` used anywhere |
| 🌐 URL sync | All filters reflected in URL via `nuqs` and rehydrated on load |
| 🪟 Responsive | Drawer on mobile, Dialog on desktop (keyboard + focus traps intact) |
| 👤 Actor search | Integrated via TMDB people API |
| 🎨 UI reuse | FilterBar + MovieCard unchanged (only prop source changes) |
| ⚡ Performance | TanStack Query caching, `keepPreviousData`, and user-facing debounce preserved |
| 🧩 Ready for duration | Easy extension once schema supports it (context + action accept fields) |
| 🧪 QA hooks | Story or Chromatic entry for modal/drawer states (optional), manual test notes captured |

---

## 🚀 Result

A **clean, unified, and responsive movie search system** that:
- Feels modern and cohesive across all devices
- Uses one backend action and shared filter context
- Keeps existing filter UI while unlocking actor + URL search
- Is ready for future enhancements like duration, rating thresholds, or release year filtering.

---
