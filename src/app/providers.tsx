'use client';

import {NuqsAdapter} from 'nuqs/adapters/next/app';
import {ThemeProvider} from '@/components/theme-provider';
import {authClient} from '@/lib/auth-client';
import {AuthUIProvider} from "@daveyplate/better-auth-ui"
import Link from "next/link"
import {useRouter} from "next/navigation";
import {useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {HebrewAuthLocalization} from "@/constants/auth.const";

export function AppProviders({children}: { children: React.ReactNode }) {
    const router = useRouter()
    const [client] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={client}>
            <AuthUIProvider
                authClient={authClient}
                navigate={router.push}
                replace={router.replace}
                onSessionChange={() => {
                    // Clear router cache (protected routes)
                    router.refresh()
                }}
                localization={HebrewAuthLocalization}
                Link={Link}
                social={{
                    providers: ['google'],
                }}
            >
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                    <NuqsAdapter>
                        {children}
                    </NuqsAdapter>
                </ThemeProvider>
            </AuthUIProvider>
        </QueryClientProvider>
    );
}
