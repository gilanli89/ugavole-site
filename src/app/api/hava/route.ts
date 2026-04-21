import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/api/weather";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city") ?? "lefkosa";

  try {
    const data = await fetchWeather(city);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Hava durumu alınamadı" }, { status: 500 });
  }
}
