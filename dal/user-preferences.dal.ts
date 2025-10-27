// dal/user-preferences.dal.ts
import { PrismaClient, NotifyMethod } from '@prisma/client';

export class UserPreferencesDAL {
    constructor(private prisma: PrismaClient) {}

    async upsert(userId: string, notifyBy: NotifyMethod[]) {
        return this.prisma.userPreferences.upsert({
            where: { userId },
            create: { userId, notifyBy },
            update: { notifyBy },
        });
    }

    async findByUserId(userId: string) {
        return this.prisma.userPreferences.findUnique({
            where: { userId },
        });
    }

    /**
     * Get user preferences with EMAIL fallback if not found.
     * Used by cron job to ensure all users have notification preferences.
     */
    async getWithFallback(userId: string): Promise<{ notifyBy: NotifyMethod[] }> {
        const prefs = await this.findByUserId(userId);
        return prefs || { notifyBy: [NotifyMethod.EMAIL] };
    }
}
