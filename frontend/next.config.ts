import type { NextConfig } from "next";
module.exports = {
    async rewrites() {
        return [
            { source: '/learn-more', destination: '/pages/learn-more' },
            { source: '/try-model', destination: '/pages/try-model' },
            { source: '/contact', destination: '/pages/contact' },
            { source: '/minigame', destination: '/pages/minigame' },
        ];
    },
};

const nextConfig: NextConfig = {

  /* config options here */
};

export default nextConfig;
