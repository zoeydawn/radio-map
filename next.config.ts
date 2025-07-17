import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    // Whitelist your own application's domain for image optimization.
    // When you deploy, this would be your production domain (e.g., 'your-app-name.vercel.app').
    // For local development, 'localhost' is usually sufficient.
    remotePatterns: [
      {
        protocol: 'http', // Use 'http' for local dev, 'https' for production
        hostname: 'localhost',
        port: '3000', // Or whatever port your Next.js app runs on
        pathname: '/api/image-proxy/**', // Be specific about the path
      },
      // If you deploy to Vercel, for example, your hostname would be something like:
      // {
      //   protocol: 'https',
      //   hostname: 'your-app-name.vercel.app',
      //   port: '',
      //   pathname: '/api/image-proxy/**',
      // },
      // You might also add your actual production domain here:
      // {
      //   protocol: 'https',
      //   hostname: 'www.your-production-domain.com',
      //   port: '',
      //   pathname: '/api/image-proxy/**',
      // },
    ],
  },
}

export default nextConfig
