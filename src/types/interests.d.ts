// src/types/interests.d.ts
import {InterestType} from '@prisma/client';

/**
 * Discriminated union types for InterestCondition based on InterestType
 * Provides better type safety than Prisma's default nullable fields
 */

export type ActorCondition = {
    id: string;
    interestId: string;
    type: InterestType.ACTOR;
    stringValue: string;
    numericValue: null;
};

export type GenreCondition = {
    id: string;
    interestId: string;
    type: InterestType.GENRE;
    stringValue: string;
    numericValue: null;
};

export type RatingCondition = {
    id: string;
    interestId: string;
    type: InterestType.RATING;
    stringValue: null;
    numericValue: number;
};

export type DurationMinCondition = {
    id: string;
    interestId: string;
    type: InterestType.DURATION_MIN;
    stringValue: null;
    numericValue: number;
};

export type DurationMaxCondition = {
    id: string;
    interestId: string;
    type: InterestType.DURATION_MAX;
    stringValue: null;
    numericValue: number;
};

/**
 * Discriminated union of all possible condition types
 */
export type InterestCondition =
    | ActorCondition
    | GenreCondition
    | RatingCondition
    | DurationMinCondition
    | DurationMaxCondition;

/**
 * Input type for creating/updating conditions (allows partial values)
 */
export type InterestConditionInput =
    | { type: InterestType.ACTOR; stringValue: string; numericValue?: null }
    | { type: InterestType.GENRE; stringValue: string; numericValue?: null }
    | { type: InterestType.RATING; stringValue?: null; numericValue: number }
    | { type: InterestType.DURATION_MIN; stringValue?: null; numericValue: number }
    | { type: InterestType.DURATION_MAX; stringValue?: null; numericValue: number };

/**
 * Module augmentation to override Prisma's generated types
 * This replaces Prisma's InterestCondition type globally with our discriminated union
 */
declare module '@prisma/client' {
    // Override the InterestCondition type
    export interface InterestCondition extends Omit<import('@prisma/client').InterestCondition, 'type' | 'stringValue' | 'numericValue'> {
        type: InterestType;
        stringValue: string | null;
        numericValue: number | null;
    }

    // Override Interest to use the properly typed conditions
    export interface Interest {
        id: string;
        userId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }

    // Enhance Prisma namespace with custom types
    namespace Prisma {
        // Override InterestGetPayload to use our discriminated union
        interface InterestGetPayload<T extends {
            include?: { conditions?: boolean } | null
        }> {
            id: string;
            userId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            conditions: T extends { include: { conditions: true } }
                ? import('@/types/interests').InterestCondition[]
                : never;
        }
    }
}
