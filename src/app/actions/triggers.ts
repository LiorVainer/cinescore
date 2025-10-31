'use server';

import { revalidateTag } from 'next/cache';
import { ActionResult, getDal, getUserSession } from '@/lib/server-utils';
import { TriggerDTO } from '@/models/triggers.model';
import { CACHE_TAGS } from '@/constants/cache-tags.const';
import { formatConditionInputLabel } from '@/constants/trigger-labels.const';
import type { TriggerConditionInput } from '@/types/trigger';

// ============================================================================
// INTEREST ACTIONS
// ============================================================================

export async function createTrigger(data: {
    name?: string;
    conditions: TriggerConditionInput[];
}): Promise<ActionResult<TriggerDTO>> {
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

            name = parts.length > 0 ? parts.join(' + ') : 'Custom Trigger';
        }

        const trigger = await dal.triggers.create({
            userId: user.id,
            name,
            conditions: data.conditions,
        });

        // Revalidate cache
        revalidateTag(CACHE_TAGS.USER_TRIGGERS);

        return {
            success: true,
            data: {
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
        };
    } catch (error) {
        console.error('createTrigger error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create trigger',
        };
    }
}

export async function updateTrigger(
    triggerId: string,
    data: {
        name?: string;
        conditions?: TriggerConditionInput[];
    },
): Promise<ActionResult<TriggerDTO>> {
    try {
        const user = await getUserSession();
        const dal = getDal();

        // Verify ownership
        const triggers = await dal.triggers.findByUser(user.id);
        const trigger = triggers.find((i) => i.id === triggerId);

        if (!trigger) {
            return {
                success: false,
                error: 'Trigger not found or you do not have permission to update it',
            };
        }

        // Validate conditions if provided
        if (data.conditions && data.conditions.length === 0) {
            return {
                success: false,
                error: 'At least one condition is required',
            };
        }

        const updatedTrigger = await dal.triggers.update(triggerId, data);

        // Revalidate cache
        revalidateTag(CACHE_TAGS.USER_TRIGGERS);

        return {
            success: true,
            data: {
                id: updatedTrigger.id,
                name: updatedTrigger.name,
                conditions: updatedTrigger.conditions.map((c) => ({
                    id: c.id,
                    triggerId: c.triggerId,
                    type: c.type,
                    stringValue: c.stringValue,
                    numericValue: c.numericValue,
                })) as TriggerDTO['conditions'],
                createdAt: updatedTrigger.createdAt,
                updatedAt: updatedTrigger.updatedAt,
            },
        };
    } catch (error) {
        console.error('updateTrigger error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update trigger',
        };
    }
}

export async function deleteTrigger(triggerId: string): Promise<ActionResult<{ deletedTriggerId: string }>> {
    try {
        const user = await getUserSession();
        const dal = getDal();

        // Verify ownership
        const triggers = await dal.triggers.findByUser(user.id);
        const trigger = triggers.find((i) => i.id === triggerId);

        if (!trigger) {
            return {
                success: false,
                error: 'Trigger not found or you do not have permission to delete it',
            };
        }

        await dal.triggers.delete(triggerId);

        // Revalidate cache
        revalidateTag(CACHE_TAGS.USER_TRIGGERS);

        return {
            success: true,
            data: { deletedTriggerId: triggerId },
        };
    } catch (error) {
        console.error('deleteTrigger error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete trigger',
        };
    }
}

export async function getUserTriggers(): Promise<ActionResult<TriggerDTO[]>> {
    try {
        const user = await getUserSession();
        const dal = getDal();
        const triggers = await dal.triggers.findByUser(user.id);

        return {
            success: true,
            data: triggers.map((i) => ({
                id: i.id,
                name: i.name,
                conditions: i.conditions.map((c) => ({
                    id: c.id,
                    triggerId: c.triggerId,
                    type: c.type,
                    stringValue: c.stringValue,
                    numericValue: c.numericValue,
                })) as TriggerDTO['conditions'],
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            })),
        };
    } catch (error) {
        console.error('getUserTriggers error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch triggers',
        };
    }
}
