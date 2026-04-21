import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/api/news";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("kategori");
  const page = parseInt(request.nextUrl.searchParams.get("sayfa") ?? "1");
  const perPage = 20;

  try {
    let articles = await fetchAllNews();

    if (category && category !== "tumu") {
      articles = articles.filter(
        (a) => a.category.toLowerCase() === category.toLowerCase()
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.baslik) {
      return NextResponse.json({ error: "Başlık zorunlu" }, { status: 400 });
    }

    // Supabase bağlantısı varsa kullan
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from("haberler")
        .insert([{
          baslik: body.baslik,
          ozet: body.ozet,
          kategori: body.kategori ?? "Gündem",
          icerik_tipi: body.icerik_tipi ?? "haber",
          gorsel_url: body.gorsel_url,
          kaynak_url: body.kaynak_url,
          one_cikar: body.one_cikar ?? false,
          haritada_goster: body.haritada_goster ?? false,
          harita_lat: body.harita_lat ? parseFloat(body.harita_lat) : null,
          harita_lng: body.harita_lng ? parseFloat(body.harita_lng) : null,
          harita_olay_tipi: body.harita_olay_tipi,
          harita_konum_adi: body.harita_konum_adi,
        }])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    }

    // Supabase yoksa başarı dön (localStorage fallback istemci tarafında)
    return NextResponse.json({ success: true, data: { ...body, id: crypto.randomUUID() } });
  } catch {
    return NextResponse.json({ error: "Haber kaydedilemedi" }, { status: 500 });
  }
}
