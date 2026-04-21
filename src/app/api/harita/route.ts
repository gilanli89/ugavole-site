import { NextResponse } from "next/server";
import { fetchHeadlines } from "@/lib/api/news";
import { rssToMapEvents } from "@/lib/harita-utils";

export async function GET() {
  try {
    // Sadece Kuzey Kıbrıs haberleri — yerel olaylar burada
    const articles = await fetchHeadlines("kuzey");
    const events = rssToMapEvents(
      articles.map((a) => ({
        title: a.title,
        source_url: a.source_url,
        source_name: a.source_name,
        published_at: a.published_at,
      }))
    );
    return NextResponse.json(
      { events, count: events.length },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ events: [], count: 0 }, { status: 502 });
  }
}
