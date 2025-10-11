import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Geist, Geist_Mono} from 'next/font/google';
import '../globals.css';
import {AppProviders} from '../providers';
import {AppNavbar} from '@/components/layout/app-navbar';
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

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Await the params before using its properties
    const {locale} = await params;

    // Validate that the incoming `locale` parameter is valid using routing configuration
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

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
            locale={locale}
            messages={messages}
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
