import { NextRequest, NextResponse } from "next/server";
import { fetchHeadlines } from "@/lib/api/news";

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get("bolge") as "kuzey" | "guney" | "dunya" | undefined;

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
