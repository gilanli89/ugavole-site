import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { ConsentProvider } from "@/components/privacy/ConsentProvider";
import { serializeJsonLd, websiteSchema, siteLinksSearchBoxSchema } from "@/lib/seo";

const geist = Geist({ subsets: ["latin"] });

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
  },
  twitter: {
    card: "summary_large_image",
    site: process.env.NEXT_PUBLIC_X_HANDLE || undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
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
      <body className={`${geist.className} bg-ugavole-bg min-h-screen`} suppressHydrationWarning>
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
