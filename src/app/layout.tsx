import {routing} from '@/i18n/routing';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return children;
}
