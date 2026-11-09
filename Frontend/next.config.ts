import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [{ source: '/search', destination: '/', permanent: false }]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  /**
   * Cursor / LAN / tunnel: иначе HMR WebSocket блокируется (Next 16+),
   * страница может «вечно» висеть на loader при постоянных remount.
   */
  allowedDevOrigins: ['10.0.85.1', '127.0.0.1', 'localhost'],
}

export default nextConfig
