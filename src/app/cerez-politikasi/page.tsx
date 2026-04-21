import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "ugavole.com çerez politikası. Hangi çerezleri kullandığımız ve nasıl yönetebileceğiniz hakkında bilgi.",
};

export default function CerezPolitikasiPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-ugavole-text mb-2">Çerez Politikası</h1>
      <p className="text-ugavole-muted text-sm mb-8">Son güncelleme: Ocak 2025</p>

      <div className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-black prose-headings:text-ugavole-text
        prose-p:text-ugavole-body prose-p:leading-relaxed
        prose-strong:text-ugavole-text
        prose-a:text-[#D4A017] dark:prose-a:text-[#F5C518]">

        <p>
          Bu politika, ugavole.com&apos;un çerez (cookie) kullanımını açıklar. Sitemizi kullanarak
          çerez politikamızı kabul etmiş olursunuz.
        </p>

        <h2>Çerez Nedir?</h2>
        <p>
          Çerezler, web siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır.
          Tercihlerinizi hatırlamak, oturumunuzu açık tutmak ve site deneyiminizi kişiselleştirmek
          için kullanılırlar.
        </p>

        <h2>Kullandığımız Çerezler</h2>

        <h3>Zorunlu Çerezler</h3>
        <p>
          Sitenin temel işlevleri için gereklidir. Bu çerezler olmadan site düzgün çalışmaz.
          Devre dışı bırakılamazlar.
        </p>
        <ul>
          <li><strong>theme:</strong> Tercih ettiğiniz tema (açık/koyu mod) kaydedilir</li>
          <li><strong>Oturum çerezleri:</strong> Sayfa gezinme sırasında geçici veriler tutulur</li>
        </ul>

        <h3>Analitik Çerezler (Google Analytics / GTM)</h3>
        <p>
          Sitemizi kaç kişinin ziyaret ettiğini, hangi sayfaların popüler olduğunu ve
          kullanıcıların sitede nasıl gezindiğini anlamak için kullanılır.
        </p>
        <ul>
          <li><strong>_ga, _ga_*:</strong> Google Analytics oturum ve kullanıcı takibi</li>
          <li><strong>_gid:</strong> 24 saatlik oturum tanımlayıcısı</li>
        </ul>
        <p>
          Google Analytics verilerini işleme hakkında:{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            policies.google.com/privacy
          </a>
        </p>

        <h3>Reklam Çerezleri (Google AdSense)</h3>
        <p>
          Kişiselleştirilmiş reklamlar göstermek için Google AdSense çerezleri kullanılır.
          Bu çerezler, ilgi alanlarınıza uygun reklamlar sunmayı sağlar.
        </p>
        <ul>
          <li><strong>IDE, DSID:</strong> Reklam kişiselleştirme</li>
          <li><strong>test_cookie:</strong> Çerez desteği kontrolü</li>
        </ul>

        <h3>İşlevsel Çerezler</h3>
        <ul>
          <li><strong>ugavole_voted_*:</strong> Oy verdiğiniz içerikler (tekrar oy önleme)</li>
          <li><strong>ugavole_haberler:</strong> Yerel haber taslakları (admin kullanımı)</li>
        </ul>

        <h2>Çerezleri Nasıl Yönetirsiniz?</h2>
        <p>
          Çerez tercihlerinizi tarayıcı ayarlarından yönetebilirsiniz:
        </p>
        <ul>
          <li>
            <strong>Chrome:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler
          </li>
          <li>
            <strong>Firefox:</strong> Tercihler → Gizlilik ve Güvenlik
          </li>
          <li>
            <strong>Safari:</strong> Tercihler → Gizlilik
          </li>
          <li>
            <strong>Edge:</strong> Ayarlar → Gizlilik, Arama ve Hizmetler
          </li>
        </ul>
        <p>
          Zorunlu olmayan çerezleri devre dışı bırakmanız, bazı site özelliklerinin
          düzgün çalışmamasına neden olabilir.
        </p>
        <p>
          Google reklam çerezlerini yönetmek için:{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            adssettings.google.com
          </a>
        </p>

        <h2>İletişim</h2>
        <p>
          Çerez politikamızla ilgili sorularınız için{" "}
          <Link href="/iletisim">iletişim formunu</Link> kullanabilirsiniz.
        </p>
      </div>
    </div>
  );
}
