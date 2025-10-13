'use server';

import { revalidateTag } from 'next/cache';
import { ActionResult, getDal, getUserSession } from '@/lib/server-utils';
import { InterestDTO } from '@/models/interests.model';
import { CACHE_TAGS } from '@/constants/cache-tags.const';
import { formatConditionInputLabel } from '@/constants/interest-labels.const';
import type { InterestConditionInput } from '@/types/interests';

// ============================================================================
// INTEREST ACTIONS
// ============================================================================

export async function createInterest(data: {
    name?: string;
    conditions: InterestConditionInput[];
}): Promise<ActionResult<InterestDTO>> {
    try {
        const user = await getUserSession();
        const dal = getDal();

        // Validate at least one condition exists
        if (!data.conditions || data.conditions.length === 0) {
            return {
                success: false,
                error: 'At least one condition is required',
            };
        }

        // Auto-generate name if not provided
        let name = data.name;
        if (!name) {
            const parts: string[] = data.conditions
                .map((condition) => formatConditionInputLabel(condition))
                .filter((part): part is string => part !== null);

            name = parts.length > 0 ? parts.join(' + ') : 'Custom Interest';
        }

        const interest = await dal.interests.create({
            userId: user.id,
            name,
            conditions: data.conditions,
        });

        // Revalidate cache
        revalidateTag(CACHE_TAGS.USER_INTERESTS);

        return {
            success: true,
            data: {
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
        };
    } catch (error) {
        console.error('createInterest error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create interest',
        };
    }
}

export async function updateInterest(
    interestId: string,
    data: {
        name?: string;
        conditions?: InterestConditionInput[];
    },
): Promise<ActionResult<InterestDTO>> {
    try {
        const user = await getUserSession();
        const dal = getDal();

        // Verify ownership
        const interests = await dal.interests.findByUser(user.id);
        const interest = interests.find((i) => i.id === interestId);

        if (!interest) {
            return {
                success: false,
                error: 'Interest not found or you do not have permission to update it',
            };
        }

        // Validate conditions if provided
        if (data.conditions && data.conditions.length === 0) {
            return {
                success: false,
                error: 'At least one condition is required',
            };
        }

        const updatedInterest = await dal.interests.update(interestId, data);

        // Revalidate cache
        revalidateTag(CACHE_TAGS.USER_INTERESTS);

        return {
            success: true,
            data: {
                id: updatedInterest.id,
                name: updatedInterest.name,
                conditions: updatedInterest.conditions.map((c) => ({
                    id: c.id,
                    interestId: c.interestId,
                    type: c.type,
                    stringValue: c.stringValue,
                    numericValue: c.numericValue,
                })) as InterestDTO['conditions'],
                createdAt: updatedInterest.createdAt,
                updatedAt: updatedInterest.updatedAt,
            },
        };
    } catch (error) {
        console.error('updateInterest error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update interest',
        };
    }
}

export async function deleteInterest(interestId: string): Promise<ActionResult<{ deletedInterestId: string }>> {
    try {
        const user = await getUserSession();
        const dal = getDal();

        // Verify ownership
        const interests = await dal.interests.findByUser(user.id);
        const interest = interests.find((i) => i.id === interestId);

        if (!interest) {
            return {
                success: false,
                error: 'Interest not found or you do not have permission to delete it',
            };
        }

        await dal.interests.delete(interestId);

        // Revalidate cache
        revalidateTag(CACHE_TAGS.USER_INTERESTS);

        return {
            success: true,
            data: { deletedInterestId: interestId },
        };
    } catch (error) {
        console.error('deleteInterest error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete interest',
        };
    }
}

export async function getUserInterests(): Promise<ActionResult<InterestDTO[]>> {
    try {
        const user = await getUserSession();
        const dal = getDal();
        const interests = await dal.interests.findByUser(user.id);

        return {
            success: true,
            data: interests.map((i) => ({
                id: i.id,
                name: i.name,
                conditions: i.conditions.map((c) => ({
                    id: c.id,
                    interestId: c.interestId,
                    type: c.type,
                    stringValue: c.stringValue,
                    numericValue: c.numericValue,
                })) as InterestDTO['conditions'],
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            })),
        };
    } catch (error) {
        console.error('getUserInterests error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch interests',
        };
    }
}
