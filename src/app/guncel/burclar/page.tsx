import type { Metadata } from "next";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Günlük Burç Yorumları",
  description: "Kıbrıs burç yorumları — 12 burç için günlük sevgi, kariyer ve sağlık tahminleri.",
  path: "/guncel/burclar",
});

const BURCLAR = [
  { ad: "Koç",          tarih: "21 Mar – 19 Nis", emoji: "♈", renk: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { ad: "Boğa",         tarih: "20 Nis – 20 May", emoji: "♉", renk: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { ad: "İkizler",      tarih: "21 May – 20 Haz", emoji: "♊", renk: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { ad: "Yengeç",       tarih: "21 Haz – 22 Tem", emoji: "♋", renk: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  { ad: "Aslan",        tarih: "23 Tem – 22 Ağu", emoji: "♌", renk: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  { ad: "Başak",        tarih: "23 Ağu – 22 Eyl", emoji: "♍", renk: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400" },
  { ad: "Terazi",       tarih: "23 Eyl – 22 Eki", emoji: "♎", renk: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
  { ad: "Akrep",        tarih: "23 Eki – 21 Kas", emoji: "♏", renk: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  { ad: "Yay",          tarih: "22 Kas – 21 Ara", emoji: "♐", renk: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  { ad: "Oğlak",        tarih: "22 Ara – 19 Oca", emoji: "♑", renk: "bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-400" },
  { ad: "Kova",         tarih: "20 Oca – 18 Şub", emoji: "♒", renk: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  { ad: "Balık",        tarih: "19 Şub – 20 Mar", emoji: "♓", renk: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
];

export default function BurclarPage() {
  const schema = breadcrumbSchema([
    { name: "Ana Sayfa", url: "https://ugavole.com" },
    { name: "Güncel", url: "https://ugavole.com/guncel" },
    { name: "Burçlar", url: "https://ugavole.com/guncel/burclar" },
  ]);

  const bugun = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="mb-8">
        <h1 className="text-3xl font-black text-ugavole-text">Günlük Burç Yorumları</h1>
        <p className="text-ugavole-muted mt-1">{bugun}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {BURCLAR.map((burc) => (
          <div
            key={burc.ad}
            className="bg-ugavole-surface border border-ugavole-border rounded-2xl p-5 text-center hover:border-ugavole-yellow hover:shadow-md transition-all cursor-default"
          >
            <div className="text-4xl mb-3">{burc.emoji}</div>
            <h2 className="font-black text-ugavole-text text-sm mb-1">{burc.ad}</h2>
            <p className="text-xs text-ugavole-muted">{burc.tarih}</p>
            <span className={`inline-block mt-3 text-xs font-bold px-2.5 py-1 rounded-full ${burc.renk}`}>
              Yakında
            </span>
          </div>
        ))}
      </div>

      <p className="text-center text-ugavole-muted text-sm mt-8">
        Günlük burç yorumları çok yakında ugavole&apos;de yayında olacak.
      </p>
    </div>
  );
}
