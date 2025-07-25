import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true, // so that we can proxy .svg images
    // so that our immage proxy works
    // For development env:
    remotePatterns: [
      {
        protocol: 'http', // Use 'http' for local dev, 'https' for production
        hostname: 'localhost',
        port: '3000', // Or whatever port your Next.js app runs on
        pathname: '/api/image-proxy/**', // Be specific about the path
      },
      // For our Vercel deployment:
      {
        protocol: 'https',
        hostname: 'radio-map-eosin.vercel.app',
        port: '',
        pathname: '/api/image-proxy/**',
      },
      // production domain:
      {
        protocol: 'https',
        hostname: 'radio-map.com',
        port: '',
        pathname: '/api/image-proxy/**',
      },
    ],
  },
}

export default nextConfig
