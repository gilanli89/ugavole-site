import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ SUPABASE env eksik (.env.local kontrol et)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedContent() {
  console.log("🌱 Seed başlıyor...\n");

  // 1. Ana içeriği ekle (upsert — tekrar çalıştırılabilir)
  const { data: icerik, error: icerikError } = await supabase
    .from("liste_icerikler")
    .upsert(
      {
        slug: "televizyonun-evrimi",
        baslik: "Siyah Beyazdan 8K'a: Televizyonun 100 Yıllık Evrimi",
        ozet: "Mekanik disklerden OLED ekranlara, VHS'ten streaming'e... Televizyon 100 yılda nasıl bu hale geldi?",
        kapak_gorsel:
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200",
        kategori: "Kültür",
        etiketler: ["teknoloji", "televizyon", "tarih", "nostalji"],
        aktif: true,
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (icerikError) {
    console.error("❌ İçerik eklenemedi:", icerikError.message);
    return;
  }

  console.log("✅ İçerik eklendi:", icerik.id);

  // 2. Mevcut maddeleri temizle (idempotent)
  await supabase.from("liste_maddeler").delete().eq("icerik_id", icerik.id);

  // 3. Maddeleri ekle
  const maddeler = [
    {
      icerik_id: icerik.id,
      sira: 1,
      baslik: "Mekanik Televizyon (1920'ler)",
      aciklama:
        "1926'da İskoç mucit John Logie Baird, dönen diskler ve lambalardan oluşan ilk mekanik televizyonu halka tanıttı. Ekran diyemezsiniz buna tam — 30 satırlık titrek, bulanık bir görüntüydü. Ama insanlık ilk kez \"uzaktan görüntü\" gördü ve dünya bir daha eskisi gibi olmadı.",
      gorsel_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Baird_television_1926.jpg/640px-Baird_television_1926.jpg",
      kaynak_url: null,
      oylar: 0,
    },
    {
      icerik_id: icerik.id,
      sira: 2,
      baslik: "Elektronik Tüplü TV — CRT Devri Başlıyor (1930'lar)",
      aciklama:
        "1930'larda katot ışın tüpü (CRT) teknolojisi mekanik sistemi tarihe gömdü. RCA ve Philips gibi devler fabrikadan fabrikaya koştu. İlk televizyonlar dolabın yarısı kadardı, ekranı ise tabak büyüklüğündeydi. Sahibi olmak statü sembolüydü — komşular akın akın gelir, siyah beyaz görüntüye saatlerce bakardı.",
      gorsel_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/RCA_TRK-12_1939.jpg/640px-RCA_TRK-12_1939.jpg",
      kaynak_url: null,
      oylar: 0,
    },
    {
      icerik_id: icerik.id,
      sira: 3,
      baslik: "Yayıncılığın Altın Çağı — Siyah Beyaz Ekranlar (1950'ler)",
      aciklama:
        "1950'lerde televizyon artık lüks değil, ev eşyasıydı. ABD'de her 10 evden 9'unda ekran vardı. Haberler, diziler, reklamlar — hayat ekrana taşındı. Kıbrıs'ta ise bu yıllarda insanlar radyo başında oturuyordu; televizyon ancak 60'ların sonunda adalara ulaşacaktı.",
      gorsel_url:
        "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800",
      kaynak_url: null,
      oylar: 0,
    },
    {
      icerik_id: icerik.id,
      sira: 4,
      baslik: "Renk Devrimi — Dünya Renge Boyandı (1960'lar)",
      aciklama:
        "1967'de Avrupa PAL standardını benimsedi ve renkli yayın kıtaya yayıldı. İlk renkli görüntüyü görenler \"ekran bozuk\" sandı — kırmızı çimen, mavi yüzler... Fabrikalar renk kalibrasyonunu öğrenene kadar epey komik sahneler yaşandı. Ama artık geri dönüş yoktu.",
      gorsel_url:
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
      kaynak_url: null,
      oylar: 0,
    },
    {
      icerik_id: icerik.id,
      sira: 5,
      baslik: "VHS ve Uzaktan Kumanda — Kontrol Bizde (1970-80'ler)",
      aciklama:
        "Uzaktan kumanda 1970'lerde hayatı değiştirdi — kanal değiştirmek için artık koltuktan kalkmanıza gerek yoktu. Sonra VHS geldi: istediğin filmi istediğin saatte izlemek. \"Video gecesi\" denen sosyal ritüel doğdu. Kıbrıs'ta video kiralama dükkanları mahalle kahvehanesi kadar popülerleşti.",
      gorsel_url:
        "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800",
      kaynak_url: null,
      oylar: 0,
    },
    {
      icerik_id: icerik.id,
      sira: 6,
      baslik: "Düz Ekran Çağı — CRT Tarihe Gömüldü (2000'ler)",
      aciklama:
        "2000'lerin başında plazma ve LCD ekranlar piyasayı sarstı. Dev CRT televizyonlar bir gecede \"eski\" oldu. Duvarınıza asabileceğiniz, 10 cm kalınlığında ekranlar... O zamanlar bilim kurgu gibiydi. Satış noktaları ikinci el CRT'lerle dolup taştı, çoğu çöpe gitti.",
      gorsel_url:
        "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800",
      kaynak_url: null,
      oylar: 0,
    },
    {
      icerik_id: icerik.id,
      sira: 7,
      baslik: "Full HD ve Smart TV — İnternet Ekrana Girdi (2010'lar)",
      aciklama:
        "1080p Full HD görüntü kalitesi gözleri kamaştırırken asıl devrim başka yerden geldi: İnternet. Smart TV'ler Netflix, YouTube ve sosyal medyayı oturma odasına taşıdı. Artık yayın saatini beklemeye gerek yoktu — her şey istendiğinde, istendiği kadar. Televizyon izleme alışkanlıkları kökten değişti.",
      gorsel_url:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
      kaynak_url: null,
      oylar: 0,
    },
    {
      icerik_id: icerik.id,
      sira: 8,
      baslik: "OLED ve 4K — Piksel Artık Gözle Görülmüyor (2015-2020)",
      aciklama:
        "OLED teknolojisiyle her piksel kendi ışığını üretmeye başladı. Siyah artık gerçekten siyahtı — tam karanlık, sıfır ışık sızıntısı. Kontrast oranları astronomik seviyelere çıktı. 4K içeriklerle birlikte izlemek neredeyse \"orada olmak\" hissi vermeye başladı.",
      gorsel_url:
        "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800",
      kaynak_url: null,
      oylar: 0,
    },
    {
      icerik_id: icerik.id,
      sira: 9,
      baslik: "8K, Mini LED ve Katlanabilir Ekranlar (2020'ler)",
      aciklama:
        "8K çözünürlük, Mini LED arka aydınlatma, 144Hz yenileme hızı... Teknoloji o kadar ilerledi ki insan gözü farkı zor ayırt ediyor. Şimdi sıradaki tartışma: Ekranı büküp katlayabilir miyiz? Samsung ve LG katlanabilir prototiplerini sergiledi bile. 100 yıl önce 30 satırlık titrek görüntüyle başlayan yolculuk, bugün boyutunu değiştiren ekranlara ulaştı.",
      gorsel_url:
        "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800",
      kaynak_url: null,
      oylar: 0,
    },
    {
      icerik_id: icerik.id,
      sira: 10,
      baslik: "🛒 Siz de Televizyonunuzu Yenileme Zamanı!",
      aciklama:
        "100 yıllık bu yolculuğu en iyi görüntüyle deneyimlemek istiyorsanız iki harika seçeneğiniz var:\n\nEski televizyonunuzu yenisiyle değiştirmek için Aliosat.io'yu ziyaret edin — ikinci el elektronik alım satımında Kıbrıs'ın güvenilir adresi.\n\nYa da sıfır, 2 yıl garantili ve ücretsiz kurulumlu yeni nesil televizyonlar için Zorluplus.com'a göz atın.",
      gorsel_url:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
      kaynak_url: "https://aliosat.io",
      oylar: 0,
    },
  ];

  const { error: maddeError } = await supabase
    .from("liste_maddeler")
    .insert(maddeler);

  if (maddeError) {
    console.error("❌ Maddeler eklenemedi:", maddeError.message);
    return;
  }

  console.log(`✅ ${maddeler.length} madde eklendi`);
  console.log(
    "\n🎉 İçerik hazır! /liste/televizyonun-evrimi adresinde görünecek."
  );
}

seedContent().catch((err) => {
  console.error("❌ Beklenmedik hata:", err.message);
  process.exit(1);
});
