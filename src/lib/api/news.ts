import Parser from "rss-parser";
import { translateMany, needsTranslation } from "@/lib/translate";

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  cover_image?: string;
  source_url: string;
  source_name: string;
  category: string;
  region?: "kuzey" | "guney" | "dunya" | "en";
  lang?: "tr" | "el" | "en";
  published_at: string;
  is_ugc: boolean;
  author?: string;
};

const parser = new Parser({
  customFields: {
    item: [["media:content", "mediaContent", { keepArray: false }], ["enclosure", "enclosure"]],
  },
});

type RSSItem = {
  title?: string;
  link?: string;
  contentSnippet?: string;
  content?: string;
  isoDate?: string;
  pubDate?: string;
  enclosure?: { url?: string };
  mediaContent?: { $?: { url?: string } };
};

export type NewsSource = {
  name: string;
  url: string;
  category: string;
  region: "kuzey" | "guney" | "dunya" | "en";
  lang: "tr" | "el" | "en";
  limit?: number;
};

export const NEWS_SOURCES: NewsSource[] = [
  // ── KUZEY KIBRIS (Türkçe) ───────────────────────────────────
  { name: "Havadis Kıbrıs",   url: "https://www.havadiskibris.com/feed",  category: "Gündem", region: "kuzey", lang: "tr" },
  { name: "Kıbrıs Gazetesi",  url: "https://kibrisgazetesi.com/feed",     category: "Gündem", region: "kuzey", lang: "tr" },
  { name: "Detay Kıbrıs",     url: "https://www.detaykibris.com/rss",     category: "Gündem", region: "kuzey", lang: "tr" },
  { name: "Yeni Düzen",       url: "https://www.yeniduzen.com/rss",       category: "Gündem", region: "kuzey", lang: "tr" },

  // ── GÜNEY KIBRIS (İngilizce) ───────────────────────────────
  { name: "Cyprus Mail",      url: "https://cyprus-mail.com/feed",        category: "Gündem", region: "guney", lang: "en" },
  { name: "In-Cyprus",        url: "https://www.in-cyprus.com/feed",      category: "Gündem", region: "guney", lang: "en" },

  // ── GÜNEY KIBRIS (Rumca) ───────────────────────────────────
  { name: "Politis",          url: "https://www.politis.com.cy/feed",     category: "Gündem", region: "guney", lang: "el" },
  { name: "Philenews",        url: "https://www.philenews.com/rss",       category: "Gündem", region: "guney", lang: "el" },
  { name: "Reporter CY",      url: "https://www.reporter.com.cy/feed",    category: "Gündem", region: "guney", lang: "el" },

  // ── DÜNYA (İngilizce) ─────────────────────────────────────
  { name: "BBC World",        url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "Dünya", region: "dunya", lang: "en", limit: 10 },
  { name: "Reuters",          url: "https://feeds.reuters.com/reuters/topNews",   category: "Dünya", region: "dunya", lang: "en", limit: 10 },
];

async function fetchRSSFeed(source: NewsSource): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const items = feed.items.slice(0, source.limit ?? 15) as RSSItem[];

    const shouldTranslate = needsTranslation("", source.lang);

    // Başlık + özet çiftlerini tek seferde paralel çevir
    const texts = items.flatMap((item) => [
      item.title ?? "Başlıksız",
      (item.contentSnippet ?? "").slice(0, 200),
    ]);

    const translated = shouldTranslate ? await translateMany(texts) : texts;

    return items.map((item: RSSItem, index: number) => {
      const image =
        item.enclosure?.url ||
        item.mediaContent?.$?.url ||
        extractImageFromContent(item.content ?? "") ||
        undefined;

      return {
        id: `${source.name}-${index}-${Date.now()}`,
        title: translated[index * 2] || item.title || "Başlıksız",
        excerpt: translated[index * 2 + 1] || "",
        cover_image: image,
        source_url: item.link ?? "",
        source_name: source.name,
        category: source.category,
        region: source.region,
        lang: source.lang,
        published_at: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        is_ugc: false,
      };
    });
  } catch {
    return [];
  }
}

// Sadece başlıklar için hafif endpoint
export async function fetchHeadlines(region?: "kuzey" | "guney" | "dunya" | "en"): Promise<Article[]> {
  const sources = region
    ? NEWS_SOURCES.filter((s) => s.region === region)
    : NEWS_SOURCES;

  const results = await Promise.allSettled(
    sources.map((s) => fetchRSSFeed({ ...s, limit: 8 }))
  );

  const articles: Article[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") articles.push(...r.value);
  }

  return articles.sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

function extractImageFromContent(content: string): string | null {
  const match = content.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

export async function fetchAllNews(): Promise<Article[]> {
  const { fetchWordPressPosts } = await import("./wordpress");

  const [rssResults, wpPosts] = await Promise.all([
    Promise.allSettled(NEWS_SOURCES.map((source) => fetchRSSFeed(source))),
    fetchWordPressPosts().catch(() => [] as Article[]),
  ]);

  const articles: Article[] = [...wpPosts];
  for (const result of rssResults) {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    }
  }

  return articles.sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}
