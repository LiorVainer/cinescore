export const MOVIERCARD_LAYOUT_ID_GENERATORS = {
    CARD: (title: string, suffix: string) => `card-${title}-${suffix}`,
    IMAGE: (title: string, suffix: string) => `image-${title}-${suffix}`,
    BUTTON: (title: string, suffix: string) => `button-${title}-${suffix}`,
    TITLE: (title: string, suffix: string) => `title-${title}-${suffix}`,
    ORIGINAL: (title: string, suffix: string) => `original-${title}-${suffix}`,
    RUNTIME: (title: string, suffix: string) => `runtime-${title}-${suffix}`,
    DATE: (title: string, suffix: string) => `date-${title}-${suffix}`,
    SINCE: (title: string, suffix: string) => `since-${title}-${suffix}`,
    DESCRIPTION: (suffix: string) => `description-${suffix}`,
    GENRES: (suffix: string) => `genres-${suffix}`,
} as const;

export type MoviecardLayoutKey = keyof typeof MOVIERCARD_LAYOUT_ID_GENERATORS;
