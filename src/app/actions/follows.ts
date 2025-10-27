'use server';

import { FollowType, TriggerConditionType } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { getDal, getUserSession, ActionResult } from '@/lib/server-utils';
import { FollowDTO } from '@/models/follows.model';
import { TriggerDTO } from '@/models/triggers.model';
import { CACHE_TAGS } from '@/constants/cache-tags.const';

// ============================================================================
// FOLLOW ACTIONS
// ============================================================================

export async function createFollow(data: {
    type: FollowType;
    value: string;
}): Promise<ActionResult<{ follow: FollowDTO; trigger: TriggerDTO }>> {
    try {
        const user = await getUserSession();
        const dal = getDal();

        // Check if Follow already exists
        const existingFollow = await dal.follows.findUnique(user.id, data.type, data.value);
        if (existingFollow) {
            return {
                success: false,
                error: 'You are already following this ' + (data.type === FollowType.ACTOR ? 'actor' : 'genre'),
            };
        }

        // Create Follow record
        const follow = await dal.follows.create(user.id, data.type, data.value);

        // Auto-create Trigger with single condition
        const triggerName = data.type === FollowType.ACTOR ? `${data.value} movies` : `${data.value} movies`;

        const trigger = await dal.triggers.create({
            userId: user.id,
            name: triggerName,
            conditions: [
                {
                    type: data.type === FollowType.ACTOR ? TriggerConditionType.ACTOR : TriggerConditionType.GENRE,
                    stringValue: data.value,
                    numericValue: null,
                },
            ],
        });

        // Revalidate cache
        revalidateTag(CACHE_TAGS.USER_FOLLOWS);
        revalidateTag(CACHE_TAGS.USER_TRIGGERS);

        return {
            success: true,
            data: {
                follow: {
                    id: follow.id,
                    type: follow.type,
                    value: follow.value,
                    createdAt: follow.createdAt,
                    updatedAt: follow.updatedAt,
                },
                trigger: {
                    id: trigger.id,
                    name: trigger.name,
                    conditions: trigger.conditions.map((c) => ({
                        id: c.id,
                        triggerId: c.triggerId,
                        type: c.type,
                        stringValue: c.stringValue,
                        numericValue: c.numericValue,
                    })) as TriggerDTO['conditions'],
                    createdAt: trigger.createdAt,
                    updatedAt: trigger.updatedAt,
                },
            },
        };
    } catch (error) {
        console.error('createFollow error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create follow',
        };
    }
}

export async function deleteFollow(followId: string): Promise<ActionResult<{ deletedFollowId: string }>> {
    try {
        const user = await getUserSession();
        const dal = getDal();

        // Get the follow to verify ownership and get its details
        const follows = await dal.follows.findByUser(user.id);
        const follow = follows.find((f) => f.id === followId);

        if (!follow) {
            return {
                success: false,
                error: 'Follow not found or you do not have permission to delete it',
            };
        }

        // Find and delete the corresponding simple Trigger (one with single condition matching this follow)
        const triggers = await dal.triggers.findByUser(user.id);

        for (const trigger of triggers) {
            // Check if this is a simple trigger with one condition matching the follow
            if (trigger.conditions.length === 1) {
                const condition = trigger.conditions[0];
                const matchesFollow =
                    ((follow.type === FollowType.ACTOR && condition.type === TriggerConditionType.ACTOR) ||
                        (follow.type === FollowType.GENRE && condition.type === TriggerConditionType.GENRE)) &&
                    condition.stringValue === follow.value;

                if (matchesFollow) {
                    await dal.triggers.delete(trigger.id);
                    break;
                }
            }
        }

        // Delete the Follow record
        await dal.follows.delete(followId);

        // Revalidate cache
        revalidateTag(CACHE_TAGS.USER_FOLLOWS);
        revalidateTag(CACHE_TAGS.USER_TRIGGERS);

        return {
            success: true,
            data: { deletedFollowId: followId },
        };
    } catch (error) {
        console.error('deleteFollow error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete follow',
        };
    }
}

export async function getUserFollows(): Promise<ActionResult<FollowDTO[]>> {
    try {
        const user = await getUserSession();
        const dal = getDal();
        const follows = await dal.follows.findByUser(user.id);

        return {
            success: true,
            data: follows.map((f) => ({
                id: f.id,
                type: f.type,
                value: f.value,
                createdAt: f.createdAt,
                updatedAt: f.updatedAt,
            })),
        };
    } catch (error) {
        console.error('getUserFollows error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch follows',
        };
    }
}
