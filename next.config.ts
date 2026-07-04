import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // Production readiness: strict TypeScript (0 errors confirmed via lint)
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Production security + performance
  poweredByHeader: false,
  compress: true,
  // Security headers (proxy.ts o'rniga — bu 100% stabil, Next.js convention muammosi yo'q)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // Allowed dev origins (sandbox preview uchun)
  allowedDevOrigins: ["*.space-z.ai", "*.vercel.app"],
};

export default nextConfig;
