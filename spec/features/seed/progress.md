# Sentry Logger Extension Progress

## Plan
- [x] Create `/lib/sentry/logger.ts` with scoped breadcrumb-aware logging that switches behavior for dev vs. production.
- [x] Add `/lib/sentry/withTransaction.ts` to wrap async jobs with Sentry transactions and structured logging.
- [x] Add `/lib/sentry/withSpan.ts` to capture granular spans and durations nested under active transactions.
- [x] Update `prisma/seed.ts` to expose catalog refresh helpers, ensure idempotence, and invoke span-wrapped work when run via cron.
- [x] Implement `/app/api/cron/daily-refresh/route.ts` to run the catalog refresh task inside the transaction/span helpers.
- [x] Extend `vercel.json` with the scheduled `/api/cron/daily-refresh` job.
- [ ] Run local verification (lint/tests) and confirm Sentry traces before rolling pattern to additional cron routes.

## Notes
- Coordinate with platform team before enabling production cron to avoid duplicate catalog refresh jobs.
- Document any new environment variables or Sentry DSN changes in `AGENTS.md` once finalized.
- Sentry helpers leverage the v8+ `startSpan` API (`@sentry/core`) to stay aligned with current SDK guidance and avoid deprecated `startTransaction` calls.
