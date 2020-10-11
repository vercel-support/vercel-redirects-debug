const path = require('path');
const withOptimizedImages = require('next-optimized-images');
const withOffline = require('next-offline');
const redirects = require('./redirects.json');

const nextConfig = {
    target: 'serverless',
    workboxOpts: {
        runtimeCaching: [
            {
                urlPattern: /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'images',
                    expiration: {
                        maxAgeSeconds: 30 * 24 * 60 * 60,
                        maxEntries: 30,
                    },
                },
            },
            {
                urlPattern: /^https:\/\/storage\.googleapis\.com/,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'public-assets',
                    expiration: {
                        maxAgeSeconds: 30 * 24 * 60 * 60,
                        maxEntries: 200,
                    },
                },
            },
            {
                urlPattern: /^https:\/\/fonts\.gstatic\.com/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'google-fonts-webfonts',
                    expiration: {
                        maxAgeSeconds: 60 * 60 * 24 * 365,
                        maxEntries: 30,
                    },
                },
            },
        ],
    },
    webpack: config => {
        config.resolve.alias.components = path.join(__dirname, 'components');
        config.resolve.alias.containers = path.join(__dirname, 'containers');
        config.resolve.alias.helpers = path.join(__dirname, 'helpers');
        config.resolve.alias.hocs = path.join(__dirname, 'hocs');
        config.resolve.alias.brandConfig = path.join(__dirname, 'brandConfig');
        config.resolve.alias.providers = path.join(__dirname, 'providers');
        config.resolve.alias.listeners = path.join(__dirname, 'listeners');
        config.resolve.alias.public = path.join(__dirname, 'public');
        config.resolve.alias.store = path.join(__dirname, 'store');
        config.resolve.alias.images = path.join(__dirname, 'images');
        config.resolve.alias.gql = path.join(__dirname, 'gql');

        return config;
    },
    async redirects() {
        return redirects;
    },
    async rewrites() {
        return [
            {
                source: '/service-worker.js',
                destination: '/_next/static/service-worker.js',
            },
        ];
    },
};

module.exports = () => {
    return withOffline(withOptimizedImages(nextConfig));
};
