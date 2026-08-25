import "server-only";

import { cache } from "react";
import type { Article } from "@/lib/api/news";
import { LOCAL_ARTICLES } from "@/lib/api/local-articles";
import type { ContentBlock } from "@/lib/content/ugc";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";

type ContentRow = {
  id: string;
  slug: string;
  type: string;
  title: string;
  excerpt: string;
  body: { version?: number; blocks?: unknown[] } | null;
  cover_image_url: string | null;
  category: string;
  source_url: string | null;
  author_name: string;
  origin: "editorial" | "ugc" | "syndicated";
  ad_status: "off" | "eligible" | "restricted";
  social_status: "off" | "ready" | "paused";
  content_version: number;
  published_at: string;
};

function isContentBlock(value: unknown): value is ContentBlock {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const block = value as Record<string, unknown>;
  if (typeof block.type !== "string") return false;
  if (block.type === "image") {
    if (
      typeof block.url !== "string" ||
      block.url.length > 2_048 ||
      typeof block.alt !== "string" ||
      block.alt.length > 500 ||
      (block.credit !== undefined && typeof block.credit !== "string")
    ) return false;
    try {
      return new URL(block.url).protocol === "https:";
    } catch {
      return false;
    }
  }
  if (typeof block.text !== "string") return false;
  if (block.type === "paragraph") return true;
  if (block.type === "heading") return block.level === 2 || block.level === 3;
  if (block.type === "quote") {
    return block.attribution === undefined || typeof block.attribution === "string";
  }
  return false;
}

function mapRow(row: ContentRow): Article {
  const blocks = Array.isArray(row.body?.blocks)
    ? row.body.blocks.filter(isContentBlock)
    : [];

  return {
    id: row.id,
    slug: row.slug,
    content_type: row.type,
    title: row.title,
    excerpt: row.excerpt,
    content_blocks: blocks,
    cover_image: (() => {
      if (!row.cover_image_url) return undefined;
      try {
        const url = new URL(row.cover_image_url);
        return url.protocol === "https:" ? url.toString() : undefined;
      } catch {
        return undefined;
      }
    })(),
    source_url: `https://ugavole.com/haber/${row.slug}`,
    original_source_url: row.source_url ?? undefined,
    source_name: "ugavole",
    category: row.category,
    published_at: row.published_at,
    is_ugc: row.origin === "ugc",
    author: row.author_name,
    ad_eligible: row.ad_status === "eligible",
    social_ready: row.social_status === "ready",
    content_version: row.content_version,
  };
}

function localArticles(): Article[] {
  return LOCAL_ARTICLES.map((article) => ({
    ...article,
    slug: article.source_url.replace(/\/$/, "").split("/").pop(),
    // Bundled fallback content has no database-backed ad review record.
    ad_eligible: false,
    social_ready: false,
    content_version: 1,
  }));
}

async function fetchRows(limit = 500): Promise<Article[]> {
  if (!hasSupabaseConfig()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("published_content")
    .select(
      "id, slug, type, title, excerpt, body, cover_image_url, category, source_url, author_name, origin, ad_status, social_status, content_version, published_at"
    )
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error("Published content could not be loaded");
  return (data as ContentRow[]).map(mapRow);
}

export const listPublishedArticles = cache(async (): Promise<Article[]> => {
  const local = localArticles();
  let remote: Article[] = [];

  try {
    remote = await fetchRows();
  } catch {
    // Bundled editorial articles keep the public site useful during DB maintenance.
  }

  const seen = new Set<string>();
  return [...remote, ...local]
    .filter((article) => {
      const slug = article.slug ?? article.source_url;
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
});

export async function getPublishedArticle(slug: string): Promise<Article | undefined> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return undefined;
  const articles = await listPublishedArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const articles = await listPublishedArticles();
  return articles
    .filter(
      (candidate) =>
        candidate.category === article.category && candidate.id !== article.id
    )
    .slice(0, limit);
}
