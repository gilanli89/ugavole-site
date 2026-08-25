import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/api/news";
import { categorySlug } from "@/lib/content";

const ALLOWED_CATEGORIES = new Set([
  "tumu",
  "gundem",
  "siyaset",
  "ekonomi",
  "spor",
  "kultur",
  "eglence",
  "dunya",
  "gezi",
  "yemek",
  "yasam",
  "genel",
]);

export async function GET(request: NextRequest) {
  const category = (request.nextUrl.searchParams.get("kategori") ?? "tumu")
    .trim()
    .toLocaleLowerCase("tr-TR");
  const rawPage = request.nextUrl.searchParams.get("sayfa") ?? "1";
  if (!ALLOWED_CATEGORIES.has(category) || !/^\d{1,2}$/.test(rawPage)) {
    return NextResponse.json(
      { error: "Geçersiz filtre" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }
  const page = Number(rawPage);
  if (page < 1 || page > 50) {
    return NextResponse.json(
      { error: "Geçersiz sayfa" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }
  const perPage = 20;

  try {
    let articles = await fetchAllNews();

    if (category !== "tumu") {
      articles = articles.filter(
        (article) => categorySlug(article.category) === category
      );
    }

    const total = articles.length;
    const paginated = articles.slice((page - 1) * perPage, page * perPage);

    return NextResponse.json(
      { articles: paginated, total, page, perPage },
      { headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=1800" } }
    );
  } catch {
    return NextResponse.json({ error: "Haberler alınamadı" }, { status: 500 });
  }
}
