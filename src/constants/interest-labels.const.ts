// src/constants/interest-labels.const.ts
import {InterestType} from '@prisma/client';
import type {InterestCondition} from '@/types/interests';

/**
 * Type-safe value extractor that knows which field to access based on InterestType
 */
type ConditionValue<T extends InterestType> =
    T extends typeof InterestType.ACTOR | typeof InterestType.GENRE
        ? string
        : T extends typeof InterestType.RATING | typeof InterestType.DURATION_MIN | typeof InterestType.DURATION_MAX
            ? number
            : never;

/**
 * Type-safe label formatter that enforces correct value type for each InterestType
 */
type LabelFormatter = {
    [K in InterestType]: (value: ConditionValue<K>) => string;
};

/**
 * Label formatters for each InterestType
 * TypeScript enforces that each formatter receives the correct value type:
 * - ACTOR/GENRE receive string
 * - RATING/DURATION_MIN/DURATION_MAX receive number
 */
export const INTEREST_TYPE_LABELS: LabelFormatter = {
    [InterestType.ACTOR]: (value) => value,
    [InterestType.GENRE]: (value) => value,
    [InterestType.RATING]: (value) => `${value}+ rating`,
    [InterestType.DURATION_MIN]: (value) => `${value}min+`,
    [InterestType.DURATION_MAX]: (value) => `max ${value}min`,
} as const;

/**
 * Type-safe helper to get the value from a condition based on its type
 * This function knows to extract stringValue for ACTOR/GENRE and numericValue for others
 */
export function getConditionValue<T extends InterestType>(
    condition: Extract<InterestCondition, { type: T }>
): ConditionValue<T> {
    switch (condition.type) {
        case InterestType.ACTOR:
        case InterestType.GENRE:
            return condition.stringValue as ConditionValue<T>;
        case InterestType.RATING:
        case InterestType.DURATION_MIN:
        case InterestType.DURATION_MAX:
            return condition.numericValue as ConditionValue<T>;
        default:
            // TypeScript ensures this is unreachable
            const _exhaustive: never = condition;
            throw new Error(`Unknown condition type: ${_exhaustive}`);
    }
}

/**
 * Type-safe helper to format a condition's label
 * Automatically extracts the correct value and formats it using direct record indexing
 */
export function formatConditionLabel(condition: InterestCondition): string {
    // TypeScript's discriminated union + type narrowing makes this work
    const formatter = INTEREST_TYPE_LABELS[condition.type];
    const value = (condition.stringValue ?? condition.numericValue) as Parameters<typeof formatter>[0];
    return formatter(value);
}
