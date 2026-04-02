import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { websiteSchema, siteLinksSearchBoxSchema } from "@/lib/seo";

const geist = Geist({ subsets: ["latin"] });

const BASE = "https://ugavole.com";
const GTM_ID = "GTM-K6SM8M5";

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
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "ugavole" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ugavole",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: BASE },
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
        {/* Google Tag Manager */}
        {GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
        {/* End Google Tag Manager */}

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4684248498671746"
          crossOrigin="anonymous"
        />
        {/* End Google AdSense */}

        {/* JSON-LD: WebSite schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
        {/* JSON-LD: SiteLinksSearchBox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLinksSearchBoxSchema()) }}
        />
      </head>
      <body className={`${geist.className} bg-ugavole-bg min-h-screen`} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}

        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
