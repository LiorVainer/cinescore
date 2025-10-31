# Starzi

Starzi is a multilingual movie discovery and alert platform focused on Israeli cinema. It combines data from TMDB and OMDb, enriches it with localized content, and helps movie lovers decide what to watch, track upcoming releases, and receive alerts when titles that meet their criteria hit local theaters.

## Features

- Unified movie search that supports title and original title queries, actor filters, genre multi-select, sortable results, and a responsive modal or drawer experience backed by a single server action.
- Localized browsing with Hebrew and English translations, regionalized metadata, and poster or backdrop assets synchronized from TMDB.
- Better Auth powered accounts with Prisma sessions, OAuth credentials, verification flows, and user preference storage.
- Notification engine that tracks follows, triggers, and user defined rating thresholds with email delivery today and room for SMS or push expansion.
- Data access layer wrapping Prisma models for movies, casts, genres, trailers, and translations to keep React Query consumers lean and type safe.
- Cron friendly architecture prepared for scheduled rating checks, subscription digests, and ingestion workers.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components, Server Actions), React 19, TypeScript.
- **UI & UX:** Tailwind CSS 4, shadcn/ui with Radix primitives, Motion and Framer Motion animations, lucide-react icons.
- **State & Data:** TanStack React Query v5, nuqs for URL synced filters, next-intl for translations.
- **Auth & Security:** Better Auth with Prisma adapter, HttpOnly session cookies, verification tokens.
- **Database & ORM:** PostgreSQL with Prisma schema modeling movies, translations, genres, cast, notifications, follows, triggers, and user preferences.
- **Integrations:** TMDB (`tmdb-ts`) and OMDb for content, SendGrid or Resend for email, Messaggio or BulkGate ready SMS hooks, Upstash QStash and Vercel Cron for background jobs.
- **Tooling:** pnpm workspace, ESLint and Prettier, Swagger TypeScript API generation, Husky and lint-staged, Sentry monitoring hooks.

## Architecture Highlights

- App Router first layout with shared search state delivered through a `FiltersContext` that keeps modal or drawer UI, query params, and server actions in sync.
- Dedicated Data Access Layer (`dal/`) wrapping Prisma queries to enforce consistent projections and pagination.
- Prisma schema with enums for languages, notification methods, follow types, movie status, and trigger conditions to keep business logic explicit.
- Notification pipeline modeled via `Follow`, `Trigger`, and `Notification` tables plus `UserPreferences` to control delivery methods.
- Swagger driven clients (`generate:imdbapi-client`, `generate:omdbapi-client`) that keep external API calls typed and discoverable.

## Project Structure

```
src/
  app/              # Next.js routes, server actions, layouts, and API handlers
  components/       # Domain-oriented UI (search, media cards, navigation, auth)
  lib/              # Data helpers, React Query utilities, API clients, hooks
  types/            # Shared TypeScript contracts
  constants/        # Sort values, enums, configuration helpers
dal/                # Prisma-backed data access layer
prisma/             # Schema, migrations, seed scripts
swagger/            # OpenAPI specs powering generated clients
messages/           # next-intl locale bundles
public/             # Static assets
spec/               # Product and feature specifications
```

## Getting Started

1. **Prerequisites**
    - Node.js 20+
    - pnpm (`npm install -g pnpm`)
    - PostgreSQL database (local or cloud)
2. **Environment**
    - Duplicate `.env.example` to `.env`.
    - Supply credentials for `DATABASE_URL`, TMDB (`TMDB_API_KEY`), OMDb (`OMDB_API_KEY`), Better Auth secrets, email or SMS providers, and any Vercel or Upstash tokens referenced in the specs.
3. **Install dependencies**
    ```sh
    pnpm install
    ```
4. **Generate Prisma client and run migrations**
    ```sh
    pnpm prisma:dev
    ```
5. **Seed optional data**
    ```sh
    pnpm prisma:seed
    ```
6. **Start the dev server**
    ```sh
    pnpm dev
    ```
    The app runs on `http://localhost:3000` with Turbopack hot reloading.

## Useful Scripts

- `pnpm dev` - Launch the Next.js dev server with Turbopack.
- `pnpm build` - Run `prisma generate` and build the production bundle.
- `pnpm start` - Serve the built app.
- `pnpm lint` / `pnpm eslint` - Run lint checks (App Router preset or raw ESLint).
- `pnpm prisma:dev|deploy|reset|seed` - Manage database migrations and seeds.
- `pnpm generate:imdbapi-client` / `pnpm generate:omdbapi-client` - Regenerate typed API clients from Swagger specs.

## Database Schema Highlights

The Prisma schema (`prisma/schema.prisma`) models the full movie domain:

- `Movie`, `MovieTranslation`, `Genre`, `GenreTranslation`, `Actor`, `ActorTranslation`, and `Cast` tables capture localized metadata, credits, and TMDB or IMDb identifiers.
- `User`, `Session`, `Account`, and `Verification` are wired for Better Auth, while `UserPreferences`, `Follow`, `Trigger`, and `Notification` power subscriptions and alerts.
- Enums (`Language`, `FollowType`, `TriggerConditionType`, `NotifyMethod`, `MovieStatus`) keep validation centralized and future extension predictable.

## Roadmap & Current Focus

The active roadmap (see `spec/current-spec.md`) targets:

- Subscription management UI, notification preferences, and cron powered rating checks.
- Email notification flows with future SMS or push expansion.
- Advanced search filters (duration, year range) layered on the unified search experience.
- Testing, documentation, and observability improvements (Playwright, rate limiting, Sentry, analytics).

## Contributing & Quality

- Follow the existing linting and formatting rules (`pnpm eslint:fix`) and maintain 4 space indentation, 120 character width, and single quotes.
- Document manual testing in PRs until automated coverage is in place; React Testing Library or Playwright are the preferred tooling for new tests.
- Keep secrets out of version control; store credentials in `.env` and the shared password manager, and document schema changes with matching Prisma migrations.

Happy hacking!
