import { TriggerConditionType } from '@prisma/client';
import type { TriggerCondition, TriggerConditionInput } from '@/types/trigger';

/**
 * Label formatters for each TriggerConditionType
 * Maps each trigger type to a function that formats its display value
 */
export const TRIGGER_TYPE_LABELS = {
    [TriggerConditionType.ACTOR]: (value: string) => value,
    [TriggerConditionType.GENRE]: (value: string) => value,
    [TriggerConditionType.RATING]: (value: number) => `${value}+ rating`,
    [TriggerConditionType.DURATION_MIN]: (value: number) => `${value}min+`,
    [TriggerConditionType.DURATION_MAX]: (value: number) => `max ${value}min`,
} as const;

/**
 * Type-safe helper to format a condition's label
 * Automatically extracts the correct value and formats it
 */
export function formatConditionLabel(condition: TriggerCondition): string {
    switch (condition.type) {
        case TriggerConditionType.ACTOR:
            return TRIGGER_TYPE_LABELS[TriggerConditionType.ACTOR](condition.stringValue);
        case TriggerConditionType.GENRE:
            return TRIGGER_TYPE_LABELS[TriggerConditionType.GENRE](condition.stringValue);
        case TriggerConditionType.RATING:
            return TRIGGER_TYPE_LABELS[TriggerConditionType.RATING](condition.numericValue);
        case TriggerConditionType.DURATION_MIN:
            return TRIGGER_TYPE_LABELS[TriggerConditionType.DURATION_MIN](condition.numericValue);
        case TriggerConditionType.DURATION_MAX:
            return TRIGGER_TYPE_LABELS[TriggerConditionType.DURATION_MAX](condition.numericValue);
    }
}

/**
 * Format a condition label in a type-safe way
 */
export function formatConditionInputLabel(condition: TriggerConditionInput): string | null {
    switch (condition.type) {
        case TriggerConditionType.ACTOR:
            return condition.stringValue
                ? TRIGGER_TYPE_LABELS[TriggerConditionType.ACTOR](condition.stringValue)
                : null;
        case TriggerConditionType.GENRE:
            return condition.stringValue
                ? TRIGGER_TYPE_LABELS[TriggerConditionType.GENRE](condition.stringValue)
                : null;
        case TriggerConditionType.RATING:
            return condition.numericValue != null
                ? TRIGGER_TYPE_LABELS[TriggerConditionType.RATING](condition.numericValue)
                : null;
        case TriggerConditionType.DURATION_MIN:
            return condition.numericValue != null
                ? TRIGGER_TYPE_LABELS[TriggerConditionType.DURATION_MIN](condition.numericValue)
                : null;
        case TriggerConditionType.DURATION_MAX:
            return condition.numericValue != null
                ? TRIGGER_TYPE_LABELS[TriggerConditionType.DURATION_MAX](condition.numericValue)
                : null;
        default:
            return null;
    }
}
