import { NextResponse } from "next/server";
import { fetchExchangeRates } from "@/lib/api/exchange";

export async function GET() {
  try {
    const pairs = await fetchExchangeRates();
    const fetched_at = new Date().toISOString();
    return NextResponse.json(
      { pairs, fetched_at, source: "sundoviz.com" },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200" } }
    );
  } catch (error) {
    return NextResponse.json({ error: "Döviz kurları alınamadı" }, { status: 500 });
  }
}
