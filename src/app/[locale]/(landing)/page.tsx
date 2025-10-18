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
        <main className='relative flex flex-col overflow-y-auto h-full px-6 py-24 md:py-40'>
            <section
                className='relative z-10 flex flex-col items-center justify-center text-center'>
                <h1 className='text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl font-hebrew'>
                    {t('title')}
                </h1>
                <p className='mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl'>{t('subtitle')}</p>

                <HeroActions/>
            </section>

            <section className='w-full max-w-6xl px-6 py-12'>
                <TopRatedCarousel movies={topMovies}/>
            </section>
        </main>
    );
}
