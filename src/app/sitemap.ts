import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase =
    supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project")
      ? createClient(supabaseUrl, supabaseKey)
      : null;
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

  // Dinamik — haberler
  let haberUrls: MetadataRoute.Sitemap = [];
  if (supabase) {
    try {
      const { data: haberler } = await supabase
        .from("haberler")
        .select("slug, yayinlanma_tarihi, guncelleme_tarihi")
        .eq("aktif", true)
        .order("yayinlanma_tarihi", { ascending: false })
        .limit(1000);

      haberUrls = (haberler || []).map((h) => ({
        url: `https://ugavole.com/haber/${h.slug}`,
        lastModified: new Date(h.guncelleme_tarihi || h.yayinlanma_tarihi),
        priority: 0.6 as const,
        changeFrequency: "weekly" as const,
      }));
    } catch {}
  }

  // Dinamik — liste içerikleri
  let listeUrls: MetadataRoute.Sitemap = [];
  if (supabase) {
    try {
      const { data: listeler } = await supabase
        .from("liste_icerikler")
        .select("slug, olusturulma")
        .eq("aktif", true);

      listeUrls = (listeler || []).map((l) => ({
        url: `https://ugavole.com/liste/${l.slug}`,
        lastModified: new Date(l.olusturulma),
        priority: 0.7 as const,
        changeFrequency: "monthly" as const,
      }));
    } catch {}
  }

  const total = statik.length + haberUrls.length + listeUrls.length;
  console.log(`Sitemap: ${total} URL (${statik.length} statik, ${haberUrls.length} haber, ${listeUrls.length} liste)`);

  return [...statik, ...haberUrls, ...listeUrls];
}
