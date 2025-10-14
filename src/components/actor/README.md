# Actor Detail Page Components

This folder contains the client-side component for the Actor Detail Page.

## Files

### `ActorDetailContent.tsx`

Main client component that displays actor information including:

- Large avatar with fallback initials
- Actor name and follow button
- Birth date and place of birth
- Biography section
- Filmography grid with clickable movie cards

## Usage

This component is used in the Actor Detail Page at `app/[locale]/actors/[actorId]/page.tsx`.

The page handles:

- Server-side data fetching with Prisma
- Multi-language support (en_US and he_IL)
- React Query prefetching for follows
- Authentication state management

## Features

- ✅ Responsive 2-column layout (sidebar + main content)
- ✅ shadcn/ui components (Card, Avatar, Badge, Separator)
- ✅ Clickable movie cards that navigate to movie detail pages
- ✅ Follow/unfollow functionality with optimistic updates
- ✅ Loading states with skeletons
- ✅ Not found page
- ✅ SEO metadata generation

