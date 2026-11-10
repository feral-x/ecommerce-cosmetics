import type { NextConfig } from 'next'

/** Hosts from Makeup API `image_link` / `api_featured_image` (+ wildcards for CDN). */
const remoteImageHosts = [
  'images.unsplash.com',
  'cdn.shopify.com',
  's3.amazonaws.com',
  '3bc01d2807fb1bc0d25c-a86d2521f1af8989841b9619f5314be5.ssl.cf1.rackcdn.com',
  'd3t32hsnjxo7q6.cloudfront.net',
  'imancosmetics.com',
  'static-assets.glossier.com',
  'www.benefitcosmetics.com',
  'www.clinique.com',
  'www.dior.com',
  'www.fentybeauty.com',
  'www.nyxcosmetics.com',
  'www.purpicks.com',
  'www.smashbox.com',
  '**.rackcdn.com',
  '**.cloudfront.net',
] as const

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: remoteImageHosts.map((hostname) => ({
      protocol: 'https' as const,
      hostname,
      pathname: '/**',
    })),
    /**
     * Clash / similar VPN often resolve CDNs to 198.18.x.x (fake-ip).
     * Next 16+ then refuses to optimize remote images (SSRF guard).
     * Dev-only; public DNS on deploy does not need this.
     */
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
  },
  /**
   * Cursor / LAN / tunnel: иначе HMR WebSocket блокируется (Next 16+),
   * страница может «вечно» висеть на loader при постоянных remount.
   */
  allowedDevOrigins: ['10.0.85.1', '127.0.0.1', 'localhost'],
}

export default nextConfig
