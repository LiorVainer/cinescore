// src/models/user-preferences.model.ts
import {NotifyMethod} from '@prisma/client';

export type UserPreferencesDTO = {
    notifyBy: NotifyMethod[];
};

