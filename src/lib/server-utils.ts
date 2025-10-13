// src/lib/server-utils.ts
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createDALs } from '@/dal';
import { PrismaService } from '@/lib/prismaService';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

// Lazy DAL initialization
let dalInstance: ReturnType<typeof createDALs> | null = null;

export function getDal() {
    if (!dalInstance) {
        const prismaService = new PrismaService(prisma);
        dalInstance = createDALs(prismaService);
    }
    return dalInstance;
}

// Type-safe action result
export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

// Auth helper with redirect option
export async function getUserSession(redirectOnFail = false) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
        if (redirectOnFail) {
            redirect('/auth/signin');
        }
        throw new Error('Unauthorized');
    }

    return session.user;
}
