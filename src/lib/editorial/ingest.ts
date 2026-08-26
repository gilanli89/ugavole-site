import "server-only";

import { createHash } from "node:crypto";
import Parser from "rss-parser";
import { createContentSlug } from "@/lib/content/ugc";
import { createAdminClient } from "@/lib/supabase/admin";
import { CURATED_RSS_SOURCES, EDITORIAL_DRAFT_SOURCE_IDS, type CuratedRssSource } from "./rss-sources";
import { createEditorialDraft } from "./draft";

const MAX_RSS_BYTES = 2 * 1024 * 1024;

type FeedItem = {
  title?: string;
  link?: string;
  contentSnippet?: string;
  content?: string;
  isoDate?: string;
  pubDate?: string;
};

const parser = new Parser<unknown, FeedItem>();

function safeHttpsUrl(value: string | undefined): string | null {
  if (!value || value.length > 2_000) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    url.username = "";
    url.password = "";
    return url.toString();
  } catch {
    return null;
  }
}

function text(value: string | undefined, max: number): string {
  return (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

async function readBoundedFeed(response: Response): Promise<string> {
  const declared = Number(response.headers.get("content-length") ?? 0);
  if (declared > MAX_RSS_BYTES || !response.body) throw new Error("rss_feed_too_large");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let xml = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_RSS_BYTES) throw new Error("rss_feed_too_large");
      xml += decoder.decode(value, { stream: true });
    }
    return xml + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

async function loadItems(source: CuratedRssSource): Promise<FeedItem[]> {
  const response = await fetch(source.url, {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml;q=0.9",
      "User-Agent": "UgavoleEditorialBot/1.0 (+https://ugavole.com)",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) return [];
  const feed = await parser.parseString(await readBoundedFeed(response));
  return feed.items.slice(0, source.limit ?? 6);
}

export type EditorialIngestSummary = {
  scanned: number;
  drafted: number;
  skipped: number;
  errors: number;
};

/**
 * Imports at most `maxDrafts` new, review-only source briefs.  It intentionally
 * never downloads a publisher article page or image, so a feed cannot turn into
 * a silent republishing pipeline.
 */
export async function ingestEditorialDrafts(maxDrafts: number): Promise<EditorialIngestSummary> {
  const eligibleSources = CURATED_RSS_SOURCES.filter((source) => EDITORIAL_DRAFT_SOURCE_IDS.has(source.id));
  const summary: EditorialIngestSummary = { scanned: 0, drafted: 0, skipped: 0, errors: 0 };
  const supabase = createAdminClient();

  for (const source of eligibleSources) {
    if (summary.drafted >= maxDrafts) break;

    let items: FeedItem[];
    try {
      items = await loadItems(source);
    } catch {
      summary.errors += 1;
      continue;
    }

    for (const item of items) {
      if (summary.drafted >= maxDrafts) break;
      summary.scanned += 1;

      const sourceUrl = safeHttpsUrl(item.link);
      const sourceTitle = text(item.title, 300);
      const sourceSummary = text(item.contentSnippet ?? item.content, 1_500);
      if (!sourceUrl || !sourceTitle || !sourceSummary) {
        summary.skipped += 1;
        continue;
      }

      const { data: existing, error: existingError } = await supabase
        .from("content_items")
        .select("id")
        .eq("origin", "editorial")
        .eq("source_url", sourceUrl)
        .limit(1);
      if (existingError) {
        summary.errors += 1;
        continue;
      }
      if ((existing ?? []).length > 0) {
        summary.skipped += 1;
        continue;
      }

      const draft = await createEditorialDraft({
        sourceName: source.name,
        sourceUrl,
        sourceTitle,
        sourceSummary,
        category: source.category,
      });
      if (!draft) {
        summary.skipped += 1;
        continue;
      }

      const suffix = createHash("sha256").update(sourceUrl).digest("hex").slice(0, 8);
      const publishedAt = new Date(item.isoDate ?? item.pubDate ?? Date.now());
      const { error: insertError } = await supabase.from("content_items").insert({
        slug: createContentSlug(draft.title, suffix),
        type: "article",
        origin: "editorial",
        title: draft.title,
        excerpt: draft.excerpt,
        body: { version: 1, blocks: draft.blocks },
        category: source.category,
        source_url: sourceUrl,
        author_name: "Ugavole Editörleri",
        status: "pending",
        ad_status: "off",
        social_status: "off",
        created_at: Number.isNaN(publishedAt.getTime()) ? new Date().toISOString() : publishedAt.toISOString(),
      });

      if (insertError) {
        summary.errors += 1;
      } else {
        summary.drafted += 1;
      }
    }
  }

  return summary;
}
