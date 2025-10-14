// src/models/interests.model.ts
import type { InterestCondition } from '@/types/interests';

export type InterestConditionDTO = InterestCondition;

export type InterestDTO = {
    id: string;
    name: string;
    conditions: InterestConditionDTO[];
    createdAt: Date;
    updatedAt: Date;
};
