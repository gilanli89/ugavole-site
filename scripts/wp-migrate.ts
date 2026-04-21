/**
 * WordPress → Supabase migrasyon scripti
 * Çalıştır: npm run migrate
 *
 * Yaptıkları:
 * 1. WordPress API'den tüm post ve page'leri çeker
 * 2. extractFirstImage ile içerikten görsel çıkarır (featured image yoksa)
 * 3. Supabase haberler tablosuna upsert eder (slug ile match)
 */

import { createClient } from "@supabase/supabase-js";
import { extractFirstImage, cleanWordPressContent, categorySlug } from "../src/lib/content";

// ── Env ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const WP_BASE = "https://darkviolet-raccoon-423607.hostingersite.com/wp-json/wp/v2";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_KEY eksik");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Kategori override haritası ───────────────────────────────────
const SLUG_CATEGORY: Record<string, string> = {
  "917":                                                                 "Kültür",
  "kibris-adasi-jeolojik-konum-ve-onemi":                              "Kültür",
  "baska-ulkelerde-garip-ama-kibris-ta-normal-olan-15-sey":            "Eğlence",
  "kibris-sivesinde-kullanilan-ilginc-kelimeler":                      "Kültür",
  "kesfedilmesi-gereken-kuzey-kibris-aktiviteleri":                    "Gezi",
  "kibris-hakkinda-buyuk-ihtimalle-daha-once-duymadiginiz-5-sasirtici-gercek": "Kültür",
  "kuzey-kibrista-yasamayi-ozel-kilan-detaylar":                      "Yaşam",
  "kuzey-kibrista-gun-batimi-izleyebilecegin-muhtesem-yerler":        "Gezi",
  "kuzey-kibris-mutfaginda-one-cikan-lezzetler":                      "Yemek",
  "kuzey-kibris-hakkinda-ilginc-ve-sasirtici-gercekler":              "Eğlence",
  "kuzey-kibrista-mutlaka-gormen-gereken-yerler":                     "Gezi",
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&hellip;/g, "…").replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ").replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/\s+/g, " ").trim();
}

async function fetchWP(type: "posts" | "pages"): Promise<WPPost[]> {
  const url = `${WP_BASE}/${type}?per_page=100&_embed=1&_fields=id,slug,date,title,excerpt,content,featured_media,categories,link,_embedded`;
  const res = await fetch(url, { headers: { "User-Agent": "ugavole-migrate/1.0" } });
  if (!res.ok) throw new Error(`WP ${type} ${res.status}`);
  return res.json();
}

type WPPost = {
  id: number; slug: string; date: string;
  title: { rendered: string }; excerpt: { rendered: string };
  content: { rendered: string }; link: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string }>>;
  };
};

async function migrate() {
  console.log("🚀 WordPress → Supabase migrasyon başlıyor...\n");

  // WP'den çek
  const [postsResult, pagesResult] = await Promise.allSettled([
    fetchWP("posts"),
    fetchWP("pages"),
  ]);

  const allItems: WPPost[] = [
    ...(postsResult.status === "fulfilled" ? postsResult.value : []),
    ...(pagesResult.status === "fulfilled" ? pagesResult.value : []),
  ];

  console.log(`📦 ${allItems.length} içerik bulundu (WordPress)\n`);

  let upserted = 0;
  let skipped = 0;

  for (const post of allItems) {
    const title = stripHtml(post.title.rendered);
    if (!title || title.length < 3) { skipped++; continue; }

    const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
    const gorsel_url = featuredMedia ?? extractFirstImage(post.content.rendered);

    const rawCat = post._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "Genel";
    const kategori = SLUG_CATEGORY[post.slug] ?? (rawCat === "Diğer" ? "Genel" : rawCat);

    const excerpt = stripHtml(post.excerpt.rendered).slice(0, 300);
    const cleanContent = cleanWordPressContent(post.content.rendered);

    const row = {
      slug: post.slug,
      baslik: title,
      ozet: excerpt,
      icerik: cleanContent,
      gorsel_url,
      kategori,
      kategori_slug: categorySlug(kategori),
      kaynak_url: post.link,
      kaynak_adi: "ugavole",
      yayinlanma_tarihi: post.date,
      aktif: true,
      one_cikar: false,
    };

    const { error } = await sb
      .from("haberler")
      .upsert(row, { onConflict: "slug" });

    if (error) {
      console.warn(`  ⚠️  ${post.slug}: ${error.message}`);
      skipped++;
    } else {
      console.log(`  ✅ [${kategori}] ${title.slice(0, 60)}`);
      upserted++;
    }
  }

  console.log(`\n✨ Tamamlandı: ${upserted} upsert, ${skipped} atlandı`);
}

migrate().catch((err) => {
  console.error("❌ Hata:", err.message);
  process.exit(1);
});
