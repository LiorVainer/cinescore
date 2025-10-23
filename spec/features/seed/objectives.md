# Sentry Logger Extension Objectives

- Establish reusable logging utilities under `lib/sentry` that enrich Sentry telemetry with scoped breadcrumbs and severity-aware handling for both local development and production.
- Wrap long-running asynchronous jobs (e.g., catalog refresh routines or cron handlers) with Sentry transactions and spans to capture timing, status, and errors by reusing helpers housed in `lib/sentry`.
- Expose a cron-friendly API entry point that triggers the Prisma catalog refresh workflow under Sentry instrumentation for Vercel scheduled invocations.
- Ensure deployment metadata (`vercel.json`) stays aligned with the cron endpoint and that refresh scripts remain idempotent and traceable.
