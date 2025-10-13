'use server';

import { FollowType, InterestType } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { getDal, getUserSession, ActionResult } from '@/lib/server-utils';
import { FollowDTO } from '@/models/follows.model';
import { InterestDTO } from '@/models/interests.model';
import { CACHE_TAGS } from '@/constants/cache-tags.const';

// ============================================================================
// FOLLOW ACTIONS
// ============================================================================

export async function createFollow(data: {
    type: FollowType;
    value: string;
}): Promise<ActionResult<{ follow: FollowDTO; interest: InterestDTO }>> {
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

        // Auto-create Interest with single condition
        const interestName = data.type === FollowType.ACTOR ? `${data.value} movies` : `${data.value} movies`;

        const interest = await dal.interests.create({
            userId: user.id,
            name: interestName,
            conditions: [
                {
                    type: data.type === FollowType.ACTOR ? InterestType.ACTOR : InterestType.GENRE,
                    stringValue: data.value,
                    numericValue: null,
                },
            ],
        });

        // Revalidate cache
        revalidateTag(CACHE_TAGS.USER_FOLLOWS);
        revalidateTag(CACHE_TAGS.USER_INTERESTS);

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
                interest: {
                    id: interest.id,
                    name: interest.name,
                    conditions: interest.conditions.map((c) => ({
                        id: c.id,
                        interestId: c.interestId,
                        type: c.type,
                        stringValue: c.stringValue,
                        numericValue: c.numericValue,
                    })) as InterestDTO['conditions'],
                    createdAt: interest.createdAt,
                    updatedAt: interest.updatedAt,
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

        // Find and delete the corresponding simple Interest (one with single condition matching this follow)
        const interests = await dal.interests.findByUser(user.id);

        for (const interest of interests) {
            // Check if this is a simple interest with one condition matching the follow
            if (interest.conditions.length === 1) {
                const condition = interest.conditions[0];
                const matchesFollow =
                    ((follow.type === FollowType.ACTOR && condition.type === InterestType.ACTOR) ||
                        (follow.type === FollowType.GENRE && condition.type === InterestType.GENRE)) &&
                    condition.stringValue === follow.value;

                if (matchesFollow) {
                    await dal.interests.delete(interest.id);
                    break;
                }
            }
        }

        // Delete the Follow record
        await dal.follows.delete(followId);

        // Revalidate cache
        revalidateTag(CACHE_TAGS.USER_FOLLOWS);
        revalidateTag(CACHE_TAGS.USER_INTERESTS);

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
