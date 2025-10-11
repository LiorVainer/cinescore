import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Point to the correct request configuration file
const withNextIntl = createNextIntlPlugin({
    requestConfigPath: './src/i18n/request.ts',
    experimental: {
        // Enable automatic type generation for your message files
        createMessagesDeclaration: './messages/en.json'
    }
});

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        typedEnv: true,
        serverComponentsExternalPackages: ['@prisma/client'],
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
                port: '',
                pathname: '/vi/**',
            },
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
                port: '',
                pathname: '/t/p/**', // TMDB poster/backdrop paths
            },
        ],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: [
                {
                    loader: "@svgr/webpack",
                    options: {
                        icon: true,
                    },
                },
            ],
        });
        return config;
    },
};

export default withNextIntl(nextConfig);
