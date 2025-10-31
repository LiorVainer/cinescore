import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['he', 'en'],
    defaultLocale: 'he',
    localePrefix: 'always', // This ensures all routes have locale prefixes
});

export const config = {
    // Only match locale paths, exclude root
    matcher: ['/(he|en)/:path*'],
};
