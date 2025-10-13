// src/models/follows.model.ts
import {FollowType} from '@prisma/client';

export type FollowDTO = {
    id: string;
    type: FollowType;
    value: string;
    createdAt: Date;
    updatedAt: Date;
};

