import { Metadata } from 'next';

const VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? Date.now().toString();

export async function generateMetadata(): Promise<Metadata> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://starzi.app';
    const title = 'Starzi';
    const description =
        'Starzi helps you discover which movies are truly worth watching. Follow your favorite actors, track ratings, and get alerts when great new films hit cinemas.';
    const ogImageWide = `${siteUrl}/og.png?v=${VERSION}`;
    const ogImageSquare = `${siteUrl}/og-square.png?v=${VERSION}`;
    return {
        title,
        description,
        metadataBase: new URL(siteUrl),
        openGraph: {
            type: 'website',
            url: siteUrl,
            title,
            description,
            siteName: 'Starzi',
            locale: 'en_US',
            images: [
                {
                    url: ogImageWide,
                    width: 1200,
                    height: 630,
                    alt: 'Starzi – Discover what movies are worth your time',
                    type: 'image/png',
                },
                {
                    url: ogImageSquare,
                    width: 1200,
                    height: 1200,
                    alt: 'Starzi – Discover what movies are worth your time (WhatsApp)',
                    type: 'image/png',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [
                {
                    url: ogImageWide,
                    alt: 'Starzi preview image',
                },
            ],
        },
    };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return children;
}
