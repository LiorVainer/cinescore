# 🧩 Sentry Logger & Tracing Utilities (Extended Integration Plan)

> For projects using Next.js + Prisma + Vercel.  
> Assumes Sentry base setup (`@sentry/nextjs`, DSN, config files) is already complete.

This document adds:
- Advanced Sentry logger utilities
- Transaction + span wrappers
- Integration with your `prisma/seed.ts` logic for Vercel Cron Job
- Step-by-step AI agent plan

---

## ⚙️ Prerequisites

- `@sentry/nextjs` already installed  
- `sentry.server.config.ts` and `sentry.client.config.ts` exist  
- Vercel Cron enabled (via `vercel.json` or dashboard)

---

## 📂 Add Logger and Utilities

### `/lib/logger.ts`

```ts
import * as Sentry from "@sentry/nextjs";

type LogLevel = "debug" | "info" | "warn" | "error";
const isProd = process.env.NODE_ENV === "production";

function baseLog(
  level: LogLevel,
  message: string,
  scope?: string,
  extra?: Record<string, any> | Error
) {
  const prefix = scope ? `[${scope}] ` : "";

  // Add breadcrumb for context
  Sentry.addBreadcrumb({
    category: scope || "app",
    message,
    level,
    data: typeof extra === "object" ? extra : undefined,
  });

  if (!isProd) {
    const emoji =
      level === "error"
        ? "❌"
        : level === "warn"
        ? "⚠️"
        : level === "info"
        ? "ℹ️"
        : "🔍";
    console[level](`${emoji} ${prefix}${message}`, extra || "");
  } else {
    if (level === "error" && extra instanceof Error) {
      Sentry.captureException(extra, { level, tags: { scope } });
    } else {
      Sentry.captureMessage(prefix + message, {
        level,
        tags: scope ? { scope } : undefined,
        extra: typeof extra === "object" ? extra : undefined,
      });
    }
  }
}

export const logger = {
  debug: (msg: string, extra?: Record<string, any>) => baseLog("debug", msg, undefined, extra),
  info: (msg: string, extra?: Record<string, any>) => baseLog("info", msg, undefined, extra),
  warn: (msg: string, extra?: Record<string, any>) => baseLog("warn", msg, undefined, extra),
  error: (msg: string, extra?: Record<string, any> | Error) =>
    baseLog("error", msg, undefined, extra),

  // Scoped logger for grouped operations
  scope(scope: string) {
    return {
      debug: (msg: string, extra?: Record<string, any>) => baseLog("debug", msg, scope, extra),
      info: (msg: string, extra?: Record<string, any>) => baseLog("info", msg, scope, extra),
      warn: (msg: string, extra?: Record<string, any>) => baseLog("warn", msg, scope, extra),
      error: (msg: string, extra?: Record<string, any> | Error) =>
        baseLog("error", msg, scope, extra),
    };
  },
};
```

---

### `/lib/withSentryTransaction.ts`

```ts
import * as Sentry from "@sentry/nextjs";
import { logger } from "./logger";

export async function withSentryTransaction<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T | undefined> {
  const transaction = Sentry.startTransaction({
    name,
    op: "function",
    tags: { scope: name },
  });

  const scopedLogger = logger.scope(name);
  scopedLogger.info("Starting transaction");

  try {
    const result = await fn();
    scopedLogger.info("Transaction completed successfully");
    transaction.setStatus("ok");
    return result;
  } catch (err: any) {
    scopedLogger.error("Transaction failed", err);
    transaction.setStatus("internal_error");
    Sentry.captureException(err, { tags: { scope: name } });
    throw err;
  } finally {
    transaction.finish();
  }
}
```

---

### `/lib/withSentrySpan.ts`

```ts
import * as Sentry from "@sentry/nextjs";

export async function withSentrySpan<T>(
  op: string,
  description: string,
  fn: () => Promise<T>,
): Promise<T> {
  const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();
  const span = transaction?.startChild({ op, description });
  const start = Date.now();

  try {
    const result = await fn();
    span?.setStatus("ok");
    return result;
  } catch (err) {
    span?.setStatus("internal_error");
    Sentry.captureException(err, { tags: { op, description } });
    throw err;
  } finally {
    span?.finish();
    const duration = Date.now() - start;
    Sentry.addBreadcrumb({
      category: `span:${op}`,
      message: `${description} took ${duration}ms`,
      level: "info",
    });
  }
}
```

---

## 🧩 Integrate Prisma Seed as a CRON Job

### `/app/api/cron/daily-refresh/route.ts`

```ts
import { withSentryTransaction } from "@/lib/withSentryTransaction";
import { withSentrySpan } from "@/lib/withSentrySpan";
import { logger } from "@/lib/logger";
import { main as seed } from "@/prisma/seed"; // assume export { main } in seed.ts

export async function GET() {
  return withSentryTransaction("cron:seed", async () => {
    const cronLogger = logger.scope("cron:seed");

    await withSentrySpan("db", "Run Prisma seed script", async () => {
      cronLogger.info("Starting Prisma seeding...");
      await seed();
      cronLogger.info("✅ Prisma seed completed successfully");
    });

    return Response.json({ ok: true });
  });
}
```

---

### `/prisma/seed.ts`

```ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function main() {
  await prisma.user.createMany({
    data: [{ email: "admin@example.com" }, { email: "test@example.com" }],
  });
}

if (require.main === module) {
  main()
    .then(() => {
      console.log("Seed completed");
      process.exit(0);
    })
    .catch((e) => {
      console.error("Seed failed", e);
      process.exit(1);
    });
}
```

---

### `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/now-playing-refresh",
      "schedule": "0 4 * * *"
    }
  ]
}
```

---

## 🤖 AI Agent Implementation Plan

1. Detect and wrap `prisma/seed.ts` with `withSentryTransaction` + `withSentrySpan`.
2. Add `/api/cron/daily-refresh/route.ts` endpoint for Vercel CRON.
3. Add `/lib/logger.ts`, `/lib/withSentryTransaction.ts`, `/lib/withSentrySpan.ts`.
4. Update `vercel.json` with CRON entry.
5. Test locally → confirm trace appears in Sentry dashboard.
6. Extend the same pattern for all `app/api/cron/**` routes.

---

## ✅ Deliverables

| Component | Purpose |
|------------|----------|
| `/lib/logger.ts` | Scoped logging + breadcrumbs |
| `/lib/withSentryTransaction.ts` | Wrap entire async job |
| `/lib/withSentrySpan.ts` | Measure step durations |
| `/api/cron/daily-refresh` | CRON endpoint wrapping Prisma catalog refresh |
| `vercel.json` | Schedules seeding job |

---

**Status:** ✅ Ready for integration  
**Estimated time:** 20–30 minutes  
**Owner:** Developer or AI agent maintaining backend reliability
