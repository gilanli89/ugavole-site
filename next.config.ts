import type { NextConfig } from "next";

// Mevcut sayfalar — redirect'ten muaf tutulacak
const RESERVED = [
  "api",
  "admin",
  "giris",
  "mfa",
  "haberler",
  "harita",
  "sozluk",
  "eczaneler",
  "doviz",
  "hava-durumu",
  "kategori",
  "haber",
  "haber-yukle",
  "hakkimizda",
  "iletisim",
  "gizlilik",
  "kullanim-kosullari",
  "cerez-politikasi",
  "gun-batimi",
  "quiz",
  "spor",
  "sosyal-medya",
  "guncel",
  "liste",
  "_next",
  "favicon.ico",
  "ads.txt",
  "adsense-logo.png",
  "adsense-logo.svg",
  "logo.svg",
  "og.jpg",
  "og-default.png",
  "opengraph-image",
  "icon",
  "sitemap.xml",
  "robots.txt",
];

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://*.googlesyndication.com https://*.doubleclick.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com https://www.google-analytics.com https://*.google-analytics.com https://pagead2.googlesyndication.com",
  "frame-src https://challenges.cloudflare.com https://*.doubleclick.net https://*.googlesyndication.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // External editorial/RSS URLs are rendered directly. The server must never
    // become an open image-fetch proxy for user-controlled hosts.
    unoptimized: true,
    dangerouslyAllowLocalIP: false,
    maximumRedirects: 0,
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
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
        ],
      },
    ];
  },
};

export default nextConfig;
