import { NextResponse } from "next/server";
import { scrapePharmacies } from "@/lib/api/pharmacy";
import type { Pharmacy } from "@/lib/api/pharmacy";

export type { Pharmacy };

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  try {
    const pharmacies = await scrapePharmacies();
    return NextResponse.json(
      { pharmacies, date: today, source: "kteb.org" },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200" } }
    );
  } catch (err) {
    console.error("Eczane scraping hatası:", err);
    return NextResponse.json(
      { pharmacies: [], date: today, error: "Nöbetçi eczane bilgisi alınamadı." },
      { status: 502 }
    );
  }
}
