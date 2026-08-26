import "server-only";

import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import Parser from "rss-parser";
import { translateMany, needsTranslation } from "@/lib/translate";
import type { ContentBlock } from "@/lib/content/ugc";
import { CURATED_RSS_SOURCES, type CuratedRssSource } from "@/lib/editorial/rss-sources";

export type Article = {
  id: string;
  slug?: string;
  content_type?: string;
  title: string;
  excerpt: string;
  content?: string;
  content_blocks?: ContentBlock[];
  cover_image?: string;
  source_url: string;
  source_name: string;
  category: string;
  region?: "kuzey" | "guney" | "dunya" | "en";
  lang?: "tr" | "el" | "en";
  published_at: string;
  is_ugc: boolean;
  author?: string;
  original_source_url?: string;
  ad_eligible?: boolean;
  social_ready?: boolean;
  content_version?: number;
};

const parser = new Parser({
  customFields: {
    item: [["media:content", "mediaContent", { keepArray: false }], ["enclosure", "enclosure"]],
  },
});

const MAX_RSS_BYTES = 2 * 1024 * 1024;

async function readBoundedFeed(response: Response): Promise<string> {
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_RSS_BYTES) throw new Error("rss_feed_too_large");
  if (!response.body) throw new Error("rss_feed_missing");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let xml = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > MAX_RSS_BYTES) throw new Error("rss_feed_too_large");
      xml += decoder.decode(value, { stream: true });
    }
    return xml + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

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

function httpsImageUrl(value: string | undefined): string | undefined {
  if (!value || value.length > 2_000) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return undefined;
    url.username = "";
    url.password = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

function httpsArticleUrl(value: string | undefined): string | undefined {
  if (!value || value.length > 2_000) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return undefined;
    url.username = "";
    url.password = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

export type NewsSource = CuratedRssSource;

// The live stream carries only Turkish, attributed local headlines. Foreign
// sources are deliberately kept in the private editorial queue: a raw
// translation is neither an Ugavole article nor a useful SEO result.
export const NEWS_SOURCES: NewsSource[] = CURATED_RSS_SOURCES.filter(
  (source) => source.lang === "tr" && source.use === "link_only"
);

async function fetchRSSFeed(source: NewsSource): Promise<Article[]> {
  try {
    const response = await fetch(source.url, {
      cache: "no-store",
      headers: { Accept: "application/rss+xml, application/xml, text/xml;q=0.9" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return [];
    const feed = await parser.parseString(await readBoundedFeed(response));
    const items = (feed.items.slice(0, source.limit ?? 15) as RSSItem[])
      .flatMap((item) => {
        const sourceUrl = httpsArticleUrl(item.link);
        return sourceUrl ? [{ item, sourceUrl }] : [];
      });

    const shouldTranslate = needsTranslation("", source.lang);

    // Başlık + özet çiftlerini tek seferde paralel çevir
    const texts = items.flatMap(({ item }) => [
      item.title ?? "Başlıksız",
      (item.contentSnippet ?? "").slice(0, 200),
    ]);

    const translated = shouldTranslate ? await translateMany(texts) : texts;

    return items.map(({ item, sourceUrl }, index: number) => {
      const image = httpsImageUrl(
        item.enclosure?.url ||
        item.mediaContent?.$?.url ||
        extractImageFromContent(item.content ?? "") ||
        undefined
      );

      return {
        id: createHash("sha256")
          .update(`${source.name}\u0000${sourceUrl}`)
          .digest("hex")
          .slice(0, 24),
        title: translated[index * 2] || item.title || "Başlıksız",
        excerpt: translated[index * 2 + 1] || "",
        cover_image: image,
        source_url: sourceUrl,
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
async function fetchHeadlinesUncached(region?: "kuzey" | "guney" | "dunya" | "en"): Promise<Article[]> {
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

const fetchHeadlinesCached = unstable_cache(
  fetchHeadlinesUncached,
  ["ugavole-rss-headlines-v2"],
  { revalidate: 300 }
);

export async function fetchHeadlines(
  region?: "kuzey" | "guney" | "dunya" | "en"
): Promise<Article[]> {
  return fetchHeadlinesCached(region);
}

function extractImageFromContent(content: string): string | null {
  const match = content.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

async function fetchAllNewsUncached(): Promise<Article[]> {
  const { listPublishedArticles } = await import("@/lib/data/content");

  const [rssResults, ugavolePosts] = await Promise.all([
    Promise.allSettled(NEWS_SOURCES.map((source) => fetchRSSFeed(source))),
    listPublishedArticles().catch(() => [] as Article[]),
  ]);

  const articles: Article[] = [...ugavolePosts];
  for (const result of rssResults) {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    }
  }

  return articles.sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

const fetchAllNewsCached = unstable_cache(
  fetchAllNewsUncached,
  ["ugavole-all-news-v2"],
  { revalidate: 900 }
);

export async function fetchAllNews(): Promise<Article[]> {
  return fetchAllNewsCached();
}
