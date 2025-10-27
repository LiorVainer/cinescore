// src/types/trigger.d.ts
import type { TriggerConditionType } from '@prisma/client';

/**
 * Discriminated union types for TriggerCondition based on TriggerConditionType
 * Provides better type safety than Prisma's default nullable fields
 */

export type ActorCondition = {
    id: string;
    triggerId: string;
    type: typeof TriggerConditionType.ACTOR;
    stringValue: string;
    numericValue: null;
};

export type GenreCondition = {
    id: string;
    triggerId: string;
    type: typeof TriggerConditionType.GENRE;
    stringValue: string;
    numericValue: null;
};

export type RatingCondition = {
    id: string;
    triggerId: string;
    type: typeof TriggerConditionType.RATING;
    stringValue: null;
    numericValue: number;
};

export type DurationMinCondition = {
    id: string;
    triggerId: string;
    type: typeof TriggerConditionType.DURATION_MIN;
    stringValue: null;
    numericValue: number;
};

export type DurationMaxCondition = {
    id: string;
    triggerId: string;
    type: typeof TriggerConditionType.DURATION_MAX;
    stringValue: null;
    numericValue: number;
};

/**
 * Discriminated union of all possible condition types
 */
export type TriggerCondition =
    | ActorCondition
    | GenreCondition
    | RatingCondition
    | DurationMinCondition
    | DurationMaxCondition;

/**
 * Input type for creating/updating conditions (allows partial values)
 */
export type TriggerConditionInput =
    | { type: typeof TriggerConditionType.ACTOR; stringValue: string; numericValue?: null }
    | { type: typeof TriggerConditionType.GENRE; stringValue: string; numericValue?: null }
    | { type: typeof TriggerConditionType.RATING; stringValue?: null; numericValue: number }
    | { type: typeof TriggerConditionType.DURATION_MIN; stringValue?: null; numericValue: number }
    | { type: typeof TriggerConditionType.DURATION_MAX; stringValue?: null; numericValue: number };

/**
 * Module augmentation to override Prisma's generated types
 * This replaces Prisma's TriggerCondition type globally with our discriminated union
 */
declare module '@prisma/client' {
    // Override the TriggerCondition type
    export interface TriggerCondition
        extends Omit<import('@prisma/client').TriggerCondition, 'type' | 'stringValue' | 'numericValue'> {
        type: TriggerConditionType;
        stringValue: string | null;
        numericValue: number | null;
    }

    // Override Trigger to use the properly typed conditions
    export interface Trigger {
        id: string;
        userId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }

    // Enhance Prisma namespace with custom types
    namespace Prisma {
        // Override TriggerGetPayload to use our discriminated union
        interface TriggerGetPayload<
            T extends {
                include?: { conditions?: boolean } | null;
            },
        > {
            id: string;
            userId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            conditions: T extends { include: { conditions: true } }
                ? import('@/types/trigger').TriggerCondition[]
                : never;
        }
    }
}
