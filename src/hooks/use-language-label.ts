import {AppConfig, Messages, NamespaceKeys, NestedKeyOf, useTranslations} from 'next-intl';
import {Language} from '@prisma/client';

/**
 * Hook to get translated language labels
 * Use this instead of the hardcoded LANGUAGE_LABELS constant
 */
export function useLanguageLabel() {
    const t = useTranslations('languages');

    return (language?: Language | string | null): string | undefined => {
        if (!language) return undefined;

        // Handle both Language enum and string keys
        const key = language as Parameters<typeof t>[0]

        try {
            return t(key);
        } catch {
            // Fallback if translation key doesn't exist
            return String(language);
        }
    };
}

