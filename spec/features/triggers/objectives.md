# Hero Background — Objectives

Created: 2025-10-16

Purpose

Provide a clear set of objectives and acceptance criteria for the `hero_background_server_component.md` implementation so the engineering work is scoped, testable, and trackable.

Primary objective

- Implement a performant server-rendered landing page (`app/[locale]/page.tsx`) with a cinematic 3D poster-wall background populated from the database and locale-aware copy.

Success criteria

- Server page is a Next.js server async component and uses `next-intl` server APIs (`getTranslations`, `setRequestLocale`) to render localized copy.
- Poster wall is rendered server-side from poster URLs fetched from the DB using a DAL function (no client-side DB calls for initial render).
- Interactive elements (CTAs) are client components (`'use client'`) and use the project's i18n-aware `Link` component.
- Images render without runtime errors (Next.js image config includes allowed domains or appropriate loader configured).
- Basic accessibility checks pass for hero CTAs (keyboard focusable, semantic markup, color contrast).
- Minimal CSS animations (tilt + light sweep) are present in `src/app/globals.css` and do not block content rendering.

Objectives (concrete tasks)

1. Server-side: create `app/[locale]/page.tsx` that:
   - Validates/sets locale with `setRequestLocale(locale)`.
   - Uses `getTranslations('landing')` to load copy.
   - Calls a DAL function `getBestRatedMoviePosters(limit)` or `getHeroBackgroundPosters(limit)` to obtain poster URLs.
   - Renders `HeroBackground3D` and `HeroActions`.

2. DAL: implement `dal/movies/getBestRatedMoviePosters.ts` (or add method to `MoviesDAL`) which:
   - Queries the `movie` + `movie_translation` tables using Prisma to get poster URLs of the highest-rated movies (order by `rating` desc, `votes` desc as tie-breaker), limiting results.
   - Returns an array of poster URL strings.

3. Shared/UI components (under `src/app/components/landing`):
   - `HeroBackground3D.tsx` — stateless server/shared component (renders posters using `next/image`).
   - `HeroActions.tsx` — client component for CTAs, uses `Link` from `@/i18/navigation` and `useTranslations('landing')`.

4. CSS: add tiltMove and lightSweep keyframes and `.light-sweep` utility into `src/app/globals.css`.

5. Translations: add `landing` namespace keys to `messages/en.json` and `messages/he.json`:
   - `title`, `subtitle`, `cta_now_playing`, `cta_subscribe`.

6. Environment: confirm `next.config.js` allows external poster domains or add a loader.

7. Tests & QA:
   - Visual smoke test in dev.
   - Accessibility quick check (tab order, ARIA where appropriate, color contrast).

Constraints / Assumptions

- Poster URLs in `movie_translation.posterUrl` are absolute URLs or are hosted on allowed domains configured in `next.config.js`.
- The DAL already contains `MoviesDAL.getFullyPopulatedMovies(...)` and helper functions; reuse them where possible.
- `@/i18/navigation` Link exists or will be referenced; if it does not, fallback to `next/link`.

Owners & contacts

- Implementation owner: (you / the repo maintainer)
- Reviewer: (frontend lead)

Timeline / Milestones

- Day 0: add DAL helper and server page, wire components and translations.
- Day 1: CSS polish and accessibility fixes.
- Day 2: visual QA and minor performance tuning (image loading strategy).

Acceptance tests (manual)

- Visit `/en` (or configured default locale) and confirm the hero page loads server-side and renders poster wall.
- Confirm CTAs navigate to `/now-playing` and `/auth/sign-in` using the i18n-aware Link.
- Run Lighthouse to check performance and accessibility baseline.

Next steps (practical)

- Implement `getBestRatedMoviePosters` in DAL (or extend `MoviesDAL`) — I can implement it now and wire it into `app/[locale]/page.tsx` if you'd like.
- Add the page file and wire translations.


