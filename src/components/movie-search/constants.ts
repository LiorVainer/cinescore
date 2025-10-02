export const SORT_OPTIONS = [
    { value: 'rating:desc', label: 'דירוג מגבוה לנמוך' },
    { value: 'rating:asc', label: 'דירוג מנמוך לגבוה' },
    { value: 'votes:desc', label: 'מס׳ הצבעות מגבוה לנמוך' },
    { value: 'releaseDate:desc', label: 'חדשים' },
    { value: 'releaseDate:asc', label: 'ישנים' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export type GenreOption = { id: number; name: string };
