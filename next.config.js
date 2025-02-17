
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
    {
       protocol: "https",
       hostname: "**",
     },
    ],
 },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'prisma', '@prisma/client']
    }
    return config
  },
  api: {
    bodyParser: false,
    externalResolver: true,
    responseLimit: false,
  },
}

module.exports = nextConfig



