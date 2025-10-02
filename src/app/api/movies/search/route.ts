import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const search = (searchParams.get('search') || '').trim();
        const sort = (searchParams.get('sort') || 'rating:desc') as string;
        const genresParam = searchParams.get('genres') || '';
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '24', 10)));

        const selectedGenres = genresParam
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)
            .map((v) => Number(v))
            .filter((n) => !Number.isNaN(n));

        const where: any = {};

        if (search.length > 0) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { originalTitle: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (selectedGenres.length > 0) {
            where.genres = {
                some: { id: { in: selectedGenres } },
            };
        }

        const [field, direction] = (sort || 'rating:desc').split(':') as [
            'rating' | 'votes' | 'releaseDate',
            'asc' | 'desc',
        ];
        const orderBy = { [field]: direction } as Record<string, 'asc' | 'desc'>;

        const skip = (page - 1) * pageSize;

        const [items, total] = await Promise.all([
            prisma.movie.findMany({
                where,
                include: { genres: true, trailers: true },
                orderBy,
                skip,
                take: pageSize,
            }),
            prisma.movie.count({ where }),
        ]);

        return NextResponse.json({
            ok: true,
            items,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize) || 1,
        });
    } catch (e) {
        console.error('/api/movies/search error', e);
        return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 });
    }
}
