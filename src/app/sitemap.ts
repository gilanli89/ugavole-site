import { MetadataRoute } from "next";
import { listPublishedArticles } from "@/lib/data/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statik: MetadataRoute.Sitemap = [
    { url: "https://ugavole.com",                       priority: 1.0, changeFrequency: "daily"   },
    { url: "https://ugavole.com/haberler",              priority: 0.9, changeFrequency: "hourly"  },
    { url: "https://ugavole.com/spor",                  priority: 0.8, changeFrequency: "daily"   },
    { url: "https://ugavole.com/guncel",                priority: 0.9, changeFrequency: "hourly"  },
    { url: "https://ugavole.com/guncel/doviz",          priority: 0.8, changeFrequency: "hourly"  },
    { url: "https://ugavole.com/guncel/eczaneler",      priority: 0.8, changeFrequency: "daily"   },
    { url: "https://ugavole.com/guncel/hava-durumu",    priority: 0.8, changeFrequency: "hourly"  },
    { url: "https://ugavole.com/guncel/burclar",        priority: 0.7, changeFrequency: "daily"   },
    { url: "https://ugavole.com/harita",                priority: 0.8, changeFrequency: "hourly"  },
    { url: "https://ugavole.com/oyunlar",               priority: 0.8, changeFrequency: "weekly"  },
    { url: "https://ugavole.com/quiz",                  priority: 0.8, changeFrequency: "weekly"  },
    { url: "https://ugavole.com/quiz/kibrislica",       priority: 0.7, changeFrequency: "weekly"  },
    { url: "https://ugavole.com/quiz/sehir",            priority: 0.7, changeFrequency: "weekly"  },
    { url: "https://ugavole.com/sozluk",                priority: 0.8, changeFrequency: "weekly"  },
    { url: "https://ugavole.com/gun-batimi",            priority: 0.8, changeFrequency: "daily"   },
    { url: "https://ugavole.com/sosyal-medya",          priority: 0.5, changeFrequency: "weekly"  },
    { url: "https://ugavole.com/hakkimizda",            priority: 0.4, changeFrequency: "monthly" },
    { url: "https://ugavole.com/iletisim",              priority: 0.4, changeFrequency: "monthly" },
    { url: "https://ugavole.com/gizlilik",              priority: 0.3, changeFrequency: "monthly" },
    { url: "https://ugavole.com/kullanim-kosullari",    priority: 0.3, changeFrequency: "monthly" },
  ];

  const published = await listPublishedArticles().catch(() => []);
  const contentUrls: MetadataRoute.Sitemap = published.flatMap((item) =>
    item.slug
      ? [{
          url: `https://ugavole.com/haber/${item.slug}`,
          lastModified: new Date(item.published_at),
          priority: item.content_type === "list" ? 0.7 : 0.6,
          changeFrequency: "weekly" as const,
        }]
      : []
  );

  return [...statik, ...contentUrls];
}
