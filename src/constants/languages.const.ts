import {$Enums, Language} from "@prisma/client";

export const LANGUAGE_LABELS = {
    en_US: 'אנגלית',
    he_IL: 'עברית',
} satisfies Record<string & $Enums.Language, string>

export type LanguageCode = keyof typeof LANGUAGE_LABELS;

export function getLanguageLabel(code?: string | null): string | undefined {
    if (!code) return undefined;
    const k = code.toLowerCase() as LanguageCode;
    return (LANGUAGE_LABELS as Record<string, string>)[k] ?? code;
}

export const mapLocaleToLanguage = (locale: string) => {
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
export const mapLanguageToLocale = (language: Language) => {
    switch (language) {
        case Language.he_IL:
            return 'he';
        case Language.en_US:
            return 'en';
        default:
            return 'he';
    }
};

