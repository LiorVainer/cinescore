# Starzi - Current Project Status

**Last Updated:** October 12, 2025  
**Project Name:** Starzi  
**Tech Stack:** Next.js 15, TypeScript, Prisma, PostgreSQL, Better Auth, shadcn/ui, Tailwind CSS, Motion (Framer Motion)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Database Schema](#database-schema)
3. [Implemented Pages](#implemented-pages)
4. [Implemented Features](#implemented-features)
5. [Component Architecture](#component-architecture)
6. [API Routes](#api-routes)
7. [Authentication System](#authentication-system)
8. [Internationalization (i18n)](#internationalization-i18n)
9. [Data Access Layer (DAL)](#data-access-layer-dal)
10. [Next Steps & TODO](#next-steps--todo)

---

## 🎯 Project Overview

CineScore is a multilingual movie discovery and rating platform that aggregates data from TMDB and OMDB APIs. The
platform allows users to search, browse, and explore movies with advanced filtering capabilities, while supporting both
Hebrew and English languages with localized content.

### Key Objectives

- Provide a rich movie browsing experience with real-time search
- Support multilingual content (Hebrew & English)
- Implement user authentication and personalized features
- Enable movie notifications based on rating thresholds
- Display detailed movie information including cast, trailers, and ratings

---

## 🗄️ Database Schema

### Core Models

#### **User Management**

```prisma
- User
├── id (String, Primary Key)
├── name (String)
├── email (String, Unique)
├── emailVerified (Boolean)
├── image (String, Optional)
├── createdAt, updatedAt (DateTime)
└── Relations: accounts[], sessions[], subscriptions[], notifications[]

- Session (Better Auth)
├── id, token (String, Unique)
├── expiresAt (DateTime)
├── ipAddress, userAgent (Optional)
└── userId → User

- Account (OAuth/Credentials)
├── id, accountId, providerId
├── accessToken, refreshToken, idToken (Optional)
├── password (Optional, hashed)
└── userId → User

- Verification
├── id, identifier, value
└── expiresAt (DateTime)
```

#### **Movie Data**

```prisma
- Movie
├── id (String, Primary Key)
├── imdbId (String, Unique, Optional)
├── tmdbId (Int, Unique, Optional)
├── originalLanguage (Language enum)
├── rating (Float, Indexed)
├── votes (Int)
├── releaseDate (DateTime, Indexed)
├── createdAt, updatedAt
└── Relations: genres[], cast[], trailers[], translations[], notifications[]

- MovieTranslation (i18n Support)
├── id (CUID)
├── movieId → Movie
├── language (Language enum)
├── title (String)
├── description (String, Optional)
├── originalTitle (String, Optional)
├── posterUrl (String, Optional)
└── Unique: [movieId, language]

- Trailer
├── id (CUID)
├── movieId → Movie
├── url, youtubeId (String)
├── title (String)
├── language (Language enum)
└── Unique: [movieId, url]
```

#### **Genre System**

```prisma
- Genre
├── id (CUID)
├── tmdbId (Int, Unique, Optional)
├── createdAt, updatedAt
└── Relations: movies[], translations[]

- GenreTranslation (i18n Support)
├── id (CUID)
├── genreId → Genre
├── language (Language enum)
├── name (String)
└── Unique: [genreId, language]
```

#### **Cast & Actors**

```prisma
- Actor
├── id (CUID)
├── imdbId (String, Unique)
├── tmdbId (Int, Optional)
├── profileUrl (String, Optional)
├── popularity (Float, Optional)
├── birthday, deathday (DateTime, Optional)
├── placeOfBirth (String, Optional)
└── Relations: translations[], cast[]

- ActorTranslation (i18n Support)
├── id (CUID)
├── actorId → Actor
├── language (Language enum)
├── name (String)
├── biography (String, Optional)
└── Unique: [actorId, language]

- Cast (Join Table)
├── id (CUID)
├── movieId → Movie
├── actorId → Actor
├── character (String, Optional)
├── order (Int, Optional)
└── Unique: [movieId, actorId]
```

#### **Notification System**

```prisma
- Subscription
├── id (CUID)
├── userId → User
├── threshold (Float, Indexed)
├── genre (String, Optional)
├── notifyBy (NotifyMethod[], enum: EMAIL)
└── createdAt, updatedAt

- Notification
├── id (CUID)
├── userId → User
├── movieId → Movie
├── sentAt (DateTime, Indexed)
└── Unique: [userId, movieId]
```

### Enums

```prisma
enum Language {
  he_IL // Hebrew (Israel)
  en_US // English (US)
}

enum NotifyMethod {
  EMAIL
  // SMS - Future
  // PUSH - Future
}
```

---

## 📄 Implemented Pages

### Public Pages

- **`/` (Home Page)**
    - Main movie search and discovery interface
    - Real-time movie search with debouncing
    - Advanced filtering (genres, sorting)
    - Responsive grid layout with movie cards
    - Locale-specific routing: `/en` and `/he`

- **`/not-found` (404 Page)**
    - Custom 404 error page
    - Localized error messages

### Authentication Pages (Dynamic Routes)

- **`/auth/[path]`** - Better Auth UI integration
    - `/auth/sign-in` - Email/password and Google OAuth
    - `/auth/sign-up` - User registration
    - `/auth/sign-out` - Logout functionality
    - `/auth/forgot-password` - Password recovery
    - `/auth/reset-password` - Password reset
    - `/auth/magic-link` - Magic link authentication
    - `/auth/callback` - OAuth callback handler

### Account Pages (Dynamic Routes)

- **`/account/[path]`** - Better Auth UI account management
    - `/account/settings` - User profile settings
    - `/account/security` - Security settings
    - Additional account management views

### Localized Routes

All pages support locale prefixes:

- `/en/*` - English version
- `/he/*` - Hebrew version (RTL support)

---

## ✨ Implemented Features

### 🎬 Movie Discovery

- [x] **Real-time Search**
    - Debounced search input (300ms delay)
    - TMDB API integration for movie search
    - Search results with Hebrew/English translations

- [x] **Advanced Filtering**
    - Genre multi-select with localized genre names
    - Sort options (Rating, Release Date, Votes)
    - Clear filters functionality
    - Selected genre chips with remove option

- [x] **Movie Card Display**
    - Collapsed card view with poster, title, rating, genres
    - Expandable modal (desktop) with full details
    - Bottom drawer (mobile) for movie details
    - Smooth animations and transitions
    - IMDB logo and rating display
    - Release date with relative time formatting

- [x] **Movie Details Modal/Drawer**
    - Movie poster, title, and original title
    - Rating and vote count statistics
    - Release date with "time ago" formatting
    - Genre badges
    - Full description
    - **Cast section** with staggered fade-in animations
        - Actor profile images with names
        - "Show All/Show Less" toggle
        - Responsive grid layout (3-6 columns)
    - **Trailers section** with staggered fade-in animations
        - YouTube trailer thumbnails
        - Video playback on click
        - Horizontal scrollable layout
    - Shared-element layout animations (desktop)
    - Scrollable content with proper isolation

### 🔐 Authentication & User Management

- [x] **Better Auth Integration**
    - Email/password authentication
    - Google OAuth provider
    - Session management with JWT tokens
    - Secure password hashing

- [x] **Custom User Button Component**
    - User avatar with fallback initials
    - Dropdown menu with user info
    - Settings navigation link
    - Sign out functionality
    - Loading states
    - Internationalized labels

- [x] **Protected Routes**
    - Middleware for route protection
    - Redirect to sign-in for unauthenticated users
    - Account pages require authentication

### 🌍 Internationalization (i18n)

- [x] **Multi-language Support**
    - Hebrew (he_IL) - RTL layout
    - English (en_US) - LTR layout

- [x] **Locale Routing**
    - next-intl integration
    - Locale-prefixed URLs (`/en/*`, `/he/*`)
    - Language switcher in navigation

- [x] **Localized Content**
    - Movie titles and descriptions
    - Genre names
    - Actor names and biographies
    - UI labels and messages
    - Date/time formatting
    - Pluralization support

### 🎨 UI/UX Features

- [x] **Responsive Design**
    - Mobile-first approach
    - Adaptive layouts for desktop/tablet/mobile
    - Touch-friendly interactions

- [x] **Dark/Light Mode**
    - Theme toggle component
    - System preference detection
    - Persistent theme selection

- [x] **Animations**
    - Motion (Framer Motion) integration
    - Staggered card animations
    - Fade-in effects for cast and trailers
    - Smooth page transitions
    - Layout animations for modals

- [x] **Navigation**
    - Responsive navbar with logo
    - User button with dropdown
    - Language toggle
    - Theme toggle
    - Mobile-optimized menu

### 🔧 Technical Features

- [x] **Server Actions**
    - `searchMovies` - Movie search with TMDB/OMDB integration
    - Type-safe server-side data fetching

- [x] **API Integration**
    - TMDB API client (movie data, search, external IDs)
    - OMDB API client (IMDB ratings and votes)
    - Type-generated API clients from Swagger specs

- [x] **Database Abstraction**
    - Data Access Layer (DAL) pattern
    - `MoviesDAL` - Movie data operations
    - `GenresDAL` - Genre data operations
    - `ActorsDAL` - Actor data operations
    - Type-safe Prisma queries

---

## 🧩 Component Architecture

### Layout Components

```
src/components/layout/
├── app-navbar.tsx          # Main navigation bar
├── navbar-logo.tsx         # Application logo
└── [deprecated layouts]
```

### Movie Components

```
src/components/movie/
├── movie-card.tsx                    # Main card wrapper (handles modal/drawer)
├── movie-card-collapsed.tsx          # Compact card view
├── movie-card-collapsed.skeleton.tsx # Loading skeleton
├── movie-card-expanded.tsx           # Detailed modal/drawer content
├── movie-cast-section.tsx            # Cast list with animations ✨
├── movie-trailers-section.tsx        # Trailers carousel with animations ✨
├── movie-genres.tsx                  # Genre badges
├── MovieStats.tsx                    # Rating/votes display
├── MovieMeta.tsx                     # Release date/metadata
└── imdb-logo.tsx                     # IMDB logo component
```

### Search Components

```
src/components/movie-search/
├── movie-search.tsx          # Main search container
├── SearchInput.tsx           # Debounced search input
├── FilterBar.tsx             # Filter controls container
├── GenresMultiSelect.tsx     # Genre filter dropdown
├── SelectedGenreChips.tsx    # Active genre chips
└── SortSelect.tsx            # Sort options dropdown
```

### Navigation Components

```
src/components/navigation/
├── app-navbar.tsx           # Main navbar
├── language-toggle.tsx      # Language switcher
└── navbar-logo.tsx          # Logo component
```

### Auth Components

```
src/components/auth/
├── user-button.tsx          # Custom user dropdown button ✨
├── logout-button.tsx        # Sign out button
└── signup-form.tsx          # Registration form
```

### UI Components (shadcn/ui)

```
src/components/ui/
├── avatar.tsx               # User avatar
├── button.tsx               # Button variants
├── dropdown-menu.tsx        # Dropdown menu
├── drawer.tsx               # Mobile drawer
├── dialog.tsx               # Modal dialog
├── badge.tsx                # Badge component
├── card.tsx                 # Card container
├── input.tsx                # Input field
├── select.tsx               # Select dropdown
├── separator.tsx            # Divider line
├── skeleton.tsx             # Loading skeleton
├── tooltip.tsx              # Tooltip
└── [30+ other components]
```

### Shared Components

```
src/components/
├── mode-toggle.tsx                      # Dark/light theme toggle
├── theme-provider.tsx                   # Theme context provider
└── thumbnail-button-video-player.tsx    # YouTube video player
```

---

## 🔌 API Routes

### External API Routes

```
src/app/api/
├── route.ts                              # Root API handler
├── auth/[...all]/route.ts                # Better Auth API handler
└── cron/check-movies/route.ts            # Cron job for movie updates
```

### REST Endpoints (Future/Planned)

```
src/app/api/
├── genres/route.ts                       # Genre data endpoint
├── movies/search/route.ts                # Movie search endpoint
└── search/route.ts                       # General search endpoint
```

---

## 🔐 Authentication System

### Implementation Details

- **Framework:** Better Auth v3.2.5
- **Adapter:** Prisma PostgreSQL adapter
- **Providers:**
    - Email/Password with secure hashing
    - Google OAuth 2.0
- **Session Management:**
    - JWT-based sessions
    - HttpOnly cookies
    - IP address and user agent tracking
    - Configurable session expiry

### Auth Configuration

```typescript
// src/lib/auth.ts
betterAuth({
    emailAndPassword: {enabled: true},
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    database: prismaAdapter(prisma, {provider: 'postgresql'}),
})
```

### Custom Components

- **UserButton** - Avatar dropdown with:
    - User profile display (name, email)
    - Settings navigation
    - Sign out action
    - Loading states
    - Internationalized labels

---

## 🌍 Internationalization (i18n)

### Configuration

- **Library:** next-intl v3.x
- **Supported Locales:** `en` (English), `he` (Hebrew)
- **Default Locale:** `en`
- **Locale Detection:** URL prefix (`/en/*`, `/he/*`)

### Translation Files

```
messages/
├── en.json          # English translations
├── he.json          # Hebrew translations
└── en.d.json.ts     # TypeScript definitions
```

### Translation Namespaces

```json
{
  "nav": {
    "signIn",
    "language",
    "details"
  },
  "userButton": {
    "settings",
    "signOut"
  },
  "search": {
    "placeholder",
    "loading",
    "noResults",
    "errorLoading"
  },
  "movie": {
    "details",
    "rating",
    "releaseDate",
    "cast",
    "trailers",
    "showAll",
    "showLess"
  },
  "genres": {
    "title",
    "filter",
    "selected",
    "clearSelection"
  },
  "filters": {
    "sortBy",
    "genre",
    "clear",
    "clearAll"
  },
  "sort": {
    "ratingDesc",
    "ratingAsc",
    "votesDesc",
    "releaseDateDesc"
  },
  "dates": {
    "today",
    "daysAgo",
    "weeksAgo",
    "monthsAgo",
    "yearsAgo"
  },
  "languages": {
    "en_US",
    "he_IL"
  }
}
```

### Routing

```typescript
// src/i18n/routing.ts
-locales
:
['en', 'he']
- defaultLocale
:
'en'
- localePrefix
:
'always'
```

---

## 📊 Data Access Layer (DAL)

### Structure

```
dal/
├── index.ts              # Exports all DAL classes
├── movies.dal.ts         # Movie operations
├── genres.dal.ts         # Genre operations
└── actors.dal.ts         # Actor operations
```

### MoviesDAL

```typescript
class MoviesDAL {
    // Query methods
-

    findMany(params: MovieQueryParams)

-

    findById(id: string, language: Language)

-

    findByImdbId(imdbId: string, language: Language)

-

    findByTmdbId(tmdbId: number, language: Language)

-

    search(query: string, language: Language)

    // Create/Update methods
-

    create(data: CreateMovieData)

-

    update(id: string, data: UpdateMovieData)

-

    upsert(data: UpsertMovieData)

    // Complex queries
-

    findWithGenres(genreIds: string[], language: Language)

-

    findTopRated(limit: number, language: Language)

-

    findRecent(limit: number, language: Language)
}
```

### GenresDAL

```typescript
class GenresDAL {
-

    findAll(language: Language)

-

    findById(id: string, language: Language)

-

    findByTmdbId(tmdbId: number, language: Language)

-

    upsert(data: UpsertGenreData)
}
```

### ActorsDAL

```typescript
class ActorsDAL {
-

    findById(id: string, language: Language)

-

    findByImdbId(imdbId: string, language: Language)

-

    findByTmdbId(tmdbId: number, language: Language)

-

    upsert(data: UpsertActorData)
}
```

---

## 🎨 Design System

### Theme Configuration

- **Colors:** Custom color palette with dark/light variants
- **Typography:** Inter font family
- **Spacing:** Tailwind CSS spacing scale
- **Breakpoints:**
    - `sm: 640px`
    - `md: 768px`
    - `lg: 1024px`
    - `xl: 1280px`
    - `2xl: 1536px`

### Animation Library

- **Library:** Motion (Framer Motion fork)
- **Animations:**
    - Staggered children with 0.08-0.1s delays
    - Fade-in with slide-up (cast cards)
    - Fade-in with scale (trailer cards)
    - Cubic bezier easing: `[0.4, 0, 0.2, 1]`
    - Layout animations for shared elements
    - Modal/drawer transitions

---

## 📦 Dependencies

### Core

- **Next.js:** 15.x (App Router, Server Components)
- **React:** 19.x (RC)
- **TypeScript:** 5.x
- **Prisma:** 6.16.2 (ORM)
- **Better Auth:** Core authentication
- **@daveyplate/better-auth-ui:** 3.2.5 (Pre-built auth UI)

### UI & Styling

- **Tailwind CSS:** 3.x (Utility-first CSS)
- **shadcn/ui:** Component library
- **Radix UI:** Headless UI primitives
- **Motion:** Animation library (Framer Motion)
- **lucide-react:** Icon library

### Internationalization

- **next-intl:** 3.x (i18n routing and translations)

### API & Data

- **tmdb-ts:** TMDB API client
- **axios:** HTTP client (for OMDB)
- **swagger-typescript-api:** API client generation

### Development

- **ESLint:** Code linting
- **Prettier:** Code formatting (implied)
- **TypeScript:** Type checking

---

## 🚀 Next Steps & TODO

### High Priority

- [ ] Implement user subscription management UI
- [ ] Add notification preferences page
- [ ] Create cron job for checking movie ratings
- [ ] Implement email notifications for subscriptions
- [ ] Add movie watchlist feature
- [ ] Implement user ratings/reviews

### Medium Priority

- [ ] Add movie recommendations based on preferences
- [ ] Implement advanced search filters (year range, language)
- [ ] Add movie comparison feature
- [ ] Create "Coming Soon" movies section
- [ ] Implement pagination for search results
- [ ] Add social sharing features

### Low Priority

- [ ] Add SMS/Push notification support (enum prepared)
- [ ] Implement movie collections/playlists
- [ ] Add user activity feed
- [ ] Create admin dashboard for content management
- [ ] Implement A/B testing framework
- [ ] Add analytics and tracking

### Technical Improvements

- [ ] Add end-to-end tests (Playwright/Cypress)
- [ ] Implement unit tests for DAL and components
- [ ] Add API rate limiting and caching
- [ ] Optimize image loading (Next.js Image)
- [ ] Implement progressive web app (PWA) features
- [ ] Add error boundary components
- [ ] Implement request deduplication
- [ ] Add database query optimization and indexes
- [ ] Set up monitoring and error tracking (Sentry)
- [ ] Add performance monitoring (Vercel Analytics)

### Documentation

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Component Storybook
- [ ] Developer onboarding guide
- [ ] Deployment documentation
- [ ] Database migration guide

---

## 🔍 Known Issues & Limitations

### Current Limitations

1. **Search:** Limited to TMDB search results (no local database search yet)
2. **Filtering:** Genre filtering works only on TMDB search results
3. **Notifications:** Backend cron job not implemented yet
4. **Mobile:** Some animations may need optimization for low-end devices
5. **Accessibility:** Some components need ARIA labels and keyboard navigation improvements

### Performance Considerations

- API calls to TMDB/OMDB are not cached
- Movie posters loaded from external CDN (not optimized with Next.js Image)
- Large genre lists may impact initial load time
- Modal scroll lock may conflict with body scroll on some devices

---

## 📝 Notes

### Design Decisions

- **Better Auth over NextAuth:** More flexible, better TypeScript support
- **Prisma over raw SQL:** Type safety, easier migrations
- **Motion over Framer Motion:** Smaller bundle, same API
- **Server Components by default:** Better performance, SEO
- **DAL pattern:** Abstraction layer for easier testing and maintenance

### Security Considerations

- Environment variables for API keys
- HttpOnly cookies for session management
- CSRF protection via Better Auth
- SQL injection prevention via Prisma
- XSS protection via React's built-in escaping

### Performance Optimizations

- Debounced search input (300ms)
- Server-side rendering for initial page load
- Optimistic UI updates where possible
- Lazy loading for modal content
- Staggered animations to reduce CPU load

---

**Document Version:** 1.0  
**Last Updated:** October 12, 2025  
**Maintainer:** Development Team
