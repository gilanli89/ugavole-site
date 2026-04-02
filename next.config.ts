import type { NextConfig } from "next";

// Mevcut sayfalar — redirect'ten muaf tutulacak
const RESERVED = [
  "api",
  "admin",
  "haberler",
  "harita",
  "sozluk",
  "eczaneler",
  "doviz",
  "hava-durumu",
  "kategori",
  "haber",
  "haber-yukle",
  "gizlilik",
  "iletisim",
  "spor",
  "sosyal-medya",
  "guncel",
  "_next",
  "favicon.ico",
  "og-default.png",
  "sitemap.xml",
  "robots.txt",
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async redirects() {
    // Regex: rezerve edilmemiş tüm root-level slug'lar → /haberler
    const reservedPattern = RESERVED.join("|");
    return [
      // www → non-www
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ugavole.com" }],
        destination: "https://ugavole.com/:path*",
        permanent: true,
      },
      // /spor → /kategori/spor
      {
        source: "/spor",
        destination: "/kategori/spor",
        permanent: true,
      },
      // Eski WordPress slug'ları → /haberler (302, juice kaybetmez)
      {
        source: `/:slug((?!${reservedPattern})(?!_)[^/]+)`,
        destination: "/haberler",
        permanent: false,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
