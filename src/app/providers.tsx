'use client';

import {NuqsAdapter} from 'nuqs/adapters/next/app';
import {ThemeProvider} from 'next-themes';
import {authClient} from '@/lib/auth-client';
import {AuthUIProvider} from '@daveyplate/better-auth-ui';
import {useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {HebrewAuthLocalization} from '@/constants/auth.const';
import {Link, useRouter} from '@/i18n/navigation';
import {useLocale} from 'next-intl';

export function AppProviders({children}) {
    const locale = useLocale();
    const router = useRouter();
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthUIProvider
                authClient={authClient}
                navigate={router.push}
                replace={router.replace}
                onSessionChange={() => {
                    // Clear router cache (protected routes)
                    router.refresh();
                }}
                localization={locale === 'he' ? HebrewAuthLocalization : undefined}
                Link={Link}
                social={{
                    providers: ['google'],
                }}
            >
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                        <NuqsAdapter>{children}</NuqsAdapter>
                </ThemeProvider>
            </AuthUIProvider>
            {/*<ReactQueryDevtools initialIsOpen={false}/>*/}
        </QueryClientProvider>
    );
}
