# Server Actions Organization - Domain Split

## 📁 New File Structure

The server actions have been successfully split into domain-specific files with DTOs moved to the models folder.

### **Models (DTOs)**

```
src/models/
├── follows.model.ts           ✨ NEW - FollowDTO
├── interests.model.ts         ✨ NEW - InterestDTO, InterestConditionDTO
└── user-preferences.model.ts  ✨ NEW - UserPreferencesDTO
```

### **Server Actions**

```
src/app/actions/
├── subscriptions.ts           ♻️  UPDATED - Re-exports for backward compatibility
├── follows.ts                 ✨ NEW - Follow-related actions
├── interests.ts               ✨ NEW - Interest-related actions
└── user-preferences.ts        ✨ NEW - User preferences actions
```

---

## 📦 Models Overview

### **follows.model.ts**

```typescript
export type FollowDTO = {
    id: string;
    type: FollowType;
    value: string;
    createdAt: Date;
    updatedAt: Date;
};
```

### **interests.model.ts**

```typescript
export type InterestConditionDTO = {
    id: string;
    type: InterestType;
    stringValue: string | null;
    numericValue: number | null;
};

export type InterestDTO = {
    id: string;
    name: string;
    conditions: InterestConditionDTO[];
    createdAt: Date;
    updatedAt: Date;
};
```

### **user-preferences.model.ts**

```typescript
export type UserPreferencesDTO = {
    notifyBy: NotifyMethod[];
};
```

---

## 🔧 Server Actions by Domain

### **follows.ts**

Actions for managing user follows (actors/genres):

- `createFollow(data)` - Create a follow and auto-generate interest
- `deleteFollow(followId)` - Remove follow and associated interest
- `getUserFollows()` - Fetch all user's follows

### **interests.ts**

Actions for managing complex interests:

- `createInterest(data)` - Create interest with multiple conditions
- `updateInterest(interestId, data)` - Update interest
- `deleteInterest(interestId)` - Remove interest
- `getUserInterests()` - Fetch all user's interests

### **user-preferences.ts**

Actions for managing notification preferences:

- `updateUserPreferences(data)` - Update notification methods
- `getUserPreferences()` - Fetch user preferences with EMAIL fallback

---

## 🔄 Backward Compatibility

The `subscriptions.ts` file now serves as a **re-export hub** for backward compatibility:

```typescript
// Old import style (still works)
import { createFollow } from '@/app/actions/subscriptions';

// New import style (recommended)
import { createFollow } from '@/app/actions/follows';
```

This means existing code using the old imports will continue to work without any changes!

---

## ✅ Benefits

### **1. Better Organization**

- Each domain has its own file
- Easier to find and maintain specific functionality
- Follows Single Responsibility Principle

### **2. Type Safety**

- DTOs are centralized in models folder
- Can be imported by both server and client code
- Consistent types across the application

### **3. Scalability**

- Easy to add new actions to specific domains
- No more giant monolithic files
- Clear separation of concerns

### **4. Developer Experience**

- Better IDE autocomplete (smaller files to index)
- Faster navigation
- Clearer git diffs

---

## 📋 Import Examples

### **For Follows:**

```typescript
import {createFollow, getUserFollows} from '@/app/actions/follows';
import type {FollowDTO} from '@/models/follows.model';
```

### **For Interests:**

```typescript
import { createInterest, getUserInterests } from '@/app/actions/interests';
import type { InterestDTO, InterestConditionDTO } from '@/models/interests.model';
```

### **For User Preferences:**

```typescript
import { updateUserPreferences, getUserPreferences } from '@/app/actions/user-preferences';
import type { UserPreferencesDTO } from '@/models/user-preferences.model';
```

---

## 🎯 Migration Guide

### **No changes required!**

The `subscriptions.ts` file re-exports everything, so your existing code will continue to work.

### **Optional: Migrate to new imports**

When convenient, update your imports to use the specific domain files:

**Before:**

```typescript
import { createFollow, createInterest } from '@/app/actions/subscriptions';
```

**After:**

```typescript
import { createFollow } from '@/app/actions/follows';
import { createInterest } from '@/app/actions/interests';
```

---

## ✅ Summary

All server actions have been successfully split into domain-specific files:

- ✅ **3 new model files** with DTOs
- ✅ **3 new action files** by domain
- ✅ **Backward compatibility** maintained
- ✅ **No breaking changes** to existing code
- ✅ **Better organization** and maintainability

The refactoring is complete and production-ready! 🚀

