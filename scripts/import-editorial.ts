import { createClient } from "@supabase/supabase-js";
import { load } from "cheerio";
import sharp from "sharp";
import { EDITORIAL_ARTICLES } from "../src/lib/api/editorial-articles";

const CONFIRMATION = "PREPARE_20_EDITORIAL_ITEMS";
const MEDIA_BUCKET = "editorial-media";
const MAX_SOURCE_BYTES = 12 * 1024 * 1024;
const ALLOWED_SOURCE_HOSTS = new Set(["images.unsplash.com", "upload.wikimedia.org"]);

type TextBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "quote"; text: string };

function normalizedText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function blocksFromTrustedEditorialHtml(html: string): TextBlock[] {
  const $ = load(`<body>${html}</body>`);
  const blocks: TextBlock[] = [];

  $("body").children().each((_, element) => {
    const node = $(element);
    const tag = String(node.prop("tagName") ?? "").toLowerCase();
    const text = normalizedText(node.text());
    if (!text) return;

    if (tag === "h2" || tag === "h3") {
      blocks.push({ type: "heading", level: tag === "h2" ? 2 : 3, text });
      return;
    }
    if (tag === "blockquote") {
      blocks.push({ type: "quote", text });
      return;
    }
    if (tag === "ul" || tag === "ol") {
      node.children("li").each((index, listItem) => {
        const itemText = normalizedText($(listItem).text());
        if (itemText) {
          blocks.push({
            type: "paragraph",
            text: tag === "ol" ? `${index + 1}. ${itemText}` : `• ${itemText}`,
          });
        }
      });
      return;
    }
    if (tag === "p") blocks.push({ type: "paragraph", text });
  });

  return blocks;
}

async function fetchEditorialImage(source: string): Promise<Buffer> {
  const sourceUrl = new URL(source);
  if (sourceUrl.protocol !== "https:" || !ALLOWED_SOURCE_HOSTS.has(sourceUrl.hostname)) {
    throw new Error(`editorial_media_source_not_allowed:${sourceUrl.hostname}`);
  }
  const response = await fetch(sourceUrl, {
    headers: {
      Accept: "image/jpeg,image/png,image/webp",
      "User-Agent": "ugavole-editorial-import/1.0",
    },
  });
  if (!response.ok) throw new Error(`editorial_media_fetch_failed:${response.status}`);
  const finalUrl = new URL(response.url);
  if (finalUrl.protocol !== "https:" || !ALLOWED_SOURCE_HOSTS.has(finalUrl.hostname)) {
    throw new Error(`editorial_media_redirect_not_allowed:${finalUrl.hostname}`);
  }
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_SOURCE_BYTES) throw new Error("editorial_media_too_large");
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1 || bytes.length > MAX_SOURCE_BYTES) {
    throw new Error("editorial_media_too_large");
  }
  return sharp(bytes)
    .rotate()
    .resize(1_200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 84, progressive: true, mozjpeg: true })
    .toBuffer();
}

async function main() {
  if (process.env.EDITORIAL_IMPORT_CONFIRM !== CONFIRMATION) {
    throw new Error(`Set EDITORIAL_IMPORT_CONFIRM=${CONFIRMATION} to run this one-time import.`);
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const actorId = process.env.UGAVOLE_EDITOR_ACTOR_ID;
  if (!supabaseUrl || !serviceRoleKey || !actorId) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and UGAVOLE_EDITOR_ACTOR_ID are required.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data: actor, error: actorError } = await supabase
    .from("profiles")
    .select("id,role")
    .eq("id", actorId)
    .maybeSingle();
  if (actorError || !actor || !["editor", "admin"].includes(actor.role)) {
    throw new Error("UGAVOLE_EDITOR_ACTOR_ID must belong to an editor or admin profile.");
  }

  const { data: bucket } = await supabase.storage.getBucket(MEDIA_BUCKET);
  if (!bucket) {
    const { error } = await supabase.storage.createBucket(MEDIA_BUCKET, {
      public: true,
      fileSizeLimit: "5MB",
      allowedMimeTypes: ["image/jpeg"],
    });
    if (error) throw new Error(`editorial_media_bucket_create_failed:${error.message}`);
  } else if (!bucket.public) {
    throw new Error(`${MEDIA_BUCKET} exists but is private; review it before importing.`);
  }

  let prepared = 0;
  let skipped = 0;
  for (const article of EDITORIAL_ARTICLES) {
    const slug = article.slug ?? new URL(article.source_url).pathname.split("/").filter(Boolean).pop();
    if (!slug || !article.content || !article.cover_image) {
      throw new Error(`editorial_item_incomplete:${article.id}`);
    }
    const { data: existing, error: existingError } = await supabase
      .from("content_items")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existingError) throw new Error(`editorial_lookup_failed:${slug}`);
    if (existing) {
      skipped += 1;
      continue;
    }

    const blocks = blocksFromTrustedEditorialHtml(article.content);
    if (blocks.length === 0) throw new Error(`editorial_body_empty:${slug}`);
    const jpeg = await fetchEditorialImage(article.cover_image);
    const mediaPath = `${slug}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(mediaPath, jpeg, {
        contentType: "image/jpeg",
        cacheControl: "31536000",
        upsert: false,
      });
    if (uploadError && !/already exists/i.test(uploadError.message)) {
      throw new Error(`editorial_media_upload_failed:${slug}`);
    }
    const { data: publicMedia } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(mediaPath);

    const { error: insertError } = await supabase.from("content_items").insert({
      slug,
      type: "article",
      origin: "editorial",
      title: article.title.slice(0, 180),
      excerpt: article.excerpt.slice(0, 360),
      body: { version: 1, blocks },
      cover_image_url: publicMedia.publicUrl,
      category: article.category,
      author_name: article.author ?? "Ugavole Editörleri",
      status: "approved",
      ad_status: "off",
      social_status: "off",
      reviewed_by: actorId,
      reviewed_at: new Date().toISOString(),
      created_at: article.published_at,
    });
    if (insertError) throw new Error(`editorial_insert_failed:${slug}:${insertError.code}`);
    prepared += 1;
  }

  console.log(`Editorial import complete: ${prepared} prepared, ${skipped} already present.`);
  console.log("Items are approved but not published, monetized or socially queued until an AAL2 editor explicitly acts.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Editorial import failed");
  process.exitCode = 1;
});
