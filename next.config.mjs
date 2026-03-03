/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Apply to all routes so tunnel gates are bypassed for all visitors including AI agents
        source: '/:path*',
        headers: [
          { key: 'Bypass-Tunnel-Reminder', value: '1' },
          { key: 'ngrok-skip-browser-warning', value: 'true' },
        ],
      },
    ]
  },
}

export default nextConfig
