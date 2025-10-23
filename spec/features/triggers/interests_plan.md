# 🧩 Starzi Interests Implementation Plan (Extended)

This plan breaks the Subscriptions feature into small, focused tasks — now including **duration filtering** and a *
*dedicated actor detail page** with subscriptions integration.

---

## **📊 Current Implementation Status**

### ✅ Completed

- Component folder structure created: `src/components/subscriptions/`
- Placeholder files exist: `ActorFollowButton.tsx`, `AdjustThresholdModal.tsx`, `README.md`
- `/interests` route created at `src/app/[locale]/interests/page.tsx`
- Server actions file exists: `src/app/actions/subscriptions.ts` (empty)
- **Database schema created** - `Follow`, `Interest`, `InterestCondition`, and `UserPreferences` tables
- **DAL classes created** - `FollowDAL`, `InterestDAL`, `UserPreferencesDAL` in separate files

### ⚠️ Needs Attention

- All component files are empty (need implementation)
- Server actions file is empty (need implementation)
- Need to run Prisma migration to apply schema changes

---

## **🗄️ Final Database Architecture**

### Three-Table Design:

#### **0. Enums**

```prisma
enum FollowType {
  ACTOR
  GENRE
}

enum InterestType {
  ACTOR
  GENRE
  RATING
  DURATION_MIN
  DURATION_MAX
}

enum NotifyMethod {
  EMAIL
  // SMS
  // PUSH
}
```

---

#### **1. UserPreferences Table** (Global User Settings)

Stores user-level notification preferences that apply to ALL interests.

```prisma
model UserPreferences {
  id        String         @id @default(cuid())
  userId    String         @unique
  notifyBy  NotifyMethod[] @default([EMAIL])
  createdAt DateTime       @default(now())
  updatedAt DateTime       @default(now()) @updatedAt
  user      User           @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_preferences")
}
```

**Purpose:** Centralized notification preferences. When user changes email/SMS settings, it affects all their interests.

---

#### **2. Follow Table** (User Following)

Simplified table storing what users follow (actors/genres only).

```prisma
model Follow {
  id        String     @id @default(cuid())
  userId    String     
  type      FollowType 
  value     String     // actor name or genre name
  createdAt DateTime   @default(now())
  updatedAt DateTime   @default(now()) @updatedAt
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, type, value])
  @@index([type])
  @@index([userId])
  @@map("follow")
}
```

**Purpose:** User-facing follows. Simple tracking of actors/genres the user wants to follow. No filtering criteria
stored here.

---

#### **3. Interest Table** (Complex Subscription Logic)

Stores multi-condition interests with AND logic. Each Interest can have multiple type+value pairs.

```prisma
model Interest {
  id            String              @id @default(cuid())
  userId        String              
  name          String              // User-friendly name: "High-rated Action with Emma Stone"
  conditions    InterestCondition[] 
  notifications Notification[]      
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @default(now()) @updatedAt
  user          User                @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("interest")
}

model InterestCondition {
  id           String       @id @default(cuid())
  interestId   String       
  type         InterestType 
  stringValue  String?      // For ACTOR/GENRE: the name
  numericValue Float?       // For RATING/DURATION_MIN/DURATION_MAX: the threshold or duration value
  interest     Interest     @relation(fields: [interestId], references: [id], onDelete: Cascade)

  @@index([interestId])
  @@map("interest_condition")
}
```

**Purpose:**

- Stores complex interests with multiple AND conditions
- Example: "Notify me when Emma Stone AND Ryan Gosling AND Action genre AND rating > 8.0 AND duration 90-180 min"
- Each condition is self-contained with either stringValue (for ACTOR/GENRE) or numericValue (for RATING/DURATION)
- Cron job queries this table to match movies
- Notification preferences come from UserPreferences table

---

#### **4. Notification Table** (Logs)

Already exists - logs what was sent.

```prisma
model Notification {
  id         String    @id @default(cuid())
  userId     String    
  movieId    String    
  interestId String?   // Which interest triggered this notification
  sentAt     DateTime  @default(now())
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @default(now()) @updatedAt
  movie      Movie     @relation(fields: [movieId], references: [id], onDelete: Cascade)
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  interest   Interest? @relation(fields: [interestId], references: [id], onDelete: SetNull)

  @@unique([userId, movieId])
  @@index([sentAt])
  @@index([interestId])
  @@map("notification")
}
```

---

### **How It Works:**

```
USER ACTION                          →  DATABASE CHANGES
──────────────────────────────────────────────────────────────────────────
1. User clicks "Follow Emma Stone"
                                     →  Follow record created (type: ACTOR, value: "Emma Stone")
                                     →  Simple Interest auto-created with single condition:
                                         {type: ACTOR, stringValue: "Emma Stone", numericValue: null}

2. User clicks "Follow Action Genre"  
                                     →  Follow record created (type: GENRE, value: "Action")
                                     →  Simple Interest auto-created with single condition:
                                         {type: GENRE, stringValue: "Action", numericValue: null}

3. User creates complex interest:
   "Emma Stone + Action + 8.0+ + 90-180min"
                                     →  Interest created with:
                                         - name: "Emma Stone in Action movies"
                                         - conditions: [
                                             {type: ACTOR, stringValue: "Emma Stone", numericValue: null},
                                             {type: GENRE, stringValue: "Action", numericValue: null},
                                             {type: RATING, stringValue: null, numericValue: 8.0},
                                             {type: DURATION_MIN, stringValue: null, numericValue: 90},
                                             {type: DURATION_MAX, stringValue: null, numericValue: 180}
                                           ]
                                     →  No Follow records (this is a complex interest)

4. User updates notification preferences
                                     →  UserPreferences.notifyBy updated
                                     →  Affects ALL interests immediately

5. Cron job runs daily
                                     →  Queries Interest table with all conditions
                                     →  Joins with UserPreferences for notification method
                                     →  Matches new movies using AND logic across conditions
                                     →  For each condition:
                                         - ACTOR: checks if movie cast includes stringValue
                                         - GENRE: checks if movie genres include stringValue
                                         - RATING: checks if movie.rating >= numericValue
                                         - DURATION_MIN: checks if movie.duration >= numericValue
                                         - DURATION_MAX: checks if movie.duration <= numericValue
                                     →  Creates Notification records
                                     →  Sends emails/SMS based on UserPreferences
```

---

### 📋 Project Context

- **Authentication**: Better Auth v3.2.5 with email/password + Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **UI Library**: shadcn/ui components available (Dialog, Button, Slider, etc.)
- **Toast**: sonner likely available (check dependencies)
- **Routing**: Next.js 15 App Router with i18n support (en/he locales)
- **User Session**: `authClient.useSession()` hook available from Better Auth
- **Page Name**: "Interests" (user's movie interests and alerts)

---

## **Phase 1 – Setup (Groundwork)** ✅ COMPLETED

### **1. ✅ Create base structure** [COMPLETED]

- ✅ Created folder: `src/components/subscriptions/`
- ✅ Created placeholder files:
    - `ActorFollowButton.tsx` (empty - needs implementation)
    - `AdjustThresholdModal.tsx` (empty - needs implementation)
    - `README.md`
- ✅ Created `/interests` route at `src/app/[locale]/interests/page.tsx`
- ✅ Created Prisma schema for `Follow`, `Interest`, `InterestCondition`, and `UserPreferences` tables

**Next Action:** Run migration to apply schema changes to database

---

### **2. ✅ Create DAL classes** [COMPLETED]

Following the existing DAL pattern in `dal/` folder, created Data Access Layer classes for the new tables.

- ✅ Created `dal/follows.dal.ts` - `FollowDAL` class
- ✅ Created `dal/interests.dal.ts` - `InterestDAL` class
- ✅ Created `dal/user-preferences.dal.ts` - `UserPreferencesDAL` class
- ✅ Updated `dal/index.ts` to export new DALs

**File Structure:**

```typescript
// dal/interests.dal.ts
export class InterestDAL {
    async create(data: {
        userId: string;
        name: string;
        conditions: Array<{
            type: InterestType;
            stringValue?: string | null;
            numericValue?: number | null;
        }>;
    })

    async findByUser(userId: string)

    async update(id: string, data: { ... })

    async delete(id: string)

    async findAllWithConditions()
}
```

✅ Goal: DAL classes follow project conventions and provide clean data access layer.

---

### **3. ✅ Add server actions folder** [COMPLETED]

- ✅ File exists: `src/app/actions/subscriptions.ts` (empty)
- **Needs:** Implementation of:
    - `createFollow()` - Creates simple Follow + auto-creates basic Interest with single condition
    - `deleteFollow()` - Deletes Follow + removes corresponding Interest
    - `createInterest()` - Creates complex Interest with multiple conditions (advanced interests)
    - `updateInterest()` - Updates Interest name or conditions
    - `deleteInterest()` - Deletes Interest
    - `updateUserPreferences()` - Updates user's notification preferences (affects all interests)

**Note:** Project uses `src/app/actions/` pattern

---

## **Phase 2 – Server logic** ✅ COMPLETED

### **4. ✅ Implement `createFollow`** [COMPLETED]

- ✅ File location: `src/app/actions/subscriptions.ts`
- ✅ Handles: `type` (FollowType enum), `value` (actor/genre name)
- ✅ Logic implemented:
    1. Validates user session
    2. Checks if Follow already exists (prevents duplicates)
    3. Creates Follow record
    4. Auto-creates Interest with single InterestCondition using stringValue
    5. Returns { success, data, error }
- ✅ Prevents duplicates with `findUnique` check
- ✅ Uses Better Auth session validation

✅ Goal achieved: Creates Follow + Interest + InterestCondition rows in database.

---

### **5. ✅ Implement `deleteFollow`** [COMPLETED]

- ✅ Location: `src/app/actions/subscriptions.ts`
- ✅ Deletes Follow record
- ✅ Cascades: Also deletes corresponding simple Interest (with single condition)
- ✅ Validates user owns the follow before deletion

✅ Goal achieved: Removes rows from Follow, Interest, and InterestCondition tables.

---

### **6. ✅ Implement `createInterest`** [COMPLETED]

- ✅ Location: `src/app/actions/subscriptions.ts`
- ✅ Creates complex Interest with multiple conditions
- ✅ Validates at least one condition exists
- ✅ Auto-generates name if not provided (e.g., "Emma Stone + Action + 8.0+ rating + 90min+")

✅ Goal achieved: Users can create complex alerts with multiple AND conditions.

---

### **7. ✅ Implement `updateInterest`** [COMPLETED]

- ✅ Location: `src/app/actions/subscriptions.ts`
- ✅ Allows updating:
    - `name` - User-friendly name
    - `conditions` - Full replace of conditions array
- ✅ Validates user owns the interest
- ✅ Uses DAL's atomic transaction to replace conditions

✅ Goal achieved: Users can modify existing interests without recreating them.

---

### **8. ✅ Implement `deleteInterest`** [COMPLETED]

- ✅ Deletes Interest record
- ✅ Cascades automatically: InterestCondition records deleted via DB cascade
- ✅ Validates user owns the interest

✅ Goal achieved: Clean deletion of complex interests.

---

### **9. ✅ Implement `updateUserPreferences`** [COMPLETED]

- ✅ Location: `src/app/actions/subscriptions.ts`
- ✅ Uses UPSERT: Creates UserPreferences record if doesn't exist
- ✅ Updates UserPreferences.notifyBy field
- ✅ Affects ALL user's interests immediately
- ✅ Supports: `[EMAIL]`, `[SMS]`, `[EMAIL, SMS]`, or `[]` (disabled)
- ✅ Uses DAL: Calls `userPreferencesDAL.upsert(userId, notifyBy)`

✅ Goal achieved: Users can update notification preferences that apply to all interests.

---

### **Additional Actions Implemented:**

- ✅ `getUserFollows()` - Fetches all user's follows
- ✅ `getUserInterests()` - Fetches all user's interests with conditions
- ✅ `getUserPreferences()` - Fetches user's notification preferences with EMAIL fallback

---

## **Phase 2.5 – Actor Detail Page Implementation** [BEFORE PHASE 3]

### **Overview**

Before implementing Phase 3 (Follows, Interests, and Preferences pages), we need to create the Actor Detail Page where
users can follow/unfollow actors. This page demonstrates the `ActorFollowButton` component in action and provides a
foundation for the subscription system.

---

### **10. ⬜ Create Actor Detail Page** [PENDING - DO THIS FIRST]

**Page Route:** `src/app/[locale]/actors/[actorId]/page.tsx`

**Purpose:**

- Display comprehensive actor information (bio, filmography, photos)
- Implement Follow/Following button for the actor
- Show actor's movies with filtering and sorting
- Responsive design with shadcn/ui components

**Features:**

- Server-side data fetching with React Query prefetching
- Optimistic UI updates for follow/unfollow actions
- Loading states with Skeleton components
- Clean, modern design using shadcn/ui Card, Badge, Avatar, and Separator components

---

#### **A. Install Required shadcn/ui Components**

```bash
npx shadcn@latest add card badge avatar separator skeleton button
```

---

#### **B. Page Implementation**

**File:** `src/app/[locale]/actors/[actorId]/page.tsx`

```tsx
import {HydrationBoundary, dehydrate} from '@tanstack/react-query';
import {getQueryClient} from '@/lib/query';
import {notFound} from 'next/navigation';
import {ActorDetailContent} from '@/components/actor/ActorDetailContent';
import {auth} from '@/lib/auth';
import {userFollowsOptions} from '@/lib/query/follow';
import {db} from '@/lib/db'; // Your Prisma client instance
import type {Actor, Movie} from '@prisma/client';

// Server action to fetch actor details with movies
async function getActorById(actorId: string) {
    const actor = await db.actor.findUnique({
        where: {id: actorId},
        include: {
            translations: {
                where: {language: 'en_US'}, // Or use current locale
            },
            cast: {
                include: {
                    movie: {
                        include: {
                            translations: {
                                where: {language: 'en_US'},
                            },
                        },
                    },
                },
                orderBy: {
                    movie: {
                        releaseDate: 'desc',
                    },
                },
                take: 20,
            },
        },
    });

    if (!actor) return null;

    // Transform to a simpler structure for the component
    return {
        ...actor,
        name: actor.translations[0]?.name || 'Unknown Actor',
        biography: actor.translations[0]?.biography,
        movies: actor.cast.map(c => ({
            id: c.movie.id,
            title: c.movie.translations[0]?.title || 'Untitled',
            posterPath: c.movie.translations[0]?.posterUrl,
            releaseDate: c.movie.releaseDate,
            rating: c.movie.rating,
        })),
    };
}

interface ActorPageProps {
    params: {
        actorId: string;
        locale: string;
    };
}

export default async function ActorPage({params}: ActorPageProps) {
    const {actorId} = params;
    const session = await auth();
    const queryClient = getQueryClient();

    // Fetch actor data
    const actor = await getActorById(actorId);

    if (!actor) {
        notFound();
    }

    // Prefetch user follows if authenticated
    if (session?.user) {
        queryClient.prefetchQuery(userFollowsOptions(session.user.id));
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ActorDetailContent
                actor={actor}
                userId={session?.user?.id}
            />
        </HydrationBoundary>
    );
}

// Generate metadata for SEO
export async function generateMetadata({params}: ActorPageProps) {
    const actor = await getActorById(params.actorId);

    if (!actor) {
        return {
            title: 'Actor Not Found',
        };
    }

    return {
        title: `${actor.name} - CineScore`,
        description: actor.biography?.substring(0, 160) || `View ${actor.name}'s profile and filmography`,
    };
}
```

---

#### **C. Actor Detail Content Component**

**File:** `src/components/actor/ActorDetailContent.tsx`

```tsx
'use client';

import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Separator} from '@/components/ui/separator';
import {ActorFollowButton} from '@/components/follows/ActorFollowButton';
import {FollowType} from '@prisma/client';
import {CalendarDays, MapPin, Film} from 'lucide-react';
import Link from 'next/link';

interface Movie {
    id: string;
    title: string;
    posterPath?: string | null;
    releaseDate: Date | null;
    rating?: number | null;
}

interface Actor {
    id: string;
    name: string;
    biography?: string | null;
    birthday?: Date | null;
    placeOfBirth?: string | null;
    profileUrl?: string | null;
    movies?: Movie[];
}

interface ActorDetailContentProps {
    actor: Actor;
    userId?: string;
}

export function ActorDetailContent({actor, userId}: ActorDetailContentProps) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Actor Info */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="pt-6">
                            {/* Avatar */}
                            <div className="flex justify-center mb-6">
                                <Avatar className="h-48 w-48">
                                    <AvatarImage
                                        src={actor.profileUrl || undefined}
                                        alt={actor.name}
                                    />
                                    <AvatarFallback className="text-4xl">
                                        {actor.name
                                            .split(' ')
                                            .map(n => n[0])
                                            .join('')
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Name */}
                            <h1 className="text-3xl font-bold text-center mb-4">
                                {actor.name}
                            </h1>

                            {/* Follow Button */}
                            {userId && (
                                <div className="mb-6">
                                    <ActorFollowButton
                                        userId={userId}
                                        type={FollowType.ACTOR}
                                        value={actor.name}
                                    />
                                </div>
                            )}

                            <Separator className="my-4"/>

                            {/* Actor Details */}
                            <div className="space-y-3">
                                {actor.birthday && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                                        <span>
                      {new Date(actor.birthday).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                      })}
                    </span>
                                    </div>
                                )}

                                {actor.placeOfBirth && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground"/>
                                        <span>{actor.placeOfBirth}</span>
                                    </div>
                                )}

                                {actor.movies && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Film className="h-4 w-4 text-muted-foreground"/>
                                        <span>{actor.movies.length} Movies</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Biography & Filmography */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Biography */}
                    {actor.biography && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Biography</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {actor.biography}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Filmography */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Filmography</CardTitle>
                            <CardDescription>
                                {actor.movies?.length || 0} movies
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {actor.movies?.map((movie) => (
                                    <Link
                                        key={movie.id}
                                        href={`/movies/${movie.id}`}
                                        className="flex gap-4 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                                    >
                                        {/* Movie Poster */}
                                        <div className="flex-shrink-0">
                                            {movie.posterPath ? (
                                                <img
                                                    src={movie.posterPath}
                                                    alt={movie.title}
                                                    className="h-24 w-16 object-cover rounded"
                                                />
                                            ) : (
                                                <div
                                                    className="h-24 w-16 bg-muted rounded flex items-center justify-center">
                                                    <Film className="h-8 w-8 text-muted-foreground"/>
                                                </div>
                                            )}
                                        </div>

                                        {/* Movie Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">{movie.title}</h3>
                                            {movie.releaseDate && (
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(movie.releaseDate).getFullYear()}
                                                </p>
                                            )}
                                            {movie.rating && (
                                                <Badge variant="secondary" className="mt-2">
                                                    ⭐ {movie.rating.toFixed(1)}
                                                </Badge>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Empty State */}
                            {(!actor.movies || actor.movies.length === 0) && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Film className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                                    <p>No movies found for this actor.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
```

---

#### **D. Loading State Component**

**File:** `src/app/[locale]/actors/[actorId]/loading.tsx`

```tsx
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Separator} from '@/components/ui/separator';

export default function ActorLoading() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column Skeleton */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="pt-6">
                            {/* Avatar Skeleton */}
                            <div className="flex justify-center mb-6">
                                <Skeleton className="h-48 w-48 rounded-full"/>
                            </div>

                            {/* Name Skeleton */}
                            <Skeleton className="h-8 w-3/4 mx-auto mb-4"/>

                            {/* Follow Button Skeleton */}
                            <Skeleton className="h-10 w-full mb-6"/>

                            <Separator className="my-4"/>

                            {/* Details Skeleton */}
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-2/3"/>
                                <Skeleton className="h-4 w-1/2"/>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32"/>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-3/4"/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40"/>
                            <Skeleton className="h-4 w-24 mt-2"/>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex gap-4 p-3">
                                        <Skeleton className="h-24 w-16"/>
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-3/4"/>
                                            <Skeleton className="h-4 w-16"/>
                                            <Skeleton className="h-6 w-12"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
```

---

#### **E. Not Found Page**

**File:** `src/app/[locale]/actors/[actorId]/not-found.tsx`

```tsx
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {UserX} from 'lucide-react';

export default function ActorNotFound() {
    return (
        <div className="container mx-auto py-16 px-4">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <UserX className="h-16 w-16 text-muted-foreground"/>
                    </div>
                    <CardTitle className="text-center text-2xl">
                        Actor Not Found
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        We couldn't find the actor you're looking for. They may have been
                        removed or the link might be incorrect.
                    </p>
                    <Button asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
```

---

#### **F. Update ActorFollowButton for Full-Width Style**

**File:** `src/components/follows/ActorFollowButton.tsx` (enhancement)

```tsx
'use client';

import {useUserFollows, useCreateFollow, useDeleteFollow} from '@/lib/query/follow';
import {FollowType} from '@prisma/client';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {UserPlus, UserCheck} from 'lucide-react';

interface ActorFollowButtonProps {
    userId: string;
    type: FollowType;
    value: string;
    variant?: 'default' | 'outline' | 'secondary';
    size?: 'default' | 'sm' | 'lg';
    fullWidth?: boolean;
}

export function ActorFollowButton({
                                      userId,
                                      type,
                                      value,
                                      variant = 'default',
                                      size = 'default',
                                      fullWidth = true,
                                  }: ActorFollowButtonProps) {
    const {data: follows} = useUserFollows(userId);
    const {mutate: createFollow, isPending: isCreating} = useCreateFollow(userId);
    const {mutate: deleteFollow, isPending: isDeleting} = useDeleteFollow(userId);

    const existingFollow = follows?.find(f => f.type === type && f.value === value);
    const isFollowing = !!existingFollow;
    const isPending = isCreating || isDeleting;

    const handleToggle = () => {
        if (isFollowing && existingFollow) {
            deleteFollow(existingFollow.id, {
                onSuccess: () => toast.success(`Unfollowed ${value}`),
                onError: (error) => toast.error(error.message),
            });
        } else {
            createFollow(
                {type, value},
                {
                    onSuccess: () => toast.success(`Following ${value}`),
                    onError: (error) => toast.error(error.message),
                }
            );
        }
    };

    return (
        <Button
            onClick={handleToggle}
            disabled={isPending}
            variant={isFollowing ? 'outline' : variant}
            size={size}
            className={fullWidth ? 'w-full' : ''}
        >
            {isPending ? (
                <>Loading...</>
            ) : isFollowing ? (
                <>
                    <UserCheck className="mr-2 h-4 w-4"/>
                    Following
                </>
            ) : (
                <>
                    <UserPlus className="mr-2 h-4 w-4"/>
                    Follow
                </>
            )}
        </Button>
    );
}
```

---

### **Summary of Actor Page Implementation:**

**What We Created:**

1. ✅ **Main Actor Page** - Server component with data fetching and prefetching
2. ✅ **Actor Detail Content** - Client component using shadcn/ui (Card, Avatar, Badge, Separator)
3. ✅ **Loading State** - Skeleton components for better UX
4. ✅ **Not Found Page** - Friendly error page when actor doesn't exist
5. ✅ **Enhanced Follow Button** - With icons and full-width option

**shadcn/ui Components Used:**

- `Card` - Main content containers
- `Avatar` - Actor profile picture with fallback
- `Badge` - Movie ratings and tags
- `Separator` - Visual dividers
- `Skeleton` - Loading placeholders
- `Button` - Follow/unfollow actions

**Key Features:**

- 🎨 Modern, responsive design
- ⚡ Server-side rendering with client-side hydration
- 🔄 Optimistic updates for follow/unfollow
- 📱 Mobile-friendly layout
- 🎭 Fallback avatars with initials
- 💀 Loading skeletons for better perceived performance

---

**Next Steps:**

After implementing the Actor Detail Page, you can proceed with **Phase 3** (Follows, Interests, and Preferences pages)
since the `ActorFollowButton` will already be working and tested on the actor page.

---

## **Phase 3 – UI Implementation** [NEXT]

### **Overview**

Build the user interface to test and use all the server actions created in Phase 2. This allows us to verify
functionality before implementing the automated cron job.

**NEW STRUCTURE:** Instead of using tabs on a single page, we'll create **3 separate pages** with their own routes and
component folders:

1. **Follows Page** (`/follows`) - Components under `src/components/follows/`
2. **Interests Page** (`/interests`) - Components under `src/components/interests/`
3. **User Preferences Page** (`/preferences` or `/settings`) - Components under `src/components/user-preferences/`

---

### **11. ⬜ Create Page Routes & Structure** [PENDING]

**Three Separate Pages:**

#### **A. Follows Page**

- **Route:** `src/app/[locale]/follows/page.tsx`
- **Purpose:** Manage followed actors and genres
- **Components Folder:** `src/components/follows/`

#### **B. Interests Page**

- **Route:** `src/app/[locale]/interests/page.tsx` (already exists)
- **Purpose:** Manage complex interests with multiple conditions
- **Components Folder:** `src/components/interests/`

#### **C. User Preferences Page**

- **Route:** `src/app/[locale]/preferences/page.tsx` OR `src/app/[locale]/settings/page.tsx`
- **Purpose:** Manage notification preferences (email/SMS)
- **Components Folder:** `src/components/user-preferences/`

**Navigation:**

- Add links in main navigation or user menu to access all 3 pages
- Optional: Add breadcrumbs or internal navigation between the 3 pages

---

### **12. ⬜ Implement Follows Page & Components** [PENDING]

**Page:** `src/app/[locale]/follows/page.tsx`

**Features:**

- Display all followed actors and genres
- Add new follows
- Remove follows
- Show counts and statistics

**Components to create in `src/components/follows/`:**

#### **A. `FollowsList.tsx`**

- List all followed actors/genres grouped by type
- Display as cards or badges with remove button
- Show count by type (e.g., "3 Actors, 2 Genres")
- Handle `deleteFollow()` action

#### **B. `AddFollowDialog.tsx`**

- Dialog/modal to add new follow
- Dropdown to select type (Actor/Genre)
- Input field or search for name
- Calls `createFollow()` server action
- Toast feedback on success/error

#### **C. `FollowCard.tsx`** (optional)

- Individual follow item component
- Shows type, value, date added
- Remove button

**React Query Hooks to use:**

```typescript
import {useUserFollows, useCreateFollow, useDeleteFollow} from '@/lib/query/follow';
```

**Example Page Implementation:**

```tsx
// src/app/[locale]/follows/page.tsx
import {HydrationBoundary, dehydrate} from '@tanstack/react-query';
import {getQueryClient} from '@/lib/query';
import {userFollowsOptions} from '@/lib/query/follow';
import {FollowsList} from '@/components/follows/FollowsList';
import {auth} from '@/lib/auth';

export default async function FollowsPage() {
    const session = await auth();
    const queryClient = getQueryClient();

    // Prefetch follows data on server
    queryClient.prefetchQuery(userFollowsOptions(session.user.id));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <FollowsList userId={session.user.id}/>
        </HydrationBoundary>
    );
}
```

**Example Component Implementation:**

```tsx
// src/components/follows/FollowsList.tsx
'use client';

import {useUserFollows, useDeleteFollow} from '@/lib/query/follow';
import {FollowType} from '@prisma/client';
import {toast} from 'sonner';

export function FollowsList({userId}: { userId: string }) {
    const {data: follows, isLoading, error} = useUserFollows(userId);
    const {mutate: deleteFollow, isPending: isDeleting} = useDeleteFollow(userId);

    const handleDelete = (followId: string) => {
        deleteFollow(followId, {
            onSuccess: () => toast.success('Follow removed successfully'),
            onError: (error) => toast.error(error.message),
        });
    };

    if (isLoading) return <div>Loading follows...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const actors = follows?.filter(f => f.type === FollowType.ACTOR) || [];
    const genres = follows?.filter(f => f.type === FollowType.GENRE) || [];

    return (
        <div>
            <section>
                <h2>Actors ({actors.length})</h2>
                {actors.map(follow => (
                    <div key={follow.id}>
                        <span>{follow.value}</span>
                        <button
                            onClick={() => handleDelete(follow.id)}
                            disabled={isDeleting}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </section>

            <section>
                <h2>Genres ({genres.length})</h2>
                {genres.map(follow => (
                    <div key={follow.id}>
                        <span>{follow.value}</span>
                        <button
                            onClick={() => handleDelete(follow.id)}
                            disabled={isDeleting}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </section>
        </div>
    );
}
```

**Example Add Follow Dialog:**

```tsx
// src/components/follows/AddFollowDialog.tsx
'use client';

import {useCreateFollow} from '@/lib/query/follow';
import {FollowType} from '@prisma/client';
import {toast} from 'sonner';
import {useState} from 'react';

export function AddFollowDialog({userId}: { userId: string }) {
    const [type, setType] = useState<FollowType>(FollowType.ACTOR);
    const [value, setValue] = useState('');
    const {mutate: createFollow, isPending} = useCreateFollow(userId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createFollow(
            {type, value},
            {
                onSuccess: () => {
                    toast.success('Follow added successfully');
                    setValue('');
                },
                onError: (error) => toast.error(error.message),
            }
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <select value={type} onChange={(e) => setType(e.target.value as FollowType)}>
                <option value={FollowType.ACTOR}>Actor</option>
                <option value={FollowType.GENRE}>Genre</option>
            </select>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter ${type.toLowerCase()} name`}
                required
            />
            <button type="submit" disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Follow'}
            </button>
        </form>
    );
}
```

**Example Page Structure:**

```
┌─────────────────────────────────────────────────┐
│ My Follows                                       │
│                                                  │
│ ┌─────────────────────────────────────────┐    │
│ │ Actors (3)                    [+ Add]   │    │
│ │ ○ Emma Stone          [×]               │    │
│ │ ○ Ryan Gosling        [×]               │    │
│ │ ○ Margot Robbie       [×]               │    │
│ └─────────────────────────────────────────┘    │
│                                                  │
│ ┌─────────────────────────────────────────┐    │
│ │ Genres (2)                    [+ Add]   │    │
│ │ ○ Action              [×]               │    │
│ │ ○ Drama               [×]               │    │
│ └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

### **13. ⬜ Implement Interests Page & Components** [PENDING]

**Page:** `src/app/[locale]/interests/page.tsx` (update existing)

**Features:**

- Display all complex interests
- Create new interests with multiple conditions
- Edit existing interests
- Delete interests

**Components to create in `src/components/interests/`:**

#### **A. `InterestsList.tsx`**

- Display all complex interests as cards
- Show interest name and summary of conditions
- Edit and delete buttons for each interest
- Empty state when no interests exist

#### **B. `InterestDialog.tsx`**

- Dialog for creating/editing interests
- Dynamic form to add multiple conditions
- Condition builder UI:
    - Select condition type (Actor, Genre, Rating, Duration Min, Duration Max)
    - Input appropriate value (string for Actor/Genre, number for ratings/duration)
    - Add/remove conditions dynamically with [+ Add Condition] and [× Remove]
- Auto-generates name or allows custom name input
- Calls `createInterest()` or `updateInterest()`

#### **C. `InterestCard.tsx`**

- Individual interest card component
- Shows name, conditions list, creation date
- Edit and delete actions

#### **D. `ConditionBuilder.tsx`** (optional)

- Reusable component for building individual conditions
- Handles type selection and value input
- Validation for numeric values

**React Query Hooks to use:**

```typescript
import {
    useUserInterests,
    useCreateInterest,
    useUpdateInterest,
    useDeleteInterest
} from '@/lib/query/interest';
```

**Example Page Implementation:**

```tsx
// src/app/[locale]/interests/page.tsx
import {HydrationBoundary, dehydrate} from '@tanstack/react-query';
import {getQueryClient} from '@/lib/query';
import {userInterestsOptions} from '@/lib/query/interest';
import {InterestsList} from '@/components/interests/InterestsList';
import {auth} from '@/lib/auth';

export default async function InterestsPage() {
    const session = await auth();
    const queryClient = getQueryClient();

    // Prefetch interests data on server
    queryClient.prefetchQuery(userInterestsOptions(session.user.id));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <InterestsList userId={session.user.id}/>
        </HydrationBoundary>
    );
}
```

**Example Component Implementation:**

```tsx
// src/components/interests/InterestsList.tsx
'use client';

import {useUserInterests, useDeleteInterest} from '@/lib/query/interest';
import {toast} from 'sonner';
import {InterestCard} from './InterestCard';

export function InterestsList({userId}: { userId: string }) {
    const {data: interests, isLoading, error} = useUserInterests(userId);
    const {mutate: deleteInterest, isPending: isDeleting} = useDeleteInterest(userId);

    const handleDelete = (interestId: string) => {
        deleteInterest(interestId, {
            onSuccess: () => toast.success('Interest deleted successfully'),
            onError: (error) => toast.error(error.message),
        });
    };

    if (isLoading) return <div>Loading interests...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!interests?.length) return <div>No interests yet. Create your first one!</div>;

    return (
        <div className="space-y-4">
            {interests.map(interest => (
                <InterestCard
                    key={interest.id}
                    interest={interest}
                    onDelete={() => handleDelete(interest.id)}
                    isDeleting={isDeleting}
                />
            ))}
        </div>
    );
}
```

**Example Create Interest Dialog:**

```tsx
// src/components/interests/InterestDialog.tsx
'use client';

import {useCreateInterest} from '@/lib/query/interest';
import {InterestType} from '@prisma/client';
import {toast} from 'sonner';
import {useState} from 'react';

export function CreateInterestDialog({userId}: { userId: string }) {
    const [conditions, setConditions] = useState<Array<{
        type: InterestType;
        stringValue?: string | null;
        numericValue?: number | null;
    }>>([]);
    const [customName, setCustomName] = useState('');

    const {mutate: createInterest, isPending} = useCreateInterest(userId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createInterest(
            {
                name: customName || undefined, // Auto-generate if empty
                conditions,
            },
            {
                onSuccess: () => {
                    toast.success('Interest created successfully');
                    setConditions([]);
                    setCustomName('');
                },
                onError: (error) => toast.error(error.message),
            }
        );
    };

    const addCondition = (type: InterestType) => {
        setConditions([...conditions, {type, stringValue: null, numericValue: null}]);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Condition builder UI here */}
            <button type="submit" disabled={isPending || conditions.length === 0}>
                {isPending ? 'Creating...' : 'Create Interest'}
            </button>
        </form>
    );
}
```

**Example Page Structure:**

```
┌─────────────────────────────────────────────────┐
│ My Interests                     [+ New Interest]│
│                                                  │
│ ┌─────────────────────────────────────────┐    │
│ │ Emma Stone in Action (8.0+)              │    │
│ │ • Actor: Emma Stone                      │    │
│ │ • Genre: Action                          │    │
│ │ • Rating: ≥ 8.0                          │    │
│ │ • Duration: 90-180 min                   │    │
│ │                         [Edit] [Delete]  │    │
│ └─────────────────────────────────────────┘    │
│                                                  │
│ ┌─────────────────────────────────────────┐    │
│ │ High-rated Sci-Fi                        │    │
│ │ • Genre: Science Fiction                 │    │
│ │ • Rating: ≥ 8.5                          │    │
│ │                         [Edit] [Delete]  │    │
│ └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

### **14. ⬜ Implement User Preferences Page & Components** [PENDING]

**Page:** `src/app/[locale]/preferences/page.tsx` OR `src/app/[locale]/settings/page.tsx`

**Features:**

- Display current notification preferences
- Toggle email notifications
- Toggle SMS notifications (when available)
- Show impact message (affects all interests)

**Components to create in `src/components/user-preferences/`:**

#### **A. `PreferencesSettings.tsx`**

- Main component for preferences management
- Checkbox for Email notifications
- Checkbox for SMS notifications
- Auto-save on change (or manual save button)
- Shows current settings with clear labels
- Uses `useUpdateUserPreferences()` hook

#### **B. `NotificationMethodToggle.tsx`** (optional)

- Reusable toggle component for each notification method
- Shows enabled/disabled state
- Description of what the method does

**React Query Hooks to use:**

```typescript
import {useUserPreferences, useUpdateUserPreferences} from '@/lib/query/user-preferences';
```

**Example Page Implementation:**

```tsx
// src/app/[locale]/preferences/page.tsx
import {HydrationBoundary, dehydrate} from '@tanstack/react-query';
import {getQueryClient} from '@/lib/query';
import {userPreferencesOptions} from '@/lib/query/user-preferences';
import {PreferencesSettings} from '@/components/user-preferences/PreferencesSettings';
import {auth} from '@/lib/auth';

export default async function PreferencesPage() {
    const session = await auth();
    const queryClient = getQueryClient();

    // Prefetch preferences data on server
    queryClient.prefetchQuery(userPreferencesOptions(session.user.id));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PreferencesSettings userId={session.user.id}/>
        </HydrationBoundary>
    );
}
```

**Example Component Implementation:**

```tsx
// src/components/user-preferences/PreferencesSettings.tsx
'use client';

import {useUserPreferences, useUpdateUserPreferences} from '@/lib/query/user-preferences';
import {NotifyMethod} from '@prisma/client';
import {toast} from 'sonner';

export function PreferencesSettings({userId}: { userId: string }) {
    const {data: preferences, isLoading, error} = useUserPreferences(userId);
    const {mutate: updatePreferences, isPending} = useUpdateUserPreferences(userId);

    const handleToggle = (method: NotifyMethod, enabled: boolean) => {
        const currentMethods = preferences?.notifyBy || [];
        const newMethods = enabled
            ? [...currentMethods, method]
            : currentMethods.filter(m => m !== method);

        updatePreferences(
            {notifyBy: newMethods},
            {
                onSuccess: () => toast.success('Preferences updated'),
                onError: (error) => toast.error(error.message),
            }
        );
    };

    if (isLoading) return <div>Loading preferences...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const emailEnabled = preferences?.notifyBy.includes(NotifyMethod.EMAIL) || false;

    return (
        <div>
            <h1>Notification Preferences</h1>
            <p>Choose how you want to be notified about new movies matching your interests.</p>

            <div className="space-y-4">
                <label>
                    <input
                        type="checkbox"
                        checked={emailEnabled}
                        onChange={(e) => handleToggle(NotifyMethod.EMAIL, e.target.checked)}
                        disabled={isPending}
                    />
                    <span>Email Notifications</span>
                    <p className="text-sm">Receive alerts via email</p>
                </label>

                {/* SMS option when available */}
                <label className="opacity-50">
                    <input type="checkbox" disabled/>
                    <span>SMS Notifications (Coming soon)</span>
                    <p className="text-sm">Receive alerts via text message</p>
                </label>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
                ℹ️ These settings apply to all your interests and follows.
            </p>
        </div>
    );
}
```

**Example Page Structure:**

```
┌─────────────────────────────────────────────────┐
│ Notification Preferences                         │
│                                                  │
│ Choose how you want to be notified about new    │
│ movies matching your interests.                 │
│                                                  │
│ ┌─────────────────────────────────────────┐    │
│ │ Notification Methods                     │    │
│ │                                          │    │
│ │ ☑ Email Notifications                   │    │
│ │   Receive alerts via email               │    │
│ │                                          │    │
│ │ ☐ SMS Notifications (Coming soon)       │    │
│ │   Receive alerts via text message        │    │
│ └─────────────────────────────────────────┘    │
│                                                  │
│ ℹ️ These settings apply to all your interests   │
│    and follows.                                 │
└─────────────────────────────────────────────────┘
```

---

### **15. ⬜ Create Actor/Genre Follow Buttons** [PENDING]

**File:** `src/components/follows/ActorFollowButton.tsx` OR `src/components/subscriptions/ActorFollowButton.tsx`

**Location:** Actor detail pages, genre pages, search results

**Features:**

- Shows "Follow" or "Following" based on state
- Uses `useCreateFollow()` and `useDeleteFollow()` hooks
- Toast feedback on success/error
- Optimistic UI updates (built into hooks)
- Can be used for both actors and genres

**Example Implementation:**

```tsx
// src/components/follows/ActorFollowButton.tsx
'use client';

import {useUserFollows, useCreateFollow, useDeleteFollow} from '@/lib/query/follow';
import {FollowType} from '@prisma/client';
import {toast} from 'sonner';

interface ActorFollowButtonProps {
    userId: string;
    type: FollowType;
    value: string;
}

export function ActorFollowButton({userId, type, value}: ActorFollowButtonProps) {
    const {data: follows} = useUserFollows(userId);
    const {mutate: createFollow, isPending: isCreating} = useCreateFollow(userId);
    const {mutate: deleteFollow, isPending: isDeleting} = useDeleteFollow(userId);

    const existingFollow = follows?.find(f => f.type === type && f.value === value);
    const isFollowing = !!existingFollow;
    const isPending = isCreating || isDeleting;

    const handleToggle = () => {
        if (isFollowing && existingFollow) {
            deleteFollow(existingFollow.id, {
                onSuccess: () => toast.success(`Unfollowed ${value}`),
                onError: (error) => toast.error(error.message),
            });
        } else {
            createFollow(
                {type, value},
                {
                    onSuccess: () => toast.success(`Following ${value}`),
                    onError: (error) => toast.error(error.message),
                }
            );
        }
    };

    return (
        <button onClick={handleToggle} disabled={isPending}>
            {isPending ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
        </button>
    );
}
```

**Usage:**

```tsx
// On actor detail page
<ActorFollowButton
    userId={session.user.id}
    type={FollowType.ACTOR}
    value={actorName}
/>

// On genre pages
<ActorFollowButton
    userId={session.user.id}
    type={FollowType.GENRE}
    value={genreName}
/>
```

---

### **16. ⬜ Add Navigation & Toast Notifications** [PENDING]

#### **A. Navigation**

Add links to the 3 pages in:

- Main navigation bar
- User dropdown menu
- Sidebar (if exists)

Example navigation items:

```tsx
<NavLink href="/follows">My Follows</NavLink>
<NavLink href="/interests">My Interests</NavLink>
<NavLink href="/preferences">Preferences</NavLink>
```

#### **B. Toast Notifications**

**Install sonner** (if not already available):

```bash
pnpm install sonner
```

**Note:** Toast notifications are already integrated in all example components above using:

```tsx
import {toast} from 'sonner';

// Success
toast.success('Follow added successfully!');

// Error
toast.error('Failed to add follow');

// Info
toast.info('Interest updated');
```

---

### **Component Organization Summary:**

```
src/
├── app/
│   └── [locale]/
│       ├── follows/
│       │   └── page.tsx          [NEW - Uses userFollowsOptions for prefetch]
│       ├── interests/
│       │   └── page.tsx          [UPDATE - Uses userInterestsOptions for prefetch]
│       └── preferences/
│           └── page.tsx          [NEW - Uses userPreferencesOptions for prefetch]
│
├── components/
│   ├── follows/                  [NEW FOLDER]
│   │   ├── FollowsList.tsx       [Uses useUserFollows, useDeleteFollow]
│   │   ├── AddFollowDialog.tsx   [Uses useCreateFollow]
│   │   ├── FollowCard.tsx
│   │   └── ActorFollowButton.tsx [Uses useUserFollows, useCreateFollow, useDeleteFollow]
│   │
│   ├── interests/                [NEW FOLDER]
│   │   ├── InterestsList.tsx     [Uses useUserInterests, useDeleteInterest]
│   │   ├── InterestDialog.tsx    [Uses useCreateInterest, useUpdateInterest]
│   │   ├── InterestCard.tsx
│   │   └── ConditionBuilder.tsx
│   │
│   ├── user-preferences/         [NEW FOLDER]
│   │   ├── PreferencesSettings.tsx  [Uses useUserPreferences, useUpdateUserPreferences]
│   │   └── NotificationMethodToggle.tsx
│   │
│   └── subscriptions/            [EXISTS - May keep shared components]
│       └── README.md
│
└── lib/
    └── query/                    [React Query setup]
        ├── follow/               [Follow entity hooks & options]
        ├── interest/             [Interest entity hooks & options]
        └── user-preferences/     [Preferences entity hooks & options]
```

