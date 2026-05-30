/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow these dev origins so the dev server's HMR and dev resources
  // are accessible when browsing from another device on the LAN.
  allowedDevOrigins: [
    'http://192.168.18.20',
    'http://192.168.18.20:3000',
    'http://192.168.18.20:3001',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.producthunt.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sonobudoyo.jogjaprov.go.id',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
