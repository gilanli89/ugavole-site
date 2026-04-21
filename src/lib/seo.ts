import type { Metadata } from "next";

const BASE_URL = "https://ugavole.com";
const SITE_NAME = "ugavole";
const DEFAULT_OG_IMAGE = "https://ugavole.com/og-default.png";

export function buildMetadata({
  title,
  description,
  path = "/",
  ogImage,
  type = "website",
  publishedAt,
  author,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  type?: "website" | "article";
  publishedAt?: string;
  author?: string;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "tr_TR",
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

// JSON-LD şemaları
export function articleSchema({
  title,
  description,
  url,
  image,
  publishedAt,
  author = "ugavole",
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: "ugavole",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    ...(image && { image: { "@type": "ImageObject", url: image } }),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    description: "Kıbrıs'ın en eğlenceli köşesi. Güncel haberler, quiz, Kıbrıslıca sözlük, anlık harita.",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/haberler?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function siteLinksSearchBoxSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/haberler?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function siteNavigationSchema() {
  const navItems = [
    { name: "Haberler",            url: `${BASE_URL}/haberler`          },
    { name: "Quiz",                url: `${BASE_URL}/quiz`              },
    { name: "Kıbrıslıca Sözlük",   url: `${BASE_URL}/sozluk`            },
    { name: "Anlık Harita",        url: `${BASE_URL}/harita`            },
    { name: "Gün Batımı",          url: `${BASE_URL}/gun-batimi`        },
    { name: "Spor Haberleri",      url: `${BASE_URL}/kategori/spor`     },
    { name: "Kültür Haberleri",    url: `${BASE_URL}/kategori/kultur`   },
    { name: "Nöbetçi Eczaneler",   url: `${BASE_URL}/eczaneler`         },
    { name: "Döviz Kurları",       url: `${BASE_URL}/doviz`             },
    { name: "Hava Durumu",         url: `${BASE_URL}/hava-durumu`       },
  ];

  return navItems.map((item) => ({
    "@context": "https://schema.org",
    "@type": "SiteLinksSearchBox",
    url: item.url,
    name: item.name,
  }));
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
