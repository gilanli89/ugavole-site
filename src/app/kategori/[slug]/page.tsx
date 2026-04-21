import type { Metadata } from "next";
import { fetchAllNews } from "@/lib/api/news";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import ArticleCard from "@/components/news/ArticleCard";

type Props = { params: Promise<{ slug: string }> };

const CATEGORY_NAMES: Record<string, string> = {
  gundem: "Gündem",
  siyaset: "Siyaset",
  ekonomi: "Ekonomi",
  spor: "Spor",
  kultur: "Kültür",
  teknoloji: "Teknoloji",
  genel: "Genel",
  diger: "Diğer",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = CATEGORY_NAMES[slug] ?? slug;
  return buildMetadata({
    title: `${name} Haberleri`,
    description: `Kuzey Kıbrıs ${name} haberleri — ugavole'de en güncel ${name.toLowerCase()} gelişmeleri.`,
    path: `/kategori/${slug}`,
  });
}

export default async function KategoriPage({ params }: Props) {
  const { slug } = await params;
  const name = CATEGORY_NAMES[slug] ?? slug;

  const allArticles = await fetchAllNews();
  const articles = allArticles.filter(
    (a) => a.category.toLowerCase() === name.toLowerCase()
  );

  const schema = breadcrumbSchema([
    { name: "Ana Sayfa", url: "https://ugavole.com" },
    { name: `${name} Haberleri`, url: `https://ugavole.com/kategori/${slug}` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ugavole-text">{name} Haberleri</h1>
        <p className="text-ugavole-muted mt-1">{articles.length} haber bulundu</p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>Bu kategoride henüz haber yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article, i) => (
            <ArticleCard key={`${article.id}-${i}`} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
