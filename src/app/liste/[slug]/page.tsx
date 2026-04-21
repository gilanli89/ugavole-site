import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ShareButtons from "@/components/ShareButtons";
import AdBanner from "@/components/AdBanner";
import ListeVote from "./ListeVote";

const BASE = "https://ugavole.com";

type Madde = {
  id: string;
  sira: number;
  baslik: string;
  aciklama: string | null;
  gorsel_url: string | null;
  kaynak_url: string | null;
  oylar: number;
};

type Icerik = {
  id: string;
  slug: string;
  baslik: string;
  ozet: string | null;
  kapak_gorsel: string | null;
  kategori: string | null;
  olusturulma: string;
};

async function getIcerik(slug: string): Promise<{ icerik: Icerik; maddeler: Madde[] } | null> {
  try {
    const sb = await createClient();
    const { data: icerik } = await sb
      .from("liste_icerikler")
      .select("*")
      .eq("slug", slug)
      .eq("aktif", true)
      .single();
    if (!icerik) return null;

    const { data: maddeler } = await sb
      .from("liste_maddeler")
      .select("*")
      .eq("icerik_id", icerik.id)
      .order("sira", { ascending: true });

    return { icerik: icerik as Icerik, maddeler: (maddeler ?? []) as Madde[] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getIcerik(slug);
  if (!result) return { title: "Liste Bulunamadı" };
  const { icerik } = result;
  return {
    title: icerik.baslik,
    description: icerik.ozet ?? icerik.baslik,
    openGraph: {
      title: icerik.baslik,
      description: icerik.ozet ?? undefined,
      url: `${BASE}/liste/${slug}`,
      images: icerik.kapak_gorsel ? [{ url: icerik.kapak_gorsel, width: 1200, height: 630 }] : undefined,
    },
    alternates: { canonical: `${BASE}/liste/${slug}` },
  };
}

export default async function ListeIcerikPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getIcerik(slug);
  if (!result) notFound();

  const { icerik, maddeler } = result;

  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      {/* Kapak */}
      {icerik.kapak_gorsel && (
        <div className="relative w-full h-56 md:h-72 rounded-3xl overflow-hidden mb-6">
          <Image src={icerik.kapak_gorsel} alt={icerik.baslik} fill className="object-cover" priority placeholder="blur" blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=" sizes="(max-width: 768px) 100vw, 672px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Başlık */}
      {icerik.kategori && (
        <span className="inline-block bg-ugavole-yellow/20 text-ugavole-yellow text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          {icerik.kategori}
        </span>
      )}
      <h1 className="font-black text-ugavole-text text-2xl md:text-3xl leading-tight mb-3">{icerik.baslik}</h1>
      {icerik.ozet && <p className="text-ugavole-body text-base leading-relaxed mb-6">{icerik.ozet}</p>}

      {/* Paylaş üst */}
      <div className="border-y border-ugavole-border py-4 mb-8">
        <ShareButtons
          text={`${icerik.baslik} — ugavole #KKTC`}
          url={`${BASE}/liste/${slug}`}
          compact
        />
      </div>

      {/* Maddeler */}
      <div className="space-y-10">
        {maddeler.map((madde, idx) => (
          <section key={madde.id}>
            {/* Her 3 maddede reklam alanı */}
            {idx > 0 && idx % 3 === 0 && (
              <AdBanner className="mb-10 rounded-2xl" />
            )}

            {madde.gorsel_url && (
              <div className="relative w-full h-52 md:h-64 rounded-2xl overflow-hidden mb-4">
                <Image src={madde.gorsel_url} alt={madde.baslik} fill className="object-cover" loading="lazy" sizes="(max-width: 768px) 100vw, 672px" />
              </div>
            )}

            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-ugavole-yellow flex items-center justify-center font-black text-2xl text-black">
                {madde.sira}
              </span>
              <div className="flex-1">
                <h2 className="font-black text-ugavole-text text-xl mb-2">
                  {madde.kaynak_url ? (
                    <a href={madde.kaynak_url} target="_blank" rel="noopener noreferrer" className="hover:text-ugavole-yellow transition-colors">
                      {madde.baslik}
                    </a>
                  ) : madde.baslik}
                </h2>
                {madde.aciklama && (
                  <p className="text-ugavole-body leading-relaxed">{madde.aciklama}</p>
                )}
                {/* Oy butonu (client component) */}
                <ListeVote maddeId={madde.id} oylar={madde.oylar} />
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Paylaş alt */}
      <div className="border-t border-ugavole-border pt-8 mt-10">
        <p className="text-center text-ugavole-muted text-sm font-bold uppercase tracking-wider mb-4">Beğendiysen paylaş!</p>
        <ShareButtons
          text={`${icerik.baslik} — ugavole #KKTC`}
          url={`${BASE}/liste/${slug}`}
        />
      </div>

      {/* Bunları da beğenebilirsin */}
      <RelatedLists currentId={icerik.id} kategori={icerik.kategori} />
    </article>
  );
}

// İlgili listeler — server component
async function RelatedLists({ currentId, kategori }: { currentId: string; kategori: string | null }) {
  try {
    const sb = await createClient();
    let query = sb
      .from("liste_icerikler")
      .select("id, slug, baslik, kapak_gorsel, kategori")
      .eq("aktif", true)
      .neq("id", currentId)
      .limit(3);
    if (kategori) query = query.eq("kategori", kategori);
    const { data } = await query;
    if (!data || data.length === 0) return null;

    return (
      <div className="mt-10">
        <h3 className="font-black text-ugavole-text mb-4">Bunları da beğenebilirsin</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.map((item) => (
            <Link
              key={item.id}
              href={`/liste/${item.slug}`}
              className="bg-ugavole-surface border border-ugavole-border rounded-2xl overflow-hidden hover:border-ugavole-yellow transition-all group"
            >
              {item.kapak_gorsel && (
                <div className="relative h-24 overflow-hidden">
                  <Image src={item.kapak_gorsel} alt={item.baslik} fill className="object-cover group-hover:scale-105 transition-transform" loading="lazy" sizes="(max-width: 640px) 100vw, 33vw" />
                </div>
              )}
              <p className="p-3 text-ugavole-text text-sm font-bold line-clamp-2 group-hover:text-ugavole-yellow transition-colors">
                {item.baslik}
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch {
    return null;
  }
}
