import type { Article } from "./news";
import { extractFirstImage } from "@/lib/content";
import { LOCAL_ARTICLES } from "./local-articles";

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  categories: number[];
  link: string;
  type?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ slug: string; name: string }>>;
  };
};

// Slug → gerçek kategori eşlemesi (WP'deki "Diğer" override)
const SLUG_CATEGORY: Record<string, string> = {
  "917":                                                              "Kültür",
  "kibris-adasi-jeolojik-konum-ve-onemi":                           "Kültür",
  "baska-ulkelerde-garip-ama-kibris-ta-normal-olan-15-sey":         "Eğlence",
  "kibris-sivesinde-kullanilan-ilginc-kelimeler":                   "Kültür",
  "kesfedilmesi-gereken-kuzey-kibris-aktiviteleri":                 "Gezi",
  "kibris-hakkinda-buyuk-ihtimalle-daha-once-duymadiginiz-5-sasirtici-gercek": "Kültür",
  "kuzey-kibrista-yasamayi-ozel-kilan-detaylar":                   "Yaşam",
  "kuzey-kibrista-gun-batimi-izleyebilecegin-muhtesem-yerler":     "Gezi",
  "kuzey-kibris-mutfaginda-one-cikan-lezzetler":                   "Yemek",
  "kuzey-kibris-hakkinda-ilginc-ve-sasirtici-gercekler":           "Eğlence",
  "kuzey-kibrista-mutlaka-gormen-gereken-yerler":                  "Gezi",
  "gecmisten-gunumuye-kibris-tarihi":                               "Kültür",
  "kibrisli-turkler-diaspora":                                      "Kültür",
};

// Hostingersite birincil — cms.ugavole.com hazır olunca başa alınır
const WP_ENDPOINTS = [
  "https://darkviolet-raccoon-423607.hostingersite.com/wp-json/wp/v2",
  process.env.CMS_WP_URL ?? "https://cms.ugavole.com/wp-json/wp/v2",
];

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchItems(baseUrl: string, type: "posts" | "pages"): Promise<Article[]> {
  const url = `${baseUrl}/${type}?per_page=100&_embed=1`;

  const res = await fetch(url, {
    headers: { "User-Agent": "ugavole-bot/1.0" },
    next: { revalidate: 900 },
  });

  if (!res.ok) throw new Error(`WP ${type} ${res.status}: ${baseUrl}`);

  const items: WPPost[] = await res.json();

  return items.map((post) => {
    const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    const coverImage =
      featuredMedia
      ?? extractFirstImage(post.content.rendered)
      ?? undefined;

    const cats = post._embedded?.["wp:term"]?.[0] ?? [];
    const rawCategory = cats[0]?.name ?? (type === "pages" ? "Sayfa" : "Genel");
    const category = SLUG_CATEGORY[post.slug] ?? (rawCategory === "Diğer" ? "Genel" : rawCategory);

    return {
      id: `wp-${type === "pages" ? "page" : "post"}-${post.id}`,
      title: stripHtml(post.title.rendered),
      excerpt: stripHtml(post.excerpt.rendered).slice(0, 250),
      content: post.content.rendered,
      cover_image: coverImage,
      source_url: `https://ugavole.com/haber/${post.slug}`,
      source_name: "ugavole",
      category,
      published_at: post.date,
      is_ugc: false,
      author: "ugavole",
    };
  });
}

async function fetchFromEndpoint(baseUrl: string): Promise<Article[]> {
  // Posts ve pages paralel çek
  const [posts, pages] = await Promise.allSettled([
    fetchItems(baseUrl, "posts"),
    fetchItems(baseUrl, "pages"),
  ]);

  const result: Article[] = [];
  if (posts.status === "fulfilled") result.push(...posts.value);
  if (pages.status === "fulfilled") result.push(...pages.value);

  return result;
}

export async function fetchWordPressPosts(): Promise<Article[]> {
  let wpArticles: Article[] = [];
  for (const endpoint of WP_ENDPOINTS) {
    try {
      const items = await fetchFromEndpoint(endpoint);
      if (items.length > 0) { wpArticles = items; break; }
    } catch {
      // bir sonraki endpoint'i dene
    }
  }
  return [...LOCAL_ARTICLES, ...wpArticles];
}
