/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    transpilePackages: ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
    experimental: {
        esmExternals: 'loose',
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },
}

module.exports = nextConfig
