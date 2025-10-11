'use client';

import {NuqsAdapter} from 'nuqs/adapters/next/app';
import {ThemeProvider} from 'next-themes';
import {authClient} from '@/lib/auth-client';
import {AuthUIProvider} from '@daveyplate/better-auth-ui';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {LanguageProvider} from '@/contexts/LanguageContext';
import {HebrewAuthLocalization} from '@/constants/auth.const';

export function AppProviders({children}) {
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
                localization={HebrewAuthLocalization}
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
                    <LanguageProvider>
                        <NuqsAdapter>{children}</NuqsAdapter>
                    </LanguageProvider>
                </ThemeProvider>
            </AuthUIProvider>
            {/*<ReactQueryDevtools initialIsOpen={false}/>*/}
        </QueryClientProvider>
    );
}
