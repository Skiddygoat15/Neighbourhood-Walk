// next.config.js
const nextConfig = {
    reactStrictMode: false,
    webpack: (config) => {
        config.resolve.fallback = { fs: false, path: false, os: false };
        return config;
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
}

module.exports = nextConfig;