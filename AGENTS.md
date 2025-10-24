# Repository Guidelines

## Project Structure & Module Organization
Core application code lives under `src`, with route handlers and pages in `src/app`, reusable UI grouped by domain in `src/components`, data helpers in `src/lib`, and shared types/constants in `src/types` and `src/constants`. Server-side data access logic resides in `dal`. Database schema, migrations, and seed scripts are centralized in `prisma`, while API specifications powering client generation sit in `swagger`. Static assets live in `public`, and localized message bundles are under `messages`.

## Build, Test, and Development Commands
- `pnpm dev` – Launch the Next.js dev server with Turbopack.
- `pnpm build` – Run `prisma generate` then compile the production bundle.
- `pnpm start` – Serve the previously built app.
- `pnpm lint` / `pnpm eslint` – Execute the Next.js lint preset or raw ESLint across `src`.
- `pnpm prisma:dev | prisma:deploy | prisma:seed` – Manage migrations and seed data; pair with `.env` DB settings.
- `pnpm generate:imdbapi-client` / `pnpm generate:omdbapi-client` – Regenerate typed API clients after updating Swagger specs.

## Coding Style & Naming Conventions
Prettier (see `.prettierrc`) enforces 4-space indentation, 120-character width, semicolons, and single quotes (including JSX). Run `pnpm eslint:fix` to auto-correct lint issues. Component files generally export PascalCase components, while directories and multi-part utilities use kebab-case (for example, `movie-card-collapsed.tsx`). Favor TypeScript types from `src/types` or Prisma-generated types to keep domain models consistent.

## Testing Guidelines
Automated tests are not yet wired in; new features should ship with unit or integration coverage using the agreed tooling for the feature (React Testing Library or Playwright are preferred). Place test files alongside the module (`*.test.ts(x)`) or group end-to-end suites under a dedicated `tests` directory, and update `package.json` scripts when adding a new runner. Use the acceptance notes in `spec/features` to drive scenarios and record manual verification steps in PR descriptions until automation lands.

## Commit & Pull Request Guidelines
Follow the conventional commit pattern observed in history (`feat:`, `fix:`, `refactor:` + concise description). Reference issue IDs when applicable, describe the change, testing evidence, and any schema or environment updates in the PR body, and attach relevant screenshots for UI-facing work. Before opening a PR, run `pnpm lint`, applicable Prisma commands, and any new test scripts locally.

## Database & Secrets
Update `prisma/schema.prisma` for schema changes and include matching migration files in `prisma/migrations`. Seed data helpers sit in `prisma/seed.ts`; keep them idempotent so `pnpm prisma:reset` remains safe. Never commit real credentials—use `.env` (gitignored) and document new keys in the team password manager plus the PR notes.
