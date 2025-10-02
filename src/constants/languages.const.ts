export const LANGUAGE_LABELS = {
    en: 'אנגלית',
    ja: 'יפנית',
    fr: 'צרפתית',
    hi: 'הינדית',
} as const;

export type LanguageCode = keyof typeof LANGUAGE_LABELS;

export function getLanguageLabel(code?: string | null): string | undefined {
    if (!code) return undefined;
    const k = code.toLowerCase() as LanguageCode;
    return (LANGUAGE_LABELS as Record<string, string>)[k] ?? code;
}
