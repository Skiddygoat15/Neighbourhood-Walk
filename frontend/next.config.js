// next.config.js
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false, path: false, os: false };
        return config;
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
}

module.exports = nextConfig;