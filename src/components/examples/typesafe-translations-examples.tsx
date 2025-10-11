import {useTranslations, useFormatter} from 'next-intl';

/**
 * Example component demonstrating all typesafe translation features with next-intl
 */
export function TypesafeTranslationExamples() {
    // ✅ Namespace-scoped translations - TypeScript will validate 'nav' exists
    const tNav = useTranslations('nav');

    // ✅ Different namespace - TypeScript validates 'search' exists
    const tSearch = useTranslations('search');

    // ✅ Dates namespace with ICU message format
    const tDates = useTranslations('dates');

    // ✅ Rating namespace with plural support
    const tRating = useTranslations('rating');

    // ✅ Access to all translations (no namespace)
    const tGlobal = useTranslations();

    // ✅ Formatter for dates, numbers, lists
    const format = useFormatter();

    return (
        <div className="space-y-4">
            {/* ✅ Simple translations - keys are validated */}
            <h1>{tNav('title')}</h1>
            <p>{tSearch('placeholder')}</p>

            {/* ✅ ICU message with arguments - TypeScript infers required arguments */}
            <p>{tRating('votes', {count: 1250})}</p>

            {/* ✅ Plural messages - automatically handles singular/plural */}
            <p>{tDates('daysAgo', {count: 1})}</p>    {/* "1 day ago" */}
            <p>{tDates('daysAgo', {count: 5})}</p>    {/* "5 days ago" */}

            {/* ✅ Access nested keys with dot notation */}
            <p>{tGlobal('app.title')}</p>
            <p>{tGlobal('movie.details')}</p>

            {/* ✅ Formatted dates and numbers */}
            <p>{format.dateTime(new Date(), {dateStyle: 'medium'})}</p>
            <p>{format.number(1250, {style: 'currency', currency: 'USD'})}</p>

            {/* ❌ These would cause TypeScript errors: */}
            {/*
            {tNav('nonExistentKey')}  // Error: Key doesn't exist
            {tRating('votes', {})}    // Error: Missing required 'count' argument
            {tDates('daysAgo', {wrongArg: 1})} // Error: Wrong argument name
            */}
        </div>
    );
}

/**
 * Example with conditional translations and error handling
 */
export function ConditionalTranslationExample({userCount}: { userCount: number }) {
    const t = useTranslations('dates');

    // ✅ Conditional translations with proper typing
    const getTimeMessage = (count: number) => {
        if (count === 0) return "Today";
        if (count === 1) return t('daysAgo', {count: 1});
        if (count < 7) return t('daysAgo', {count});
        if (count < 30) return t('weeksAgo', {count: Math.floor(count / 7)});
        return t('monthsAgo', {count: Math.floor(count / 30)});
    };

    return <span>{getTimeMessage(userCount)}</span>;
}

/**
 * Example with rich text formatting
 */
export function RichTextExample() {
    const t = useTranslations();

    // If you had rich text in your messages like:
    // "welcome": "Welcome <bold>{name}</bold>!"

    return (
        <div>
            {/* ✅ Rich text with validated arguments */}
            {t.rich('welcome', {
                name: 'John',
                bold: (chunks) => <strong>{chunks}</strong>
            })}
        </div>
    );
}
