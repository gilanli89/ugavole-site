import type { Metadata } from "next";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sosyal Medya",
  description: "ugavole sosyal medya hesapları — Instagram, YouTube, Facebook ve X'te bizi takip edin.",
  path: "/sosyal-medya",
});

const HESAPLAR = [
  {
    platform: "Instagram",
    kullanici: "@ugavole.cyp",
    url: "https://instagram.com/ugavole.cyp",
    aciklama: "Kıbrıs'tan fotoğraflar, reels ve günlük içerikler",
    renk: "#E1306C",
    bg: "bg-[#E1306C]/10 hover:bg-[#E1306C]/20 dark:bg-[#E1306C]/10 dark:hover:bg-[#E1306C]/20",
    border: "border-[#E1306C]/30 hover:border-[#E1306C]",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    platform: "YouTube",
    kullanici: "@ugavole",
    url: "https://youtube.com/ugavole",
    aciklama: "Kıbrıs videoları, vloglar ve belgeseller",
    renk: "#FF0000",
    bg: "bg-[#FF0000]/10 hover:bg-[#FF0000]/20 dark:bg-[#FF0000]/10 dark:hover:bg-[#FF0000]/20",
    border: "border-[#FF0000]/30 hover:border-[#FF0000]",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    platform: "Facebook",
    kullanici: "ugavole",
    url: "https://facebook.com/ugavole",
    aciklama: "Haberler, etkinlikler ve Kıbrıs topluluğu",
    renk: "#1877F2",
    bg: "bg-[#1877F2]/10 hover:bg-[#1877F2]/20 dark:bg-[#1877F2]/10 dark:hover:bg-[#1877F2]/20",
    border: "border-[#1877F2]/30 hover:border-[#1877F2]",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    platform: "X (Twitter)",
    kullanici: "@ugavole",
    url: "https://x.com/ugavole",
    aciklama: "Anlık haberler, tartışmalar ve Kıbrıs gündemi",
    renk: "#000000",
    bg: "bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10",
    border: "border-black/20 hover:border-black dark:border-white/20 dark:hover:border-white",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.854L1.254 2.25H8.08l4.256 5.628L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
      </svg>
    ),
  },
];

export default function SosyalMedyaPage() {
  const schema = breadcrumbSchema([
    { name: "Ana Sayfa", url: "https://ugavole.com" },
    { name: "Sosyal Medya", url: "https://ugavole.com/sosyal-medya" },
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-ugavole-text mb-2">Bizi Takip Et</h1>
        <p className="text-ugavole-muted">
          Kıbrıs&apos;ın en eğlenceli içerikleri için ugavole&apos;yi sosyal medyada takip edin
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {HESAPLAR.map((h) => (
          <a
            key={h.platform}
            href={h.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-5 rounded-2xl border p-6 transition-all ${h.bg} ${h.border}`}
            style={{ color: h.renk }}
          >
            <div className="flex-shrink-0">{h.icon}</div>
            <div className="min-w-0">
              <p className="font-black text-ugavole-text text-base group-hover:underline">{h.platform}</p>
              <p className="text-sm font-bold" style={{ color: h.renk }}>{h.kullanici}</p>
              <p className="text-ugavole-muted text-xs mt-1 leading-snug">{h.aciklama}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 bg-ugavole-surface border border-ugavole-border rounded-2xl p-6 text-center">
        <p className="font-black text-ugavole-text text-lg mb-2">Haber Paylaş</p>
        <p className="text-ugavole-muted text-sm mb-4">
          Kıbrıs&apos;tan önemli bir gelişme mi var? Hemen bize ilet, sitenin ana sayfasında yayınlayalım.
        </p>
        <a
          href="/haber-yukle"
          className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-[#D4A017] text-black px-6 py-2.5 rounded-full text-sm font-black transition-colors"
        >
          Haber Gönder
        </a>
      </div>
    </div>
  );
}
