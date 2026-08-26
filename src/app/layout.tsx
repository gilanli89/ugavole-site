import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { ConsentProvider } from "@/components/privacy/ConsentProvider";
import { serializeJsonLd, websiteSchema, siteLinksSearchBoxSchema } from "@/lib/seo";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-ugavole-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-ugavole-editorial",
  display: "swap",
});

const BASE = "https://ugavole.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "ugavole · Kıbrıs'ın En Eğlenceli Köşesi",
    template: "%s · ugavole",
  },
  description:
    "Kıbrıs'ın en eğlenceli köşesi. Güncel haberler, Kıbrıslıca sözlük, anlık harita, hava durumu ve döviz kurları.",
  keywords: ["KKTC", "Kuzey Kıbrıs", "Kıbrıs haberleri", "Kıbrıslıca", "ugavole", "haber", "gündem", "hava durumu", "döviz", "eczane"],
  authors: [{ name: "ugavole", url: BASE }],
  creator: "ugavole",
  publisher: "ugavole",
  openGraph: {
    siteName: "ugavole",
    locale: "tr_TR",
    type: "website",
    url: BASE,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "ugavole — Adanın merak uyandıran hikâyeleri burada.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: process.env.NEXT_PUBLIC_X_HANDLE || undefined,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION?.trim() ||
      "ZU0sW7l6QpNf5AvXqoEoalnOSZhMtJm13rNIbh7ThZw",
  },
  other: {
    "google-adsense-account": "ca-pub-7117498587512923",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${manrope.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        {/* JSON-LD: WebSite schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteSchema()) }}
        />
        {/* JSON-LD: SiteLinksSearchBox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteLinksSearchBoxSchema()) }}
        />
      </head>
      <body className="bg-ugavole-bg min-h-screen font-sans" suppressHydrationWarning>
        <ConsentProvider>
          <ThemeProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ThemeProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
