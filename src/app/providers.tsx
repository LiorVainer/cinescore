'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider } from 'next-themes';
import { authClient } from '@/lib/auth-client';
import { AuthUIProvider } from '@daveyplate/better-auth-ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { HebrewAuthLocalization } from '@/constants/auth.const';
import { Link, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { Direction } from 'radix-ui';
import { getQueryClient } from '@/lib/query/query-client';
import { DrawerContentProvider } from '@/contexts/drawer-content-context';
import { UnifiedDrawer } from '@/components/shared/UnifiedDrawer';

export function AppProviders({ children }: { children: React.ReactNode }) {
    const locale = useLocale();
    const router = useRouter();
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <Direction.Provider dir={locale === 'he' ? 'rtl' : 'ltr'}>
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
                    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                        <NuqsAdapter>
                            <DrawerContentProvider>
                                {children}
                                <UnifiedDrawer />
                            </DrawerContentProvider>
                        </NuqsAdapter>
                    </ThemeProvider>
                </AuthUIProvider>
                {/*<ReactQueryDevtools initialIsOpen={false}/>*/}
            </Direction.Provider>
        </QueryClientProvider>
    );
}
