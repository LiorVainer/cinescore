'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '@prisma/client';
import { useRouter, usePathname } from 'next/navigation';

const LanguageContext = createContext<
    | undefined
    | {
          currentLanguage: Language;
          setLanguage: (language: Language) => void;
          isLoading: boolean;
      }
>(undefined);

// Helper function to map URL locale to database Language enum
const mapLocaleToLanguage = (locale: string) => {
    switch (locale) {
        case 'he':
            return Language.he_IL;
        case 'en':
            return Language.en_US;
        default:
            return Language.he_IL;
    }
};

// Helper function to map database Language enum to URL locale
const mapLanguageToLocale = (language: Language) => {
    switch (language) {
        case Language.he_IL:
            return 'he';
        case Language.en_US:
            return 'en';
        default:
            return 'he';
    }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.he_IL);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Determine language from the URL path
        const locale = pathname.startsWith('/en') ? 'en' : 'he';
        const language = mapLocaleToLanguage(locale);
        setCurrentLanguage(language);
        setIsLoading(false);
    }, [pathname]);

    const setLanguage = (language: Language) => {
        setCurrentLanguage(language);
        localStorage.setItem('preferred-language', language);

        // Navigate to the new locale
        const newLocale = mapLanguageToLocale(language);
        const currentLocale = pathname.startsWith('/en') ? 'en' : 'he';

        if (newLocale !== currentLocale) {
            const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
            router.push(newPath);
        }
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage, isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
