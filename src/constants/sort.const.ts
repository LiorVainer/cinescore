import { useTranslations } from 'next-intl';

export const SORT_VALUES = ['rating:desc', 'rating:asc', 'votes:desc', 'releaseDate:desc', 'releaseDate:asc'] as const;

export type SortValue = (typeof SORT_VALUES)[number];

export type GenreOption = { id: number; name: string };

export function useSortOptions() {
    const t = useTranslations('sort');

    return [
        { value: 'rating:desc', label: t('ratingDesc') },
        { value: 'rating:asc', label: t('ratingAsc') },
        { value: 'votes:desc', label: t('votesDesc') },
        { value: 'releaseDate:desc', label: t('releaseDateDesc') },
        { value: 'releaseDate:asc', label: t('releaseDateAsc') },
    ] as const;
}
