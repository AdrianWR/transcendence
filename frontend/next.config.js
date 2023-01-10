/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    GAME_GATEWAY_HOST: process.env.GAME_GATEWAY_HOST,
    GAME_GATEWAY_PORT: process.env.GAME_GATEWAY_PORT
  }
}

module.exports = nextConfig
