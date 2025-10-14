'use server';

import { NotifyMethod } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { getDal, getUserSession, ActionResult } from '@/lib/server-utils';
import { UserPreferencesDTO } from '@/models/user-preferences.model';
import { CACHE_TAGS } from '@/constants/cache-tags.const';

// ============================================================================
// USER PREFERENCES ACTIONS
// ============================================================================

export async function updateUserPreferences(data: {
    notifyBy: NotifyMethod[];
}): Promise<ActionResult<UserPreferencesDTO>> {
    try {
        const user = await getUserSession();
        const dal = getDal();

        const preferences = await dal.userPreferences.upsert(user.id, data.notifyBy);

        // Revalidate cache
        revalidateTag(CACHE_TAGS.USER_PREFERENCES);

        return {
            success: true,
            data: {
                notifyBy: preferences.notifyBy,
            },
        };
    } catch (error) {
        console.error('updateUserPreferences error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update preferences',
        };
    }
}

export async function getUserPreferences(): Promise<ActionResult<UserPreferencesDTO>> {
    try {
        const user = await getUserSession();
        const dal = getDal();

        // Use getWithFallback to ensure EMAIL default if not set
        const preferences = await dal.userPreferences.getWithFallback(user.id);

        return {
            success: true,
            data: {
                notifyBy: preferences.notifyBy,
            },
        };
    } catch (error) {
        console.error('getUserPreferences error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch preferences',
        };
    }
}
