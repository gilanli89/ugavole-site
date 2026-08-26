import type { Metadata } from "next";
import GunBatimiClient from "./GunBatimiClient";
import { serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Bugün Kıbrıs'ta Gün Batımı Saat Kaçta? KKTC | ugavole",
  description:
    "Kıbrıs'ta bugün gün batımı saat kaçta? Lefkoşa, Girne, Gazimağusa, Güzelyurt ve İskele için güncel güneş batışı, doğuşu, altın saat ve geri sayım.",
  keywords: [
    "Kıbrıs gün batımı saati", "KKTC gün batımı", "Girne gün batımı",
    "Kuzey Kıbrıs günbatımı", "Gazimağusa gün batımı", "Karpaz gün batımı",
    "Kıbrıs sunset", "KKTC güneş batış saati", "Lefkoşa gün batımı saati",
    "bugün gün batımı", "yarın gün batımı", "güneş kaçta batıyor",
  ],
  alternates: { canonical: "https://ugavole.com/gun-batimi" },
  openGraph: {
    title: "Bugün Kıbrıs'ta Gün Batımı Saat Kaçta?",
    description: "KKTC için güncel gün batımı saati, geri sayım ve altın saat bilgisi.",
    url: "https://ugavole.com/gun-batimi",
    siteName: "ugavole",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bugün Kıbrıs'ta Gün Batımı Saat Kaçta? | ugavole",
    description: "KKTC'de bugün gün batımı saati, geri sayım ve altın saat.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Kıbrıs'ta gün batımı saat kaçta?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kuzey Kıbrıs'ta gün batımı saati tarih ve şehre göre değişir. Tam bugünkü saat için bu sayfadan Lefkoşa, Girne, Gazimağusa, Güzelyurt veya İskele'yi seçin; geri sayım ve güneş doğuşu bilgisi KKTC saatine göre gösterilir.",
      },
    },
    {
      "@type": "Question",
      "name": "Kıbrıs'ta gün batımını izlemek için en iyi yer neresi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kıbrıs'ta gün batımı için en popüler noktalar: Girne Limanı (tarihi kale silueti), Karpaz Altınkum plajı (el değmemiş doğa), Beşparmak Dağları (tüm ada panoraması), Gazimağusa Surları (ortaçağ atmosferi) ve Güzelyurt Körfezi (portakal bahçeleri).",
      },
    },
    {
      "@type": "Question",
      "name": "Kıbrıs gün batımı fotoğrafçılığı için en iyi sezon hangisi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kıbrıs'ta gün batımı fotoğrafçılığı için Nisan-Ekim ayları idealdir. Bu dönemde hava berrak, ışık uzun ve sıcak tonlarda olur. Altın saat (golden hour) gün batımından yaklaşık 45 dakika önce başlar.",
      },
    },
  ],
};

export default function GunBatimiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <GunBatimiClient />
    </>
  );
}
