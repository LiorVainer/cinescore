import {hasLocale, Locale, NextIntlClientProvider} from 'next-intl';

import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Geist, Geist_Mono} from 'next/font/google';
import '../globals.css';
import {AppProviders} from '../providers';
import {AppNavbar} from '@/components/navigation/app-navbar';
import {routing} from '@/i18n/routing';
import {DesktopModal} from '@/components/shared/DesktopModal';
import {MobileDrawer} from '@/components/shared/MobileDrawer';
import {LayoutGroup} from 'motion/react';

// Force dynamic rendering for all pages under this layout
// This is required because the AppNavbar uses auth components that rely on useSearchParams()
export const dynamic = 'force-dynamic';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
    display: 'swap',
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
});

export async function generateMetadata(props: { params: Promise<{ locale: (typeof routing.locales)[number] }> }) {
    const {locale} = await props.params;

    const t = await getTranslations({
        locale: locale as Locale,
        namespace: 'metadata',
    });

    return {
        title: t('title'),
    };
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
    // Await the params before using its properties
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html
            lang={locale}
            dir={locale === 'he' ? 'rtl' : 'ltr'}
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
        <body className={locale === 'he' ? 'font-hebrew' : 'font-sans'}>
        {/* ✅ CRITICAL: Pass locale to NextIntlClientProvider */}
        <NextIntlClientProvider
            // locale={locale}
            // messages={messages}
        >
            <AppProviders>
                {/* Wrap entire app in LayoutGroup to enable shared layout animations */}
                <LayoutGroup>
                    <AppNavbar/>
                    <div className="relative min-h-screen lg:px-[10%] overflow-hidden" style={{paddingTop: '3.25rem'}}>
                        {/* ✨ Background layer */}
                        <div className="fixed inset-0 -z-10 bg-gradient-static pointer-events-none"/>

                        {/* App content */}
                        {children}
                    </div>
                    {/* Render modals once at app level */}
                    <DesktopModal/>
                    <MobileDrawer/>
                </LayoutGroup>
            </AppProviders>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
