# Hero Background — Progress

Last updated: 2025-10-16

Summary: track implementation status for the 3D hero background landing-page feature described in `hero_background_server_component.md`.

## Completed

- [x] DAL helper: `dal/movies/getHeroBackgroundPosters.ts` — created (fetches poster URLs via existing DAL or prisma)
- [x] Server/shared component: `src/app/components/landing/HeroBackground3D.tsx` — created (renders stateless poster wall)
- [x] Client component: `src/app/components/landing/HeroActions.tsx` — created (interactive CTA buttons; uses i18n Link)
- [x] Translation keys: added `landing` strings to `messages/en.json` and `messages/he.json` (title, subtitle, CTA keys)

## In progress / To do

- [ ] Server route: `app/[locale]/page.tsx` — implement as a server async component using `getTranslations` and `setRequestLocale`
- [ ] DAL: implement (or adapt) `getBestRatedMoviePosters()` to fetch poster URLs of top-rated movies by Prisma
- [ ] CSS: add tilt + light-sweep keyframes and `.light-sweep` utility to `src/app/globals.css`
- [ ] Ensure `next.config.js` allows external poster domains or use an image loader for remote poster URLs
- [ ] Accessibility review: contrast and keyboard focus for hero CTAs
- [ ] Tests: add a small server-component integration test (if test framework available)
- [ ] Revalidation / caching strategy: decide on ISR / cache-control for posters

## Notes & blockers

- `next/image` will require proper external domains or a loader — verify `next.config.js` to avoid runtime image errors
- Some earlier edits were created then cancelled in the session; validate file paths in the repo before continuing

## Next actions

1. Implement `app/[locale]/page.tsx` server component using `getHeroBackgroundPosters()` and `getTranslations`.
2. Add Prisma DAL function to return poster URLs for top-rated movies (service in `dal/movies.dal.ts` or a small helper in `dal/movies/getBestRatedMoviePosters.ts`).
3. Wire CSS animations and test visually in dev server.
4. Iterate on accessibility and performance tuning.

