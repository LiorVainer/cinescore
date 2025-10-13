// src/constants/interest-labels.const.ts
import { InterestType } from '@prisma/client';
import type { InterestCondition, InterestConditionInput } from '@/types/interests';

/**
 * Label formatters for each InterestType
 * Maps each interest type to a function that formats its display value
 */
export const INTEREST_TYPE_LABELS = {
    [InterestType.ACTOR]: (value: string) => value,
    [InterestType.GENRE]: (value: string) => value,
    [InterestType.RATING]: (value: number) => `${value}+ rating`,
    [InterestType.DURATION_MIN]: (value: number) => `${value}min+`,
    [InterestType.DURATION_MAX]: (value: number) => `max ${value}min`,
} as const;

/**
 * Type-safe helper to format a condition's label
 * Automatically extracts the correct value and formats it
 */
export function formatConditionLabel(condition: InterestCondition): string {
    switch (condition.type) {
        case InterestType.ACTOR:
            return INTEREST_TYPE_LABELS[InterestType.ACTOR](condition.stringValue);
        case InterestType.GENRE:
            return INTEREST_TYPE_LABELS[InterestType.GENRE](condition.stringValue);
        case InterestType.RATING:
            return INTEREST_TYPE_LABELS[InterestType.RATING](condition.numericValue);
        case InterestType.DURATION_MIN:
            return INTEREST_TYPE_LABELS[InterestType.DURATION_MIN](condition.numericValue);
        case InterestType.DURATION_MAX:
            return INTEREST_TYPE_LABELS[InterestType.DURATION_MAX](condition.numericValue);
    }
}

/**
 * Format a condition label in a type-safe way
 */
export function formatConditionInputLabel(condition: InterestConditionInput): string | null {
    switch (condition.type) {
        case InterestType.ACTOR:
            return condition.stringValue ? INTEREST_TYPE_LABELS[InterestType.ACTOR](condition.stringValue) : null;
        case InterestType.GENRE:
            return condition.stringValue ? INTEREST_TYPE_LABELS[InterestType.GENRE](condition.stringValue) : null;
        case InterestType.RATING:
            return condition.numericValue != null
                ? INTEREST_TYPE_LABELS[InterestType.RATING](condition.numericValue)
                : null;
        case InterestType.DURATION_MIN:
            return condition.numericValue != null
                ? INTEREST_TYPE_LABELS[InterestType.DURATION_MIN](condition.numericValue)
                : null;
        case InterestType.DURATION_MAX:
            return condition.numericValue != null
                ? INTEREST_TYPE_LABELS[InterestType.DURATION_MAX](condition.numericValue)
                : null;
        default:
            return null;
    }
}
