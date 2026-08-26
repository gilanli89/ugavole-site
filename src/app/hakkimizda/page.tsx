import type { Metadata } from "next";
import UgavoleMark from "@/components/ui/UgavoleMark";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "ugavole hakkında. Kıbrıs'ın en eğlenceli köşesi — misyonumuz, hikayemiz ve ekibimiz.",
};

export default function HakkimizdaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <UgavoleMark size={64} className="mx-auto mb-5" />
        <h1 className="text-4xl font-black text-ugavole-text mb-3">
          <span className="text-ugavole-text">uga</span>
          <span className="text-[#D4A017] dark:text-[#F5C518]">vole</span>
        </h1>
        <p className="text-xl text-ugavole-body leading-relaxed max-w-lg mx-auto">
          Kıbrıs&apos;ın en eğlenceli dijital köşesi.
          Güncel, samimi ve Kıbrıslı.
        </p>
      </div>

      {/* Hikaye */}
      <section className="mb-10">
        <h2 className="text-2xl font-black text-ugavole-text mb-4">Hikayemiz</h2>
        <div className="space-y-4 text-ugavole-body leading-relaxed">
          <p>
            ugavole, Kuzey Kıbrıs&apos;ın dijital nabzını tutmak için doğdu. Adada yaşayan,
            adayı seven, ama adanın enerjisini dışarıya taşımak isteyen bir ekibin eseri.
          </p>
          <p>
            Başlangıçta küçük bir blog olarak başladık — Kıbrıslıca kelimeler, gün batımı
            fotoğrafları, yerel tarifler... Zamanla büyüdük. Haberler, harita, quiz, sözlük,
            döviz kurları, nöbetçi eczaneler. Kıbrıs&apos;ta yaşamak için ihtiyacınız olan
            her şey tek çatı altında.
          </p>
          <p>
            &quot;Ugavole&quot; kelimesi Kıbrıslıca&apos;dan geliyor — tam karşılığı &quot;ne güzel, ne harika&quot;
            demek. Adayı anlatmanın en güzel yolu bu kelimeydi zaten.
          </p>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-ugavole-surface border border-ugavole-border rounded-2xl p-6">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-black text-ugavole-text text-lg mb-2">Misyonumuz</h3>
          <p className="text-ugavole-body text-sm leading-relaxed">
            Kuzey Kıbrıs&apos;ta yaşayan ve adaya merak duyan herkese doğru, eğlenceli ve
            işlevsel içerik sunmak. Yerel haberleri küresel bir perspektifle buluşturmak.
          </p>
        </div>
        <div className="bg-ugavole-surface border border-ugavole-border rounded-2xl p-6">
          <div className="text-3xl mb-3">🔭</div>
          <h3 className="font-black text-ugavole-text text-lg mb-2">Vizyonumuz</h3>
          <p className="text-ugavole-body text-sm leading-relaxed">
            Kıbrıs&apos;ın en kapsamlı dijital platformu olmak. Haberden eğlenceye, kültürden
            günlük yaşama — adanın tüm renklerini tek ekranda buluşturmak.
          </p>
        </div>
      </section>

      {/* Neler Sunuyoruz */}
      <section className="mb-10">
        <h2 className="text-2xl font-black text-ugavole-text mb-4">Neler Sunuyoruz?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { emoji: "📰", label: "Güncel Haberler" },
            { emoji: "🗣️", label: "Kıbrıslıca Sözlük" },
            { emoji: "🌅", label: "Gün Batımı" },
            { emoji: "🗺️", label: "Anlık Harita" },
            { emoji: "🎯", label: "Eğlenceli Quiz" },
            { emoji: "💱", label: "Döviz Kurları" },
            { emoji: "💊", label: "Nöbetçi Eczaneler" },
            { emoji: "🌤️", label: "Hava Durumu" },
            { emoji: "📝", label: "Özgün İçerik" },
          ].map((item) => (
            <div key={item.label} className="bg-ugavole-surface border border-ugavole-border rounded-xl p-3 flex items-center gap-2">
              <span className="text-xl">{item.emoji}</span>
              <span className="text-ugavole-text text-sm font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Sosyal Medya */}
      <section className="mb-10">
        <h2 className="text-2xl font-black text-ugavole-text mb-4">Bizi Takip Edin</h2>
        <p className="mb-4 text-sm text-ugavole-muted">
          Yalnız sahipliği doğrulanmış Ugavole hesaplarını yayımlıyoruz.
        </p>
        <Link
          href="/sosyal-medya"
          className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-black"
        >
          Sosyal hesap durumunu gör
        </Link>
      </section>

      {/* CTA */}
      <section className="bg-ugavole-surface border border-ugavole-border rounded-2xl p-6 text-center">
        <p className="text-ugavole-body mb-4">Görüş, öneri veya işbirliği teklifi mi var?</p>
        <Link
          href="/iletisim"
          className="inline-flex items-center gap-2 bg-[#D4A017] dark:bg-[#F5C518] text-black font-black px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Bize Ulaşın
        </Link>
      </section>
    </div>
  );
}
