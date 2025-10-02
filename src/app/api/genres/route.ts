import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const items = await prisma.genre.findMany({ orderBy: { name: 'asc' } });
        return NextResponse.json({ ok: true, items });
    } catch (e) {
        console.error('/api/genres error', e);
        return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 });
    }
}
