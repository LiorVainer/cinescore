import {$Enums} from "@prisma/client";

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
