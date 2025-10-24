import { NextResponse } from 'next/server';

import { logger } from '@/lib/sentry/logger';
import { withSentrySpan } from '@/lib/sentry/withSpan';
import { withSentryTransaction } from '@/lib/sentry/withTransaction';

import { refreshNowPlayingCatalog } from '../../../../../prisma/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const cronLogger = logger.scope('api:cron:catalog-refresh');
    const authHeader = request.headers.get('authorization');
    const fromVercel = authHeader !== `Bearer ${process.env.CRON_SECRET}`

    if (!fromVercel) {
        cronLogger.warn('Missing CRON_SECRET header or invalid value');
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        return await withSentryTransaction(
            'cron:catalog-refresh',
            async () => {
                await withSentrySpan('job.step', 'Execute catalog refresh script', async () => {
                    cronLogger.info('Starting DB now playing movies catalog refresh');
                    await refreshNowPlayingCatalog({ wrapWithTransaction: false });
                    cronLogger.info('Prisma catalog refresh completed');
                });

                return NextResponse.json({ ok: true });
            },
            { op: 'cron' },
        );
    } catch (error) {
        cronLogger.error('Catalog refresh cron failed', error as Error);
        return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 });
    }
}
