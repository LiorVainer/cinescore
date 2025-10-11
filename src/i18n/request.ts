import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
    // Debug logging
    console.log('Request config received locale:', locale);

    // If locale is undefined, default to 'he'
    const validLocale = locale || 'he';
    console.log('Using locale:', validLocale);

    return {
        locale: validLocale, // ✅ MUST return the locale
        messages: (await import(`../../messages/${validLocale}.json`)).default
    };
});
