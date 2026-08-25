/**
 * One-time legacy WordPress importer for the custom content_items kernel.
 * This file is never imported by the application runtime.
 */

import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const legacyBase = process.env.LEGACY_WP_API_URL?.replace(/\/$/, "");

if (!supabaseUrl || !serviceRoleKey || !legacyBase) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and LEGACY_WP_API_URL are required"
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type WpPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
    "wp:term"?: Array<Array<{ name?: string }>>;
  };
};

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 2 | 3 }
  | { type: "quote"; text: string }
  | { type: "image"; url: string; alt: string };

function plainText(html: string): string {
  return cheerio.load(html).text().replace(/\s+/g, " ").trim();
}

function safeHttpUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function blocksFromHtml(html: string): Block[] {
  const $ = cheerio.load(html);
  $("script,style,iframe,form,object,embed,svg").remove();
  const blocks: Block[] = [];

  $("h2,h3,p,blockquote,img").each((_index, element) => {
    const node = $(element);
    const tag = element.tagName.toLowerCase();

    if (tag === "img") {
      const url = safeHttpUrl(node.attr("src"));
      if (url) blocks.push({ type: "image", url, alt: node.attr("alt")?.slice(0, 300) ?? "" });
      return;
    }

    // Avoid duplicating text from nested elements already represented by their parent.
    if (node.parents("p,h2,h3,blockquote").length > 0) return;
    const text = node.text().replace(/\s+/g, " ").trim();
    if (!text) return;

    if (tag === "h2" || tag === "h3") {
      blocks.push({ type: "heading", text, level: tag === "h3" ? 3 : 2 });
    } else if (tag === "blockquote") {
      blocks.push({ type: "quote", text });
    } else {
      blocks.push({ type: "paragraph", text });
    }
  });

  return blocks.slice(0, 300);
}

async function fetchType(type: "posts" | "pages"): Promise<WpPost[]> {
  const response = await fetch(
    `${legacyBase}/${type}?per_page=100&_embed=1&_fields=id,slug,date,modified,title,excerpt,content,_embedded`,
    { headers: { "User-Agent": "ugavole-legacy-import/1.0" } }
  );
  if (!response.ok) throw new Error(`Legacy API ${type} failed with ${response.status}`);
  return response.json() as Promise<WpPost[]>;
}

async function run() {
  const results = await Promise.all([fetchType("posts"), fetchType("pages")]);
  const posts = results.flat();
  let imported = 0;

  for (const post of posts) {
    const title = plainText(post.title.rendered).slice(0, 180);
    const blocks = blocksFromHtml(post.content.rendered);
    if (title.length < 8 || blocks.length === 0) continue;

    const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name?.trim() || "Bizden Şeyler";
    const coverImage = safeHttpUrl(post._embedded?.["wp:featuredmedia"]?.[0]?.source_url);
    const excerpt = plainText(post.excerpt.rendered).slice(0, 360);

    const { error } = await supabase.from("content_items").upsert(
      {
        slug: post.slug,
        type: "article",
        title,
        excerpt,
        body: { version: 1, blocks },
        cover_image_url: coverImage,
        category,
        author_name: "ugavole",
        origin: "editorial",
        status: "published",
        ad_status: "off",
        social_status: "off",
        published_at: post.date,
        updated_at: post.modified,
      },
      { onConflict: "slug" }
    );

    if (error) throw new Error(`Import failed for ${post.slug}: ${error.message}`);
    imported += 1;
  }

  console.log(`Imported ${imported} legacy items into content_items with ads/social disabled.`);
}

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Legacy import failed");
  process.exitCode = 1;
});
