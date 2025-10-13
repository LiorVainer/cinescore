import { NextResponse } from 'next/server';
import { seedNowPlayingMovies } from '../../../../../prisma/seed';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const fromVercel = req.headers.get('x-vercel-cron');

    if (!fromVercel) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const nowPlayingAmount = seedNowPlayingMovies();

        return NextResponse.json({ ok: true, count: nowPlayingAmount });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 });
    }
}
