# 🎬 Starzi — 3D Hero Background Spec — Server Component + next-intl Server APIs

## 📖 Purpose

Implement the landing page as a **server async component** in Next.js, with a cinematic 3D-tilted poster wall background.  
Use `next-intl`’s server-side translation APIs (per Context7 / latest next-intl) — not client hooks — in that server component.  
Delegate any interactive elements (buttons, animations) to small client components (`'use client'`).

---

## 🏗 Architecture & Components

| File / Component | Role | Client / Server |
|------------------|------|-----------------|
| `dal/movies/getHeroBackgroundPosters.ts` | DAL function to fetch poster URLs (from DB) | Server-only |
| `app/[locale]/page.tsx` | Landing page server component | Server (async) |
| `components/HeroBackground3D.tsx` | Renders 3D wall using poster URLs | Server or shared (stateless) |
| `components/HeroActions.tsx` | Interactive buttons / animations | Client |
| `globals.css` | Animation keyframes & gradients (light sweep, tilt, etc.) | — |

---

## 🌐 next-intl Integration (Server-side)

Because your landing page is a server component, you **cannot** use `useTranslations()` hook there directly. Instead, use the server-side helper:

```ts
import { getTranslations, setRequestLocale } from 'next-intl/server';
```

From the next-intl docs:  
> “For async components … use `getTranslations` instead of `useTranslations`.” ([next-intl.dev](https://next-intl.dev/docs/environments/server-client-components?utm_source=chatgpt.com))

Also, to allow static rendering (or avoid full dynamic fallback), you should set the request locale in the server component or layout:

```ts
setRequestLocale(locale);
```

This ensures the locale is wired properly for translations and request-based contexts.

---

## 📂 DAL: Poster Fetching

**File:** `dal/movies/getHeroBackgroundPosters.ts`

```ts
import { prisma } from '@/lib/prismaService';

export async function getHeroBackgroundPosters(limit = 12): Promise<string[]> {
  const movies = await prisma.movie.findMany({
    where: { posterUrl: { not: null } },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });
  return movies.map((m) => m.posterUrl!);
}
```

> **Agent / Developer Note:**  
> Before creating this, **check** if an existing DAL or repository already provides a method to get recent or trending movies with poster URLs. If yes, reuse that instead of duplicating.

---

## 🧱 Landing Page Server Component

**File:** `app/[locale]/page.tsx`

```tsx
import { getHeroBackgroundPosters } from '@/dal/movies/getHeroBackgroundPosters';
import { HeroBackground3D } from '@/components/HeroBackground3D';
import { HeroActions } from '@/components/HeroActions';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    locale: string;
  };
}

export default async function LandingPage({ params }: Props) {
  const { locale } = params;

  // Optionally validate locale, or use routing config  
  // e.g. if (!routing.locales.includes(locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations('landing');
  const posters = await getHeroBackgroundPosters(12);

  return (
    <main className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <HeroBackground3D posters={posters} />

      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-40">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl font-hebrew">
          {t('title')}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
          {t('subtitle')}
        </p>

        <HeroActions />
      </section>
    </main>
  );
}
```

---

## 🎨 HeroBackground3D (Stateless / Shared)

**File:** `components/HeroBackground3D.tsx`

```tsx
import Image from 'next/image';

interface Props {
  posters: string[];
}

export function HeroBackground3D({ posters }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div
        className="absolute inset-0 flex flex-wrap justify-center items-center opacity-40 blur-[1px]"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'perspective(800px) rotateY(-25deg) scale(1.2)',
        }}
      >
        {posters.map((url, i) => (
          <div
            key={i}
            className="relative w-[18%] aspect-[2/3] m-[0.4%] overflow-hidden rounded-md"
            style={{
              transform: `translateZ(${(i % 3) * 10}px)`,
            }}
          >
            <Image
              src={url}
              alt={`poster ${i}`}
              fill
              sizes="20vw"
              className="object-cover brightness-90 contrast-110"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent light-sweep" />
    </div>
  );
}
```

---

## 🧩 HeroActions Client Component

**File:** `components/HeroActions.tsx`

```tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function HeroActions() {
  const t = useTranslations('landing');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="mt-10 flex flex-col sm:flex-row gap-4"
    >
      <Link href="/now-playing">
        <Button
          size="lg"
          className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-md hover:brightness-110 transition-all shadow-lg"
        >
          🎞️ {t('cta_now_playing')}
        </Button>
      </Link>
      <Link href="/signup">
        <Button
          size="lg"
          variant="outline"
          className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
        >
          {t('cta_subscribe')}
        </Button>
      </Link>
    </motion.div>
  );
}
```

---

## 🔄 Animations & CSS Utilities

**globals.css additions:**

```css
@keyframes tiltMove {
  0% {
    transform: perspective(800px) rotateY(-22deg) scale(1.2);
  }
  100% {
    transform: perspective(800px) rotateY(-28deg) scale(1.25);
  }
}

@keyframes lightSweep {
  0% { transform: translateX(-100%); opacity: 0; }
  20% { opacity: 0.4; }
  50% { opacity: 0.25; }
  100% { transform: translateX(100%); opacity: 0; }
}

.light-sweep::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
  animation: lightSweep 8s linear infinite;
}
```

---

## ✅ Checklist / Agent Instructions

- [ ] Confirm existing DAL or implement `getHeroBackgroundPosters(limit)`
- [ ] Use `getTranslations` + `setRequestLocale` in server page
- [ ] Keep hero background server-rendered
- [ ] `HeroActions` client for interactivity
- [ ] Add tilt and light sweep animations in CSS
- [ ] Validate dark/light contrast and revalidation strategy
