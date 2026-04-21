import type { Metadata } from "next";
import GunBatimiClient from "./GunBatimiClient";

export const metadata: Metadata = {
  title: "Kıbrıs Gün Batımı Saati — Bugün KKTC'de Güneş Ne Zaman Batıyor? | ugavole",
  description:
    "Kuzey Kıbrıs gün batımı saati bugün: Girne, Lefkoşa, Gazimağusa, Karpaz ve Güzelyurt için anlık geri sayım. En iyi izleme noktaları ve topluluk fotoğrafları.",
  keywords: [
    "Kıbrıs gün batımı saati", "KKTC gün batımı", "Girne gün batımı",
    "Kuzey Kıbrıs günbatımı", "Gazimağusa gün batımı", "Karpaz gün batımı",
    "Kıbrıs sunset", "KKTC güneş batış saati", "Lefkoşa gün batımı saati",
  ],
  alternates: { canonical: "https://ugavole.com/gun-batimi" },
  openGraph: {
    title: "Kıbrıs Gün Batımı Saati — Bugün KKTC'de Güneş Ne Zaman Batıyor?",
    description: "KKTC gün batımı saati, geri sayım, en güzel izleme noktaları ve topluluk fotoğrafları.",
    url: "https://ugavole.com/gun-batimi",
    siteName: "ugavole",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kıbrıs Gün Batımı Saati | ugavole",
    description: "KKTC'de bugün gün batımı saati ve geri sayım.",
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
        "text": "Kuzey Kıbrıs'ta gün batımı saati mevsime göre değişir. Yaz aylarında (Haziran-Ağustos) güneş 19:45–20:15 arasında batarken, kış aylarında (Aralık-Ocak) 17:00–17:30 civarında batar. Tam saat için ugavole Gün Batımı sayfasındaki canlı geri sayımı takip edebilirsiniz.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GunBatimiClient />
    </>
  );
}
