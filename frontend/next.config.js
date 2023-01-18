/** @type {import('next').NextConfig} */

const rewrites = async () => {
  return [
    {
      source: '/api/:path*',
      destination: `${process.env.BACKEND_URL}/:path*`, // The :path parameter is used here so will not be automatically passed in the query
    },
  ]
}

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  rewrites: rewrites
}

module.exports = nextConfig
