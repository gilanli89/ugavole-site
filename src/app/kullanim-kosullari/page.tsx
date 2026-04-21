import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description: "ugavole.com kullanım koşulları. Siteyi kullanarak bu koşulları kabul etmiş sayılırsınız.",
};

export default function KullanimKosullariPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-ugavole-text mb-2">Kullanım Koşulları</h1>
      <p className="text-ugavole-muted text-sm mb-8">Son güncelleme: Ocak 2025</p>

      <div className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-black prose-headings:text-ugavole-text
        prose-p:text-ugavole-body prose-p:leading-relaxed
        prose-strong:text-ugavole-text
        prose-a:text-[#D4A017] dark:prose-a:text-[#F5C518]">

        <p>
          ugavole.com&apos;u (&quot;Site&quot;) kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
          Bu koşulları kabul etmiyorsanız lütfen siteyi kullanmayınız.
        </p>

        <h2>1. Hizmet Tanımı</h2>
        <p>
          ugavole.com, Kuzey Kıbrıs odaklı haber, kültür, eğlence ve bilgi hizmetleri sunan
          bir dijital platformdur. İçerikler bilgilendirme amaçlıdır.
        </p>

        <h2>2. Kullanım Koşulları</h2>
        <p>Siteyi kullanırken şunları kabul edersiniz:</p>
        <ul>
          <li>18 yaşında veya üzerinde olduğunuzu ya da ebeveyn onayınızın bulunduğunu</li>
          <li>Kişisel kullanım dışında içerikleri izinsiz kopyalamayacağınızı</li>
          <li>Siteye zarar verecek ya da diğer kullanıcıları rahatsız edecek içerik göndermeyeceğinizi</li>
          <li>Yanlış, yanıltıcı veya zararlı bilgi paylaşmayacağınızı</li>
          <li>Otomatik araçlarla içerik kazımayacağınızı (scraping)</li>
        </ul>

        <h2>3. Fikri Mülkiyet</h2>
        <p>
          ugavole.com logosu, tasarımı ve özgün içerikleri telif hakkı kapsamındadır. RSS
          haberleri ilgili kaynaklara aittir ve kaynak linki ile sunulmaktadır. İçerikleri
          ticari amaçla kullanmak için önceden yazılı izin alınması gerekmektedir.
        </p>

        <h2>4. Kullanıcı İçerikleri</h2>
        <p>
          Platforma haber veya fotoğraf yükleyerek:
        </p>
        <ul>
          <li>İçeriğin size ait olduğunu veya yayımlama hakkına sahip olduğunuzu beyan edersiniz</li>
          <li>ugavole&apos;ye içeriği yayımlamak için lisans vermiş olursunuz</li>
          <li>Hakaret, iftira, telif hakkı ihlali içeren içeriklerden sorumlu olduğunuzu kabul edersiniz</li>
        </ul>
        <p>
          Uygunsuz içerikleri bildirmek veya kaldırılmasını talep etmek için{" "}
          <Link href="/iletisim">iletişim formunu</Link> kullanabilirsiniz.
        </p>

        <h2>5. Sorumluluk Sınırlaması</h2>
        <p>
          ugavole.com, RSS kaynaklarından gelen haberlerin doğruluğunu garanti etmez.
          Üçüncü taraf haber kaynaklarındaki hatalardan sorumlu tutulamaz. Siteyi kullanımınızdan
          doğabilecek dolaylı veya doğrudan zararlar için sorumluluk kabul edilmez.
        </p>

        <h2>6. Harici Bağlantılar</h2>
        <p>
          Sitemizde üçüncü taraf web sitelerine bağlantılar bulunabilir. Bu sitelerin
          içeriklerinden veya gizlilik politikalarından sorumlu değiliz.
        </p>

        <h2>7. Hizmet Değişiklikleri</h2>
        <p>
          ugavole, önceden haber vermeksizin site içeriğini, tasarımını veya sunulan
          hizmetleri değiştirme ya da durdurma hakkını saklı tutar.
        </p>

        <h2>8. Uygulanacak Hukuk</h2>
        <p>
          Bu koşullar, Kuzey Kıbrıs Türk Cumhuriyeti yasaları çerçevesinde yorumlanır.
          Anlaşmazlıklarda KKTC mahkemeleri yetkilidir.
        </p>

        <h2>9. İletişim</h2>
        <p>
          Kullanım koşullarıyla ilgili sorularınız için{" "}
          <Link href="/iletisim">iletişim formunu</Link> kullanabilirsiniz.
        </p>
      </div>
    </div>
  );
}
