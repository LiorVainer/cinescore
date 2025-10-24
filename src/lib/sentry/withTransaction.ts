import { startSpan } from '@sentry/core';
import * as Sentry from '@sentry/nextjs';

import { logger } from './logger';

type TransactionOptions = {
    op?: string;
};

export async function withSentryTransaction<T>(
    name: string,
    fn: () => Promise<T>,
    options: TransactionOptions = {},
): Promise<T> {
    const op = options.op ?? 'task';

    return startSpan(
        {
            name,
            op,
            forceTransaction: true,
            attributes: {
                'transaction.scope': name,
            },
        },
        async (span) => {
            const scopedLogger = logger.scope(name);
            scopedLogger.info(`Starting transaction${op ? ` (${op})` : ''}`);

            try {
                const result = await fn();
                scopedLogger.info('Transaction completed successfully');
                span.setStatus({message: 'ok', code: 0});
                return result;
            } catch (error) {
                span.setStatus({message: 'internal_error', code: 2});
                scopedLogger.error('Transaction failed', error as Error);
                Sentry.captureException(error, {
                    tags: {
                        scope: name,
                        op,
                    },
                });
                throw error;
            }
        },
    );
}
