/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'youthful-frog-508.convex.cloud',
                hostname: 'youthful-frog-508.convex.site',
            }
        ],
    }
};

export default nextConfig;
