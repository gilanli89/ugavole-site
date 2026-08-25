import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "ugavole.com gizlilik politikası; kullanıcı katkıları, güvenlik verileri, çerezler ve üçüncü taraf hizmetler.",
};

export default function GizlilikPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-ugavole-text mb-2">Gizlilik Politikası</h1>
      <p className="text-ugavole-muted text-sm mb-8">Son güncelleme: 25 Ağustos 2026</p>

      <div className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-black prose-headings:text-ugavole-text
        prose-p:text-ugavole-body prose-p:leading-relaxed
        prose-strong:text-ugavole-text
        prose-a:text-[#D4A017] dark:prose-a:text-[#F5C518]">

        <p>
          ugavole.com (&quot;biz&quot;, &quot;sitemiz&quot;) olarak kişisel verilerinizin gizliliğine önem veriyoruz.
          Bu politika, sitemizi ziyaret ettiğinizde hangi verileri topladığımızı, nasıl kullandığımızı
          ve haklarınızın neler olduğunu açıklar.
        </p>

        <h2>1. Toplanan Veriler</h2>
        <p>Sitemizi ziyaret ettiğinizde aşağıdaki veriler otomatik olarak toplanabilir:</p>
        <ul>
          <li>Kötüye kullanımı önlemek için tek yönlü özetlenmiş ağ ve tarayıcı sinyalleri</li>
          <li>Ziyaret ettiğiniz sayfalar ve geçirdiğiniz süre</li>
          <li>Cihaz ve işletim sistemi bilgileri</li>
          <li>Gönüllü olarak gönderdiğiniz katkı, kaynak, ad ve iletişim bilgileri</li>
        </ul>

        <h2>2. Verilerin Kullanımı</h2>
        <p>Topladığımız veriler şu amaçlarla kullanılır:</p>
        <ul>
          <li>Sitenin düzgün çalışmasını sağlamak</li>
          <li>Kullanıcı deneyimini iyileştirmek</li>
          <li>İçerik ve hizmet kalitesini artırmak</li>
          <li>Teknik sorunları tespit etmek ve çözmek</li>
          <li>Spam, otomatik gönderim ve güvenlik ihlallerini önlemek</li>
          <li>Kullanıcı katkılarını doğrulamak, düzenlemek ve moderasyon sonucunu takip etmek</li>
        </ul>

        <h2>3. Saklama Süreleri</h2>
        <p>
          Kullanıcı katkısına bağlı iletişim ve kötüye kullanım kayıtları varsayılan olarak en fazla
          180 gün saklanır ve süre sonunda otomatik temizleme işlemine alınır. Hukuki bir yükümlülük,
          devam eden hak ihlali incelemesi veya güvenlik olayı bulunursa gerekli kayıtlar olay
          sonuçlanana kadar daha uzun tutulabilir. Yayımlanan katkının kamusal içerik bölümü,
          kaldırma talebi veya editoryal karar verilene kadar yayında kalabilir.
        </p>

        <h2>4. Çerez Kullanımı</h2>
        <p>
          Sitemiz, deneyiminizi kişiselleştirmek ve analitik amaçlarla çerez kullanmaktadır.
          Kullandığımız çerez türleri:
        </p>
        <ul>
          <li><strong>Zorunlu çerezler:</strong> Sitenin temel işlevleri için gereklidir (tema tercihi, oturum vb.)</li>
          <li><strong>Analitik çerezler:</strong> Yalnız açık izin verildiğinde etkinleştirilen ziyaretçi ölçümü</li>
          <li><strong>Reklam çerezleri:</strong> Yalnız açık izin ve gerekli sertifikalı izin platformu hazır olduğunda etkinleştirilen reklam hizmetleri</li>
        </ul>
        <p>
          Çerez tercihlerinizi tarayıcı ayarlarından yönetebilirsiniz. Detaylı bilgi için{" "}
          <Link href="/cerez-politikasi">Çerez Politikamızı</Link> inceleyiniz.
        </p>

        <h2>5. Üçüncü Taraf Hizmetler</h2>
        <p>Sitemizde aşağıdaki üçüncü taraf hizmetler kullanılmaktadır:</p>

        <h3>Google Tag Manager &amp; Google Analytics</h3>
        <p>
          İzin verdiğinizde site trafiğini analiz etmek için Google Analytics kullanabiliriz. Google, toplanan verileri
          kendi gizlilik politikasına göre işler:{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            policies.google.com/privacy
          </a>
        </p>

        <h3>Google AdSense</h3>
        <p>
          Yalnız gerekli izinler ve içerik uygunluğu tamamlandığında Google AdSense reklamları gösterebiliriz. Google, reklamları kişiselleştirmek
          için çerezler kullanabilir. Reklam kişiselleştirmeyi devre dışı bırakmak için{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            adssettings.google.com
          </a>{" "}
          adresini ziyaret edebilirsiniz.
        </p>

        <h3>Supabase</h3>
        <p>
          Kullanıcı katkıları, moderasyon kayıtları ve gerekli iletişim bilgileri Supabase altyapısında
          saklanır. İletişim ve güvenlik alanları kamuya açık içerik görünümüne dahil edilmez.
        </p>

        <h2>6. Veri Hakları</h2>
        <p>
          Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Genel Veri Koruma Yönetmeliği (GDPR)
          kapsamında aşağıdaki haklara sahipsiniz:
        </p>
        <ul>
          <li>Verilerinize erişim ve kopyasını talep etme</li>
          <li>Hatalı verilerin düzeltilmesini isteme</li>
          <li>Verilerinizin silinmesini talep etme (&quot;unutulma hakkı&quot;)</li>
          <li>Veri işlemeye itiraz etme</li>
          <li>Veri taşınabilirliği talep etme</li>
        </ul>
        <p>
          Bu haklarınızı kullanmak için{" "}
          <Link href="/iletisim">iletişim sayfamızdan</Link> bize ulaşabilirsiniz.
        </p>

        <h2>7. Veri Güvenliği</h2>
        <p>
          Verilerinizi yetkisiz erişim, değiştirme veya ifşaya karşı korumak için endüstri standardı
          güvenlik önlemleri alıyoruz. Ancak internet üzerinden hiçbir veri iletiminin %100 güvenli
          olmadığını hatırlatırız.
        </p>

        <h2>8. Çocukların Gizliliği</h2>
        <p>
          Sitemiz 13 yaşın altındaki çocuklardan bilerek kişisel veri toplamaz. Böyle bir veri
          toplandığının farkına varırsak derhal sileriz.
        </p>

        <h2>9. Politika Değişiklikleri</h2>
        <p>
          Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda
          sayfa üstündeki tarihi güncelleriz. Siteyi kullanmaya devam etmeniz güncellenmiş politikayı
          kabul ettiğiniz anlamına gelir.
        </p>

        <h2>10. İletişim</h2>
        <p>
          Gizlilik politikamızla ilgili sorularınız için:{" "}
          <Link href="/iletisim">İletişim formumuzdan</Link> bize ulaşabilirsiniz.
        </p>
      </div>
    </div>
  );
}
