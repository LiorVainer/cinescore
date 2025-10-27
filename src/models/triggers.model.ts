// src/models/triggers.model.ts
import type { TriggerCondition } from '@/types/trigger';

export type TriggerConditionDTO = TriggerCondition;

export type TriggerDTO = {
    id: string;
    name: string;
    conditions: TriggerConditionDTO[];
    createdAt: Date;
    updatedAt: Date;
};
