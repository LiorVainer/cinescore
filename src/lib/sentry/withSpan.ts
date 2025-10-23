import { startSpan } from '@sentry/core';
import * as Sentry from '@sentry/nextjs';

import { logger } from './logger';

type SpanOptions = {
    data?: Record<string, unknown>;
    tags?: Record<string, string>;
};

export async function withSentrySpan<T>(
    op: string,
    description: string,
    fn: () => Promise<T>,
    options: SpanOptions = {},
): Promise<T> {
    const scopedLogger = logger.scope(`span:${op}`);
    const startedAt = Date.now();

    return startSpan(
        {
            name: description,
            op,
        },
        async (span) => {
            scopedLogger.debug(`Starting span: ${description}`);

            if (options.tags) {
                Object.entries(options.tags).forEach(([key, value]) => {
                    span.setAttribute(`tag.${key}`, value);
                });
            }

            if (options.data) {
                Object.entries(options.data).forEach(([key, value]) => {
                    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                        span.setAttribute(`data.${key}`, value);
                    }
                });
            }

            try {
                const result = await fn();
                span.setStatus({ code: 0, message: "ok" });
                const durationMs = Date.now() - startedAt;
                scopedLogger.info(`Span succeeded: ${description}`, { durationMs });
                return result;
            } catch (error) {
                span.setStatus({ code: 2, message: "internal_error" });
                scopedLogger.error(`Span failed: ${description}`, error as Error);
                Sentry.captureException(error, { tags: { op, description } });
                throw error;
            } finally {
                const durationMs = Date.now() - startedAt;
                Sentry.addBreadcrumb({
                    category: `span:${op}`,
                    message: `${description} took ${durationMs}ms`,
                    level: "info",
                });
            }
        },
    );
}
