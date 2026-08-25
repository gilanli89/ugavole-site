import { NextRequest, NextResponse } from "next/server";
import { fetchHeadlines } from "@/lib/api/news";

export async function GET(request: NextRequest) {
  const rawRegion = request.nextUrl.searchParams.get("bolge");
  if (rawRegion && rawRegion !== "kuzey" && rawRegion !== "guney" && rawRegion !== "dunya") {
    return NextResponse.json(
      { error: "Geçersiz bölge" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }
  const region = rawRegion as "kuzey" | "guney" | "dunya" | null;

  try {
    const articles = await fetchHeadlines(region ?? undefined);
    return NextResponse.json(
      { articles, count: articles.length },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ articles: [], count: 0 }, { status: 502 });
  }
}
