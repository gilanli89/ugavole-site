import { NextRequest, NextResponse } from "next/server";

const CITIES = {
  lefkosa: { lat: 35.1856, lng: 33.3823 },
  girne: { lat: 35.3317, lng: 33.3192 },
  gazimagusa: { lat: 35.1264, lng: 33.9419 },
  guzelyurt: { lat: 35.2031, lng: 32.9961 },
  iskele: { lat: 35.2867, lng: 33.8833 },
} as const;

type CityId = keyof typeof CITIES;

function validIsoDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

export async function GET(request: NextRequest) {
  const cityId = (request.nextUrl.searchParams.get("sehir") ?? "lefkosa") as CityId;
  const city = CITIES[cityId];
  if (!city) {
    return NextResponse.json(
      { error: "Geçersiz şehir" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const url = new URL("https://api.sunrise-sunset.org/json");
    url.searchParams.set("lat", String(city.lat));
    url.searchParams.set("lng", String(city.lng));
    url.searchParams.set("date", "today");
    url.searchParams.set("tzid", "Asia/Nicosia");
    url.searchParams.set("formatted", "0");
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3_600 },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error("sun_api_unavailable");

    const raw = (await response.json()) as {
      status?: unknown;
      results?: { sunrise?: unknown; sunset?: unknown };
    };
    const sunriseISO = raw.results?.sunrise;
    const sunsetISO = raw.results?.sunset;
    if (raw.status !== "OK" || !validIsoDate(sunriseISO) || !validIsoDate(sunsetISO)) {
      throw new Error("sun_api_invalid_response");
    }
    const goldenHourISO = new Date(Date.parse(sunsetISO) - 45 * 60 * 1_000).toISOString();

    return NextResponse.json(
      { sunriseISO, sunsetISO, goldenHourISO },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Güneş verisi alınamadı" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
