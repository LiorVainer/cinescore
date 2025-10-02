'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export type SubscriptionInput = {
    threshold: number;
    genre?: string | null;
    notifyBy: 'email' | 'sms';
};

export async function addSubscription(input: SubscriptionInput) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error('Unauthorized');

    const sub = await prisma.subscription.create({
        data: {
            userId: session.user.id,
            threshold: input.threshold,
            genre: input.genre ?? undefined,
            notifyBy: [input.notifyBy],
        },
    });
    return sub;
}

export async function getSubscriptions() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error('Unauthorized');

    return prisma.subscription.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    });
}

export async function removeSubscription(id: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error('Unauthorized');

    const sub = await prisma.subscription.findUnique({ where: { id } });
    if (!sub || sub.userId !== session.user.id) throw new Error('Not found');

    await prisma.subscription.delete({ where: { id } });
    return { ok: true };
}
