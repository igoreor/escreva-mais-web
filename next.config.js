/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'your-backend-domain.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
}

module.exports = nextConfig 