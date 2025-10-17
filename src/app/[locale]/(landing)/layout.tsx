import { HeroBackground3D } from '@/app/components/landing/HeroBackground3D';
import { getDal } from '@/lib/server-utils';
import { mapLocaleToLanguage } from '@/constants/languages.const';
import React from 'react';
import { routing } from '@/i18n/routing';

export default async function LandingLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
    const { locale } = await params;
    const dal = getDal();
    let language;
    try {
        language = mapLocaleToLanguage(locale);
    } catch {
        language = undefined;
    }

    const posters = await dal.movies.getBestRatedMoviePosters(20, language);

    return (
        <>
            {/* === Background Layer only for landing === */}
            <div className='fixed inset-0 -z-10 overflow-hidden'>
                <HeroBackground3D posters={posters} />
                <div className='absolute inset-0 bg-gradient-static pointer-events-none' />
            </div>

            {/* === Actual landing page content === */}
            <div className='relative h-screen-minus-navbar overflow-hidden' style={{ paddingTop: '3.25rem' }}>
                {children}
            </div>
        </>
    );
}
