import {getTranslations, setRequestLocale} from 'next-intl/server';
import {HeroActions} from '@/app/components/landing/HeroActions';
import React from 'react';
import {routing} from '@/i18n/routing';
import {getTopRatedMovies} from '@/app/actions/movies';
import TopRatedCarousel from '@/app/components/landing/TopRatedCarousel';

interface Props {
    params: Promise<{ locale: (typeof routing.locales)[number] }>;
}

export default async function LandingPage({params}: Props) {
    const {locale} = await params;

    // set request locale for next-intl server helpers
    setRequestLocale(locale);

    const t = await getTranslations('landing');

    // Fetch top rated movies (server-side)
    const topMovies = await getTopRatedMovies(locale, 5);

    return (
        <main className="relative flex flex-col overflow-x-hidden overflow-y-auto h-full w-screen items-center justify-between  gap-16 md:gap-20">
            <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-12 py-12 md:py-24">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl font-hebrew">
                    {t('title')}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">{t('subtitle')}</p>
                <HeroActions />
            </section>

            {/* Notice: remove items-center to let width expand */}
                <section className="relative w-[220vw] md:w-[140vw] border-t-6 border-white bg-primary px-6 py-12 md:px-12 md:py-16 rounded-t-full flex flex-col justify-center items-center shadow-[inset_0_20px_30px_rgba(0,0,0,0.6)]">
                    <TopRatedCarousel movies={topMovies} />
                </section>
        </main>
    );
}
