/**
 * Curated RSS registry.
 *
 * `link_only` sources are displayed as attributed outbound headlines only.
 * `draft_candidate` sources may later create a private editor draft, never a
 * public page. Every resulting article must keep the original source URL and
 * receive an editor's independent review before publication or social sharing.
 */
export type RssUse = "link_only" | "draft_candidate";

export type CuratedRssSource = {
  id: string;
  name: string;
  url: string;
  category: string;
  region: "kuzey" | "guney" | "dunya" | "en";
  lang: "tr" | "el" | "en";
  limit?: number;
  use: RssUse;
  attribution: string;
};

export const CURATED_RSS_SOURCES: CuratedRssSource[] = [
  // Local publishers remain link-only until a separate republication agreement
  // exists. Their reporting is useful context, not a license to republish it.
  {
    id: "havadis-gundem",
    name: "Havadis Kıbrıs",
    url: "https://www.havadiskibris.com/feed",
    category: "Gündem",
    region: "kuzey",
    lang: "tr",
    use: "link_only",
    attribution: "Havadis Kıbrıs RSS",
  },
  {
    id: "kibris-gazetesi",
    name: "Kıbrıs Gazetesi",
    url: "https://kibrisgazetesi.com/feed",
    category: "Gündem",
    region: "kuzey",
    lang: "tr",
    use: "link_only",
    attribution: "Kıbrıs Gazetesi RSS",
  },
  {
    id: "detay-kibris",
    name: "Detay Kıbrıs",
    url: "https://www.detaykibris.com/rss",
    category: "Gündem",
    region: "kuzey",
    lang: "tr",
    use: "link_only",
    attribution: "Detay Kıbrıs RSS",
  },
  {
    id: "yeni-duzen",
    name: "Yeni Düzen",
    url: "https://www.yeniduzen.com/rss",
    category: "Gündem",
    region: "kuzey",
    lang: "tr",
    use: "link_only",
    attribution: "Yeni Düzen RSS",
  },
  {
    id: "havadis-spor",
    name: "Havadis Kıbrıs Spor",
    url: "https://www.havadiskibris.com/category/spor/feed/",
    category: "Spor",
    region: "kuzey",
    lang: "tr",
    limit: 8,
    use: "link_only",
    attribution: "Havadis Kıbrıs Spor RSS",
  },
  {
    id: "cyprus-mail",
    name: "Cyprus Mail",
    url: "https://cyprus-mail.com/feed",
    category: "Gündem",
    region: "guney",
    lang: "en",
    use: "link_only",
    attribution: "Cyprus Mail RSS",
  },
  {
    id: "in-cyprus",
    name: "In-Cyprus",
    url: "https://www.in-cyprus.com/feed",
    category: "Gündem",
    region: "guney",
    lang: "en",
    use: "link_only",
    attribution: "In-Cyprus RSS",
  },
  {
    id: "politis",
    name: "Politis",
    url: "https://www.politis.com.cy/feed",
    category: "Gündem",
    region: "guney",
    lang: "el",
    use: "link_only",
    attribution: "Politis RSS",
  },
  {
    id: "philenews",
    name: "Philenews",
    url: "https://www.philenews.com/rss",
    category: "Gündem",
    region: "guney",
    lang: "el",
    use: "link_only",
    attribution: "Philenews RSS",
  },
  {
    id: "reporter-cy",
    name: "Reporter CY",
    url: "https://www.reporter.com.cy/feed",
    category: "Gündem",
    region: "guney",
    lang: "el",
    use: "link_only",
    attribution: "Reporter CY RSS",
  },

  // The five authority-source pilots below are suitable for a future private
  // editorial-draft queue. The worker receives RSS metadata only; it must not
  // scrape, translate, or reproduce the source article body.
  {
    id: "nasa-technology",
    name: "NASA Technology",
    url: "https://www.nasa.gov/technology/feed/",
    category: "Teknoloji",
    region: "dunya",
    lang: "en",
    limit: 6,
    use: "draft_candidate",
    attribution: "NASA Technology RSS",
  },
  {
    id: "esa-space-news",
    name: "ESA Space News",
    url: "https://www.esa.int/rssfeed/Our_Activities/Space_News",
    category: "Bilim & Uzay",
    region: "dunya",
    lang: "en",
    limit: 6,
    use: "draft_candidate",
    attribution: "European Space Agency RSS",
  },
  {
    id: "who-news",
    name: "WHO News",
    url: "https://www.who.int/rss-feeds/news-english.xml",
    category: "Sağlık",
    region: "dunya",
    lang: "en",
    limit: 5,
    use: "draft_candidate",
    attribution: "World Health Organization RSS",
  },
  {
    id: "usda-food-nutrition",
    name: "USDA Food & Nutrition Research",
    url: "https://www.ars.usda.gov/rss/?productName=Food%20%26%20Nutrition%20Research%20Briefs",
    category: "Yeme-İçme",
    region: "dunya",
    lang: "en",
    limit: 5,
    use: "draft_candidate",
    attribution: "USDA Agricultural Research Service RSS",
  },
  {
    id: "variety",
    name: "Variety",
    url: "https://variety.com/feed/",
    category: "Magazin",
    region: "dunya",
    lang: "en",
    limit: 6,
    use: "link_only",
    attribution: "Variety RSS",
  },
];

export const EDITORIAL_DRAFT_SOURCE_IDS = new Set(
  CURATED_RSS_SOURCES
    .filter((source) => source.use === "draft_candidate")
    .map((source) => source.id)
);
