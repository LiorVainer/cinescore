# React Query Setup Guide

This directory contains the React Query (TanStack Query v5) configuration for the CineScore application, optimized for
Next.js 15 App Router with SSR and streaming support.

## 📁 Folder Structure

```
src/lib/query/
├── query-client.ts          # QueryClient configuration
├── index.ts                 # Central exports
├── README.md                # This file
│
├── follow/                  # Follow entity queries
│   ├── query-keys.ts        # Query key factory
│   ├── query-options.ts     # Reusable query options
│   ├── hooks.ts             # React hooks (useQuery, useMutation)
│   └── index.ts             # Module exports
│
├── interest/                # Interest entity queries
│   ├── query-keys.ts
│   ├── query-options.ts
│   ├── hooks.ts
│   └── index.ts
│
├── user-preferences/        # User preferences queries
│   ├── query-keys.ts
│   ├── query-options.ts
│   ├── hooks.ts
│   └── index.ts
│
└── movie/                   # Movie entity queries
    ├── query-keys.ts
    ├── query-options.ts
    ├── hooks.ts
    └── index.ts
```

## 📋 File Organization Pattern

Each entity follows the same structure:

### `query-keys.ts`

- Centralized query key definitions using factory pattern
- Ensures consistent and type-safe query keys
- Makes invalidation and cache management easier

### `query-options.ts`

- Reusable query configurations using `queryOptions` helper
- Directly calls server actions from `@/app/actions/`
- Used across useQuery, prefetchQuery, invalidateQueries, etc.
- Includes staleTime and enabled conditions

### `hooks.ts`

- Custom React hooks wrapping useQuery and useMutation
- Provides clean API for components
- Includes optimistic updates and cache invalidation
- Must be used in Client Components (marked with 'use client')

### `index.ts`

- Exports all functionality from the entity module
- Allows clean imports: `import { useUserFollows } from '@/lib/query/follow'`

## 🎯 Key Features

### `query-client.ts`

Creates and manages the QueryClient instance for both server and client environments.

**Configuration:**

- ✅ Separate QueryClient instances for server and browser
- ✅ Configured for streaming with pending query dehydration
- ✅ 60-second default staleTime to prevent immediate refetching on client
- ✅ Error handling compatible with Next.js dynamic page detection

## 🚀 Usage Patterns

### 1. Server Component with Prefetching

Use this pattern to prefetch data on the server and hydrate it on the client:

```tsx
// app/[locale]/follows/page.tsx
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { userFollowsOptions } from '@/lib/query/follow';
import { FollowsList } from '@/components/follows/FollowsList';
import { auth } from '@/lib/auth';

export default async function FollowsPage() {
  const session = await auth();
  const queryClient = getQueryClient();

  // Prefetch data on server (no need to await for streaming)
  queryClient.prefetchQuery(userFollowsOptions(session.user.id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FollowsList userId={session.user.id} />
    </HydrationBoundary>
  );
}
```

### 2. Client Component with useQuery

The client component consumes the prefetched data seamlessly:

```tsx
// components/follows/FollowsList.tsx
'use client';

import { useUserFollows } from '@/lib/query/follow';

export function FollowsList({ userId }: { userId: string }) {
  const { data, isLoading, error } = useUserFollows(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((follow) => (
        <li key={follow.id}>{follow.value}</li>
      ))}
    </ul>
  );
}
```

### 3. Mutations with Cache Invalidation

Use mutation hooks with automatic cache invalidation:

```tsx
'use client';

import { useCreateFollow } from '@/lib/query/follow';
import { FollowType } from '@prisma/client';

export function AddFollowButton({ userId, type, value }) {
  const { mutate, isPending } = useCreateFollow(userId);

  return (
    <button 
      onClick={() => mutate({ type: FollowType.ACTOR, value })}
      disabled={isPending}
    >
      {isPending ? 'Adding...' : 'Follow'}
    </button>
  );
}
```

### 4. Optimistic Updates

The hooks include optimistic updates built-in:

```tsx
'use client';

import { useDeleteFollow } from '@/lib/query/follow';

export function RemoveFollowButton({ userId, followId }) {
  const { mutate, isPending } = useDeleteFollow(userId);

  return (
    <button 
      onClick={() => mutate(followId)}
      disabled={isPending}
    >
      {isPending ? 'Removing...' : 'Unfollow'}
    </button>
  );
}
```

### 5. Multiple Prefetches in Parallel

Prefetch multiple queries simultaneously:

```tsx
// app/[locale]/interests/page.tsx
import { getQueryClient } from '@/lib/query';
import { userFollowsOptions } from '@/lib/query/follow';
import { userInterestsOptions } from '@/lib/query/trigger';
import { userPreferencesOptions } from '@/lib/query/user-preferences';

export default async function InterestsPage() {
  const session = await auth();
  const queryClient = getQueryClient();

  // Prefetch multiple queries in parallel (no await)
  queryClient.prefetchQuery(userFollowsOptions(session.user.id));
  queryClient.prefetchQuery(userInterestsOptions(session.user.id));
  queryClient.prefetchQuery(userPreferencesOptions(session.user.id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InterestsContent userId={session.user.id} />
    </HydrationBoundary>
  );
}
```

### 6. Using Query Keys for Invalidation

Access query keys for manual invalidation:

```tsx
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { followKeys } from '@/lib/query/follow';

export function RefreshButton({ userId }) {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: followKeys.byUser(userId),
    });
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}
```

## 📦 Available Hooks

### Follow Entity

```typescript
import { 
  useUserFollows,           // Get all follows
  useUserFollowsByType,     // Get follows by type (ACTOR/GENRE)
  useCreateFollow,          // Create new follow
  useDeleteFollow,          // Delete follow (with optimistic update)
} from '@/lib/query/follow';
```

### Interest Entity

```typescript
import { 
  useUserInterests,         // Get all interests
  useUserInterestsByConditionType,  // Filter by condition type
  useCreateInterest,        // Create new trigger
  useUpdateInterest,        // Update existing trigger
  useDeleteInterest,        // Delete trigger (with optimistic update)
} from '@/lib/query/trigger';
```

### User Preferences Entity

```typescript
import { 
  useUserPreferences,       // Get user preferences
  useUpdateUserPreferences, // Update preferences (with optimistic update)
} from '@/lib/query/user-preferences';
```

### Movie Entity

```typescript
import { 
  useMoviesList,            // Get paginated movies
  useMovieDetail,           // Get single movie
  useMoviesByGenre,         // Filter by genre
  useMoviesByActor,         // Filter by actor
  useMovieSearch,           // Search movies
  useTrendingMovies,        // Get trending
  useRecentMovies,          // Get recent movies
} from '@/lib/query/movie';

// NOTE: Movie hooks are placeholders until server actions are implemented
```

## 🎯 Best Practices

### ✅ DO:

- Use the provided hooks in Client Components
- Import from entity modules: `@/lib/query/follow`
- Use `queryOptions` for server-side prefetching
- Let mutations handle cache invalidation automatically
- Set appropriate `staleTime` based on data volatility
- Use optimistic updates for better UX

### ❌ DON'T:

- Don't create QueryClient instances manually in components
- Don't use `useState` for QueryClient initialization
- Don't await prefetchQuery if you want streaming support
- Don't manually manage cache invalidation (hooks do it for you)
- Don't forget `'use client'` directive when using hooks

## 🔧 Implementation Details

### Query Keys Pattern

```typescript
// query-keys.ts
export const followKeys = {
  all: ['follows'] as const,
  byUser: (userId: string) => [...followKeys.all, 'user', userId] as const,
  byType: (userId: string, type: string) => 
    [...followKeys.all, 'user', userId, 'type', type] as const,
};
```

### Query Options Pattern

```typescript
// query-options.ts
import { queryOptions } from '@tanstack/react-query';
import { getUserFollows } from '@/app/actions/follows';

export const userFollowsOptions = (userId: string) =>
  queryOptions({
    queryKey: followKeys.byUser(userId),
    queryFn: async () => {
      const result = await getUserFollows();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
```

### Hooks Pattern

```typescript
// hooks.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useUserFollows(userId: string) {
  return useQuery(userFollowsOptions(userId));
}

export function useCreateFollow(userId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const result = await createFollow(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: followKeys.byUser(userId),
      });
    },
  });
}
```

## 🐛 Troubleshooting

### Data not hydrating on client

- Ensure `HydrationBoundary` wraps your client components
- Check that queryKey matches between server prefetch and client useQuery
- Verify `dehydrate(queryClient)` is passed to HydrationBoundary state

### Refetching immediately on page load

- Increase `staleTime` in query options
- Check if query is invalidated elsewhere in the app

### TypeScript errors with query keys

- Use `as const` assertion on queryKey arrays
- Import types from entity modules

### Mutation not updating UI

- Check that hooks are using correct `userId` for invalidation
- Ensure mutation is awaited or using callbacks properly
- Verify optimistic update logic in onMutate

## 📚 Additional Resources

- [TanStack Query v5 Docs](https://tanstack.com/query/v5/docs/framework/react/overview)
- [Advanced SSR Guide](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr)
- [Next.js App Router Example](https://tanstack.com/query/v5/docs/framework/react/examples/nextjs-app-prefetching)
