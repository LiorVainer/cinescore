import {hasLocale, Locale, NextIntlClientProvider} from 'next-intl';

import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Geist, Geist_Mono} from 'next/font/google';
import '../globals.css';
import {AppProviders} from '../providers';
import {AppNavbar} from '@/components/navigation/app-navbar';
import {routing} from '@/i18n/routing';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
    display: 'swap'
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap'
});

export async function generateMetadata(
    props
) {
    const {locale} = await props.params;

    const t = await getTranslations({
        locale: locale as Locale,
        namespace: 'metadata',
    });

    return {
        title: t('title')
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
    params: Promise<{ locale: typeof routing.locales[number] }>;
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
                <AppNavbar/>
                {children}
            </AppProviders>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
