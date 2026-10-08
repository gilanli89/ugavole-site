import type { Article } from "./news";

type EditorialArticle = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category:
    | "Gezi"
    | "Kültür"
    | "Yemek"
    | "Yaşam"
    | "Eğlence"
    | "Gündem"
    | "Spor"
    | "Dünya"
    | "Ekonomi"
    | "Teknoloji"
    | "Bilim & Uzay";
  published_at: string;
  original_source_url?: string;
};

function editorial(input: EditorialArticle): Article {
  return {
    id: `editorial-${input.slug}`,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content.trim(),
    cover_image: input.cover_image.includes("images.unsplash.com")
      ? `${input.cover_image}?auto=format&fit=crop&w=1400&q=82`
      : input.cover_image,
    source_url: `https://ugavole.com/haber/${input.slug}`,
    original_source_url: input.original_source_url,
    source_name: "ugavole",
    category: input.category,
    published_at: input.published_at,
    is_ugc: false,
    author: "Ugavole Editörleri",
  };
}

export const EDITORIAL_ARTICLES: Article[] = [
  editorial({
    slug: "dso-cocuk-ergen-obezite-rehberi",
    title: "DSÖ'den Çocuk ve Ergen Obezitesinde İlk Küresel Bakım Rehberi",
    excerpt: "DSÖ'nün ilk küresel çocuk ve ergen obezitesi rehberi, aileyi sürece katan uzun vadeli yaşam tarzı desteğini merkeze alıyor; ilaç ve cerrahi için sıkı sınırlar çiziyor.",
    category: "Yaşam",
    published_at: "2026-10-08T09:07:00+03:00",
    cover_image: "/editorial/2026-10-08/dso-cocuk-ergen-obezite-rehberi.webp",
    original_source_url: "https://www.who.int/news/item/07-10-2026-who-issues-first-global-guidelines-on-child-and-adolescent-obesity",
    content: `
<p>Dünya Sağlık Örgütü, çocuk ve ergenlerde obezitenin bakımına ilişkin ilk küresel rehberini 7 Ekim'de yayımladı. Kurumun tahminine göre 2024'te 5–19 yaş grubunda 170 milyon çocuk ve ergen obeziteyle yaşıyordu; bu yaş grubundaki yaygınlık 1990'dan bu yana yüzde 2'den yüzde 8'e çıktı.</p>

<h2>Bakımın merkezinde ne var?</h2>

<p>Rehber, beslenme, fiziksel hareket ve davranış desteğini bir araya getiren yapılandırılmış programları güçlü biçimde öneriyor. Müdahalenin tek bir alana odaklanması da mümkün; ancak yaklaşımın yaşa uygun, kişi merkezli ve mümkün olduğunda aile veya bakım verenin katıldığı bir planla yürütülmesi isteniyor. Ruh sağlığının değerlendirilmesi, damgalayıcı dilden kaçınılması ve uzun vadeli izlem de bakımın parçası.</p>

<p>Dijital araçlarla yürütülen programlar, bakım veren gözetimi olduğunda koşullu olarak öneriliyor. Bu, bir uygulamanın tek başına tedavi olduğu anlamına gelmiyor. DSÖ, bakım planının çocuk ve ailesinin koşullarına göre sağlık profesyonellerince kurulmasını; güvenilir büyüme ölçümleri ile düzenli takibin birlikte yürütülmesini vurguluyor.</p>

<h2>İlaç ve cerrahi için hangi sınırlar çizildi?</h2>

<p>Rehber, 0–9 yaş grubunda kilo kaybı amacıyla ilaç, obezite cerrahisi veya cihaz kullanımını önermiyor. 10–19 yaş grubunda onaylı bir ilacın değerlendirilmesi ise ancak sağlık profesyonelinin gözetimindeki kapsamlı yaşam tarzı programı yeterli sonuç vermediğinde gündeme gelebiliyor. Cerrahi seçenek yalnız ağır obezite için, sıkı ölçütler ve uzman ekip değerlendirmesi altında ele alınıyor.</p>

<p>Bu çerçeve her çocuk için aynı reçeteyi sunmuyor. Büyüme dönemi, eşlik eden sağlık sorunları, psikolojik iyilik hâli ve aile koşulları kararın parçası. Rehber ayrıca bakımın yalnız kilo ölçümüne indirgenmemesini; çocuğun günlük yaşamı, katılımı ve genel sağlığındaki gelişmelerin de izlenmesini istiyor. Küresel sağlık verilerinin nasıl karşılaştırıldığına ilişkin başka bir örnek için <a href="/haber/dso-kuresel-saglik-tahminleri-2023">DSÖ'nün küresel sağlık tahminleri yazısına</a> da bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler DSÖ'nün 7 Ekim 2026 tarihli <a href="https://www.who.int/news/item/07-10-2026-who-issues-first-global-guidelines-on-child-and-adolescent-obesity" target="_blank" rel="noopener noreferrer">rehber duyurusu</a>, <a href="https://www.who.int/publications/i/item/9789240123397" target="_blank" rel="noopener noreferrer">çocuklar</a> ve <a href="https://www.who.int/publications/i/item/9789240123878" target="_blank" rel="noopener noreferrer">ergenler için yayımlanan rehber sayfaları</a> temel alınarak derlenmiştir. Bu yazı tıbbi tavsiye değildir; kişisel değerlendirme için yetkili sağlık profesyoneline başvurulmalıdır. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek bir hasta, aile veya klinik görüşmesini göstermez.</p>
    `,
  }),
  editorial({
    slug: "unep-dusuk-enerjili-bina-serinletme",
    title: "Binaları Daha Az Enerjiyle Serinletmenin Beş Yolu",
    excerpt: "UNEP, serin çatıdan dış gölgelendirmeye kadar beş düşük enerjili yöntemin iklime göre bir arada kullanıldığında iç mekân sıcaklığını önemli ölçüde düşürebileceğini belirtiyor.",
    category: "Dünya",
    published_at: "2026-10-08T09:06:00+03:00",
    cover_image: "/editorial/2026-10-08/dusuk-enerjili-bina-serinletme.webp",
    original_source_url: "https://www.unep.org/news-and-stories/story/air-conditioning-may-cool-room-it-also-heats-world-here-are-five-more",
    content: `
<p>Kentler çevredeki kırsal alanlardan 10 dereceye kadar daha sıcak olabiliyor. Birleşmiş Milletler Çevre Programı'nın 7 Ekim'de yayımladığı değerlendirme, soğutma talebinin 2050'ye kadar üç katına çıkma yolunda olduğunu ve standart klima kullanımından kaynaklanan emisyonların neredeyse ikiye katlanabileceğini belirtiyor.</p>

<h2>Serin çatı ve dış gölgelendirme</h2>

<p>UNEP'in ilk önerisi güneş ışığını yansıtan açık renkli çatı ve duvar yüzeyleri. Serin çatılar yüzey sıcaklığını 20 dereceye kadar düşürebiliyor; Delhi'deki bir otobüs terminalinde iç mekânda 2–3 derecelik azalma ölçüldü. İkinci yöntem, güneş camdan içeri girmeden önce tente, panjur, saçak veya bitkiyle gölge oluşturmak. Dış gölgeleme, içerideki perdeye göre ısıyı daha erken kesiyor.</p>

<p>Üçüncü yol doğal havalandırma. Karşılıklı açıklıklar, avlular ve sıcak havayı yukarı taşıyan bacalar doğru iklimde klima kullanımını yüzde 55'e kadar azaltabiliyor. Ancak dışarıdaki hava sıcak, nemli ya da kirliyse pencereleri açmak uygun olmayabilir; tasarım yerel hava koşullarına göre yapılmalı.</p>

<h2>Yeşil alan, fan ve buharlaşmalı soğutma</h2>

<p>Ağaçlar, yeşil çatılar ve su yüzeyleri gölge ile buharlaşmayı birleştirerek çevreyi serinletiyor. Beşinci başlıkta ise fanlar ve sıcak-kuru bölgelerde buharlaşmalı soğutucular yer alıyor. Fanlar hissedilen sıcaklığı 4 dereceye kadar azaltabilir. Buharlaşmalı sistemler uygun koşullarda standart klimaya göre yüzde 80–90 daha az elektrik kullanabilir; yüksek nemli bölgelerde aynı etkiyi sağlamaz.</p>

<p>UNEP'e göre bu pasif ve düşük enerjili çözümler iklime bağlı olarak birlikte kullanıldığında binaları 6–9 derece serinletebilir. Yine de aşırı sıcak dalgalarında klima hayat kurtarıcı olabilir. Amaç onu her koşulda kaldırmak değil; binaya giren ısıyı azaltıp gereken mekanik soğutmayı daha verimli hale getirmek. Mevcut bir binada en uygun adım; yön, yalıtım, nem, hava kalitesi ve kullanıcıların sağlık ihtiyaçları birlikte incelendikten sonra seçilmeli. Kalabalık alanlarda sıcak riskini yönetmeye ilişkin tamamlayıcı bilgiler için <a href="/haber/kalabalik-etkinliklerde-asiri-sicak-rehberi">aşırı sıcak rehberine</a> de bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler UNEP'in 7 Ekim 2026 tarihli <a href="https://www.unep.org/news-and-stories/story/air-conditioning-may-cool-room-it-also-heats-world-here-are-five-more" target="_blank" rel="noopener noreferrer">düşük enerjili soğutma değerlendirmesinden</a> derlenmiştir. Verilen aralıklar iklim, bina ve uygulama kalitesine göre değişebilir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; belirli bir bina veya projeyi göstermez.</p>
    `,
  }),
  editorial({
    slug: "mars-arsia-mons-uzun-bulut-buzlanma",
    title: "Mars'ın 1.800 Kilometrelik Bulutu Nadir Bir Buzlanma Sürecini Gösteriyor",
    excerpt: "ESA'nın yeni modellemesi, Arsia Mons yakınında her yıl oluşan dev su buzu bulutunun toz tanecikleri olmadan başlayan sıra dışı bir buzlanma süreciyle büyüyebileceğini gösteriyor.",
    category: "Bilim & Uzay",
    published_at: "2026-10-08T09:05:00+03:00",
    cover_image: "/editorial/2026-10-08/mars-arsia-mons-uzun-bulut.webp",
    original_source_url: "https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Mars_s_oddest_cloud_may_be_even_odder_than_we_thought",
    content: `
<p>Mars'ın Arsia Mons yanardağının çevresinde beliren uzun beyaz bulut, gezegenin en sıra dışı mevsimlik olaylarından biri. Avrupa Uzay Ajansı'nın 7 Ekim'de aktardığı yeni çalışma, 1.800 kilometreye kadar uzayabilen bu su buzu bulutunun toz parçacıklarına ihtiyaç duymadan başlayan nadir bir buzlanma süreciyle oluşabileceğini gösteriyor.</p>

<h2>Bulut neden her sabah yeniden oluşuyor?</h2>

<p>Arsia Mons Elongated Cloud adı verilen yapı, Mars'ın güney yarımküresinde ilkbahar ve yaz aylarında, gezegenin tozlu döneminde ortaya çıkıyor. Yaklaşık 20 kilometre yüksekliğindeki yanardağın rüzgâr altı tarafında oluşuyor; sabah saatlerinde büyüyüp uzuyor ve gün içinde kayboluyor. Mars Express'in sabah gözlemi yapabilen VMC, HRSC ve OMEGA aygıtları bu günlük döngüyü yıllardır izliyor.</p>

<p>Yeni atmosfer modeli, hava kütlelerinin yanardağın yamacında birkaç dakika içinde birkaç kilometre yükseldiğini; sıcaklığın 10 dakikada yaklaşık 30 derece düştüğünü gösteriyor. Böylece su buharı kısa süreliğine aşırı doygun hale geliyor. Araştırmacıların modelinde buhar, olağan biçimde bir toz taneciği üzerinde yoğunlaşmak yerine doğrudan buz parçacıklarına dönüşüyor. Buna homojen çekirdeklenme deniyor.</p>

<h2>Dünya'dakinden neden bu kadar farklı?</h2>

<p>Model, bağıl nemin günlük Dünya koşullarının 100 bin katından fazla olabildiğini öne sürüyor. Bu aşırı değer, Mars atmosferinin çok ince olması, Arsia Mons'un yüksekliği ve hızlı sıcaklık düşüşünün birleşiminden kaynaklanıyor. Dünya atmosferindeki bulutlarda buz kristalleri genellikle toz veya başka parçacıkların üzerinde başlıyor; modelin önerdiği süreç bu nedenle ender.</p>

<p>Sonuç doğrudan ölçülmüş kesin bir mekanizma değil. ESA, modelin gözlemlerin bazı ayrıntılarını tam olarak yeniden üretemediğini de belirtiyor. Çalışma güçlü bir açıklama sunuyor ve gelecekteki gözlemlerin hangi sıcaklık, nem ve parçacık koşullarını araması gerektiğini gösteriyor. Bulutun günlük ritmi, Mars'ın su döngüsünü ve dağların ince atmosferi nasıl yönlendirdiğini anlamak için doğal bir laboratuvar sağlıyor. Arsia Mons'a ilişkin bu bulgu, <a href="/haber/esa-mars-gezgini-tabernas-colu-testi">Avrupa'nın Mars gezgini için yaptığı çöl provasının</a> ardından gezegen araştırmalarındaki ikinci güncel ESA başlığı.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler ESA'nın 7 Ekim 2026 tarihli <a href="https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Mars_s_oddest_cloud_may_be_even_odder_than_we_thought" target="_blank" rel="noopener noreferrer">Mars Express bilim açıklaması</a> ve bağlantılı Nature Geoscience araştırması temel alınarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bilimsel görselleştirmedir; Mars Express fotoğrafı veya gerçek renkli yüzey görüntüsü değildir.</p>
    `,
  }),
  editorial({
    slug: "dag-yolu-30-kasima-kadar-kucuk-araclara-kapali",
    title: "Dağ Yolu 30 Kasım'a Kadar Küçük Araçlara Kapalı",
    excerpt: "Karayolları Dairesi, Lefkoşa-Gazimağusa ile Değirmenlik-Girne-Esentepe dağ yolu güzergâhının yol çalışmaları nedeniyle otomobil ve motosikletlere 30 Kasım'a kadar kapatıldığını duyurdu.",
    category: "Gündem",
    published_at: "2026-10-07T09:07:00+03:00",
    cover_image: "/editorial/2026-10-07/dag-yolu-kapanisi.webp",
    original_source_url: "https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14990",
    content: `
<p>Karayolları Dairesi, Lefkoşa-Gazimağusa ile Değirmenlik-Girne-Esentepe dağ yolu güzergâhındaki devam eden çalışmalar nedeniyle yolu otomobil ve motosiklet türü küçük araçlara kapattı. 6 Ekim'de yayımlanan duyuruya göre kapanış 30 Kasım 2026'ya kadar sürecek.</p>

<h2>Kapanış hangi araçları ve güzergâhı kapsıyor?</h2>

<p>Resmî açıklama, özellikle otomobil ve motosikletleri kapsıyor. Duyuruda “dağ yolu” ifadesi Lefkoşa-Gazimağusa, Değirmenlik-Girne-Esentepe güzergâhıyla birlikte veriliyor. Çalışmanın hangi kilometreleri kapsadığı, ağır araçlar için ayrıntılı geçiş düzeni ve sabit bir alternatif rota paylaşılmadı. Bu yüzden sürücülerin yalnız harita uygulamasının önerisine güvenmek yerine yola çıkmadan hemen önce güncel resmî duyuruyu kontrol etmesi gerekiyor.</p>

<p>Karayolları Dairesi, çalışma bölgesini kullanacak sürücülerden ikinci bir duyuruya kadar dikkatli ve yavaş seyretmelerini, trafik işaretleri ile sahadaki görevlilerin yönlendirmelerine uymalarını istedi. Bir yolun haritada açık görünmesi, sahadaki geçici bariyer veya araç sınıfı kısıtlamasının kalktığı anlamına gelmeyebilir.</p>

<p>Kapanış duyurusu bir yol güvenliği önlemi; güzergâhın bütünüyle bütün araç trafiğine kapatıldığı biçiminde yorumlanmamalı. Açıklamada sayılan araç sınıfları otomobil ve motosikletler. Kamyon, otobüs veya servis araçlarıyla ilgili özel düzenlemeyi öğrenmek isteyen sürücü ve işletmelerin Karayolları Dairesi'nin güncel yönlendirmesine başvurması gerekiyor. Sahadaki levhalar, yayımlanmış metinden daha yeni bir durumu gösterebilir.</p>

<h2>Yola çıkmadan önce kısa kontrol</h2>

<p>Girne, Esentepe, Değirmenlik veya Lefkoşa yönünde bu bağlantıyı kullanmayı planlayanların hareket saatine pay bırakması; yakıt durumunu, hava koşullarını ve seçilecek güzergâhın araçlarına uygunluğunu kontrol etmesi yararlı olur. Navigasyon uygulamalarında görünen kestirmeler dar, bakımsız veya geçişe uygun olmayan yollar olabilir. İşaretlenmemiş tali yollara girmek yerine görevli yönlendirmesi izlenmeli.</p>

<p>Kapanış için belirtilen 30 Kasım tarihi mevcut planı gösteriyor; yolun daha erken açılması ya da çalışmanın uzaması yeni bir açıklamaya bağlı. Karpaz ve doğu yönündeki uzun sürüşler için genel hazırlık notlarını <a href="/haber/karpaz-yolculugu-yola-cikmadan-bilmeniz-gerekenler">Karpaz yolculuğu rehberinde</a> bulabilirsiniz.</p>

<p>Toplu taşıma, okul servisi veya ticari teslimat planlayanların da hareket saatini tek bir güzergâha göre sabitlememesi önemli. Yolculuk öncesinde sürücüyle rotayı teyit etmek, özellikle yoğun saatlerde gecikme riskini azaltabilir. Duyuruda alternatif yol adı verilmediği için bu yazı belirli bir sapak önermiyor.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler Karayolları Dairesi'nin duyurusunu aktaran Radyo Güven'in 6 Ekim 2026 tarihli <a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14990" target="_blank" rel="noopener noreferrer">yol kapanışı haberinden</a> derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek çalışma noktasını veya güncel trafik durumunu göstermez.</p>
    `,
  }),
  editorial({
    slug: "dso-agiz-sagligi-izleme-modulu",
    title: "Ağız Sağlığı Verileri Ülkeler İçin Nasıl Karşılaştırılabilir Olacak?",
    excerpt: "DSÖ'nün güncellediği STEPS ağız sağlığı modülü, kısa bir anket ile basitleştirilmiş klinik değerlendirmeyi birleştirerek ülkelerin karşılaştırılabilir nüfus verisi üretmesini hedefliyor.",
    category: "Yaşam",
    published_at: "2026-10-07T09:06:00+03:00",
    cover_image: "/editorial/2026-10-07/dso-agiz-sagligi-izleme.webp",
    original_source_url: "https://www.who.int/news/item/06-10-2026-who-reinforces-oral-disease-surveillance-with-an-updated-ncd-steps-module",
    content: `
<p>Diş çürüğü, diş eti hastalıkları ve bakıma erişim gibi sorunları karşılaştırmak için yalnız tedavi kayıtları yeterli değil. Dünya Sağlık Örgütü'nün 6 Ekim'de tanıttığı güncellenmiş STEPS ağız sağlığı modülü, ülkelerin temsili nüfus örneklerinden daha düzenli ve politika açısından kullanılabilir veri toplamasını amaçlıyor.</p>

<h2>STEPS yaklaşımı neyi değiştiriyor?</h2>

<p>STEPS, bulaşıcı olmayan hastalıkların davranışsal ve biyolojik risk etkenlerini standart biçimde izlemek için kullanılan bir DSÖ çerçevesi. Ağız sağlığı bölümü 2024'te yenilendi; yeni bilimsel makale ise bu sürümün nasıl uygulanabileceğini ayrıntılandırıyor. Temel fikir, ağız hastalıklarını ayrı ve pahalı bir araştırma olarak ele almak yerine mevcut nüfus taramalarına eklemek.</p>

<p>Güncellenen modül iki veri türünü bir araya getiriyor: kişilerin ağız sağlığı ve hizmete erişim deneyimlerini bildirdiği kısa bir anket ile eğitilmiş saha personelinin yapabildiği basitleştirilmiş klinik değerlendirme. DSÖ, değerlendirmenin yalnız ağız sağlığı uzmanları tarafından yapılmak zorunda olmamasını uygulanabilirliği artıran başlıca özelliklerden biri olarak gösteriyor.</p>

<h2>Toplanan veri ne işe yarayabilir?</h2>

<p>Ortak sorular ve ölçüm adımları, bölgeler ile yıllar arasındaki değişimi izlemeyi kolaylaştırabilir. Böylece hangi grupların bakıma ulaşamadığı, önleme programlarının nerede güçlendirilmesi gerektiği ve ulusal politikaların sonuç üretip üretmediği daha görünür hale gelebilir. Modül ayrıca DSÖ'nün 2023–2030 Küresel Ağız Sağlığı Eylem Planı göstergeleriyle uyumlu olacak biçimde tasarlandı.</p>

<p>Güncellenmiş anket, politika kararlarıyla bağlantılı ağız sağlığı ve bakıma erişim göstergelerine odaklanıyor. Kısa klinik bölüm ise uzman olsun veya olmasın uygun biçimde eğitilmiş sağlık personelinin uygulayabileceği şekilde sadeleştirildi. Bu tasarım, ölçüm standardını korurken saha ekiplerinin ve bütçenin sınırlı olduğu ülkelerde veri toplama eşiğini düşürmeyi hedefliyor.</p>

<p>Öz bildirim ile gözlemin birlikte kullanılması da önemli. Bir kişinin ağrı veya hizmete erişim deneyimi, klinik bulguyla aynı şeyi ölçmüyor; iki kaynak yan yana geldiğinde hastalık yükü ile karşılanmayan bakım ihtiyacı daha ayrıntılı incelenebiliyor. Temsili örneklem kurulmadığında ise sonuçlar bütün nüfusa genellenemez.</p>

<p>Bu araç tek başına tedavi sağlamıyor ve bir kişinin diş muayenesinin yerini tutmuyor. Değeri, anonim nüfus verisini karar süreçlerine taşımasında. Halk sağlığı altyapısında standart verinin başka bir örneği için <a href="/haber/dso-2025-su-sanitasyon-hijyen-raporu">su, sanitasyon ve hijyen raporu yazısına</a> da bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler DSÖ'nün 6 Ekim 2026 tarihli <a href="https://www.who.int/news/item/06-10-2026-who-reinforces-oral-disease-surveillance-with-an-updated-ncd-steps-module" target="_blank" rel="noopener noreferrer">STEPS ağız sağlığı modülü açıklaması</a> ve bağlantılı Bulletin makalesi temel alınarak derlenmiştir. Bu yazı tıbbi tavsiye değildir. Kapak temsili bir editoryal görseldir; gerçek bir araştırmayı veya hastayı göstermez.</p>
    `,
  }),
  editorial({
    slug: "esa-mars-gezgini-tabernas-colu-testi",
    title: "Avrupa'nın Mars Gezgini İspanya Çölünde 220 Metrelik Prova Yaptı",
    excerpt: "Rosalind Franklin görevi için kullanılan Charlie prototipi, Tabernas Çölü'nde sekiz günde 220 metre ilerledi; ekip uzaktan bilim planlaması ve otonom sürüş süreçlerini sınadı.",
    category: "Bilim & Uzay",
    published_at: "2026-10-07T09:05:00+03:00",
    cover_image: "/editorial/2026-10-07/esa-mars-gezgini-col-testi.webp",
    original_source_url: "https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/European_rover_trains_for_Mars_in_the_desert",
    content: `
<p>Avrupa Uzay Ajansı'nın Mars çalışmaları, Kızıl Gezegen'e gitmeden önce İspanya'da zorlu bir saha provasından geçti. Charlie adlı gezgin prototipi, Tabernas Çölü'nde sekiz gün boyunca toplam 220 metre ilerlerken yaklaşık 100 bilim insanı ve mühendis aracı 1.200 kilometre uzaktaki merkezden yönetti.</p>

<h2>Neden bir Dünya çölü kullanıldı?</h2>

<p>Güneydoğu İspanya'daki kurak ve kayalık alan, jeolojisi ile engebeli yüzeyi nedeniyle Mars'ta karşılaşılabilecek karar sorunlarını canlandırmaya elverişli. Deneme, 2030'da Mars'a inmesi planlanan ExoMars Rosalind Franklin gezgininin günlük bilim operasyonlarına hazırlık niteliği taşıyor. Prototip, hedefe giderken tehlikelerden kaçınmasını sağlayacak gerçek görev yazılımıyla çalıştı.</p>

<p>Torino'daki Gezgin Operasyonları Kontrol Merkezi ekibi, yalnız aracın gönderdiği görüntüler, yeraltı radarı ve tayf ölçümlerini kullanarak araştırılacak noktaları seçti. Bir eğimin verilerde gerçekte olduğundan daha dik görünmesi, uzak ekiplerin temkinli bir rota belirlemesine yol açtı. Sayısal yükseklik haritası incelendiğinde eğimin güvenli olduğu anlaşıldı. Yağmurun çalışmayı kesmesi ise planın beklenmedik koşullara göre yeniden kurulmasını gerektirdi.</p>

<p>Testte geniş ve dar açılı kameraların yanında yakın plan görüntüleme sistemi, tayfölçer ve yeraltına nüfuz eden radarın prototipleri kullanıldı. Bu araçların birlikte değerlendirilmesi, yüzeyde ilginç görünen bir hedefin altında veya mineral yapısında araştırmaya değer bir işaret bulunup bulunmadığını anlamaya yardım ediyor. Bilim ekibi her günün verisini işleyip ertesi gün gönderilecek komutları ortak bir plana dönüştürdü.</p>

<h2>Otonom sürüş denemesi ne gösterdi?</h2>

<p>ESA'ya göre Charlie altıncı gün operatör direksiyonda olmadan 60 metreden fazla yol aldı ve konumlama hatası yüzde 1'in altında kaldı. Bu sonuç, Mars ile Dünya arasındaki iletişim gecikmesi nedeniyle her hareketin gerçek zamanlı kullanılamadığı görevlerde önemli. Yine de saha testi, 2030 görev başarısının garantisi değil; ekiplerin yazılımı, araçları ve karar zincirini geliştirmesi için kontrollü bir prova.</p>

<p>2027 yazındaki sonraki testte Mars yörüngesindeki Trace Gas Orbiter'ın da canlandırmaya katılması planlanıyor. Mars kayaçlarından geçmiş su izlerinin nasıl okunduğunu görmek için <a href="/haber/perseverance-marsta-uc-ayri-su-etkilesimi">Perseverance bulguları yazısına</a> da göz atılabilir.</p>

<p>Rosalind Franklin'in ana bilim hedefi, Mars'taki eski mikrobiyal etkinliğe ilişkin izleri araştırmak. Bunun için yalnız aracın sağlam çalışması değil, sınırlı görev süresi içinde doğru hedeflerin seçilmesi de gerekiyor. Çöl provası bu nedenle bir sürüş gösterisinden çok, araç ile uzaktaki bilim ekibinin aynı karar zincirinde çalışmasını sınayan operasyon denemesi niteliği taşıyor.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler ESA'nın 6 Ekim 2026 tarihli <a href="https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/European_rover_trains_for_Mars_in_the_desert" target="_blank" rel="noopener noreferrer">Avrupa gezgini saha testi açıklamasından</a> derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; ESA fotoğrafı, Mars yüzeyi veya gerçek test anı değildir.</p>
    `,
  }),
  editorial({
    slug: "unesco-2030-ogretmen-acigi-50-milyon",
    title: "Dünyanın 2030'a Kadar 50 Milyon Yeni Öğretmene İhtiyacı Var",
    excerpt: "UNESCO'nun yeni verileri, evrensel okul öncesi, ilkokul ve ortaöğretim için 2030'a kadar 50 milyon ek öğretmen gerektiğini; ihtiyacın büyük bölümünün meslekten ayrılanların yerini dolduracağını gösteriyor.",
    category: "Dünya",
    published_at: "2026-10-06T09:07:00+03:00",
    cover_image: "/editorial/2026-10-06/unesco-ogretmen-acigi.webp",
    original_source_url: "https://www.unesco.org/en/articles/new-unesco-data-every-two-teachers-world-needs-one-more",
    content: `
<p>Dünyada bugün yaklaşık 107 milyon öğretmen görev yapıyor; ancak okul öncesinden ortaöğretimin sonuna kadar evrensel erişim için 2030'a dek 50 milyon öğretmene daha ihtiyaç var. UNESCO'nun 5 Ekim Dünya Öğretmenler Günü'nde açıkladığı yeni veri, mevcut her iki öğretmene karşılık yaklaşık bir yeni öğretmen gerektiği anlamına geliyor.</p>

<h2>Açığın çoğu yeni sınıflardan değil, meslekten ayrılmalardan geliyor</h2>

<p>İhtiyacın tamamı öğrenci sayısındaki artıştan kaynaklanmıyor. UNESCO'ya göre 2030'a kadar gereken öğretmenlerin yüzde 58'i, meslekten ayrılanların yerini doldurmak için işe alınacak. Yıllık ayrılma oranı okul öncesinde yüzde 7,2; ortaöğretimde yüzde 5,4 ve ilkokulda yüzde 4,7 olarak veriliyor. Bu nedenle yalnız daha fazla aday yetiştirmek, çalışma koşulları ve meslekte kalma sorunu çözülmeden kalıcı sonuç üretmeyebilir.</p>

<p>Mesleğin toplumdaki değeri de ayrılma niyetini etkiliyor. OECD'nin TALIS 2024 araştırmasına katılan ülkelerin dörtte üçünde öğretmenlerin yüzde 40'ından azı mesleklerinin toplum tarafından değerli görüldüğünü düşünüyor. Değer gördüğünü hisseden öğretmenlerin, beş yıl içinde mesleği bırakmayı düşünme olasılığı yüzde 10'dan fazla daha düşük.</p>

<h2>Maaş ile görünmeyen iş yükü birlikte ele alınmalı</h2>

<p>UNESCO'nun derlediği verilere göre incelenen 68 ülkenin beşte ikisinde öğretmen maaşları, tüm eğitim düzeylerinde benzer nitelik isteyen mesleklerin altında kalıyor. Haftada ortalama 19 saat sınıfta ders verilmesine karşılık toplam çalışma süresi hazırlık, değerlendirme ve idari görevlerle yaklaşık 60 saate ulaşıyor. İlkokulda eğitimli öğretmen başına düşen öğrenci sayısı küresel ölçekte 28.</p>

<p>Öneriler; öğretmenleri politika tasarımına katmayı, açık meslek standartları ve kariyer yolları kurmayı, ücretleri rekabetçi hale getirmeyi, personel bulmanın zor olduğu okullara hedefli teşvikler vermeyi ve gereksiz iş yükünü azaltmayı içeriyor. Sayısal hedef, eğitim niteliği ve öğretmenin meslekte kalmasıyla birlikte izlenmeli. Teknolojinin öğretmen ihtiyacını nasıl destekleyebileceğine dair ayrı bir bakış için <a href="/haber/kirsal-okullarda-yapay-zeka-ogretmen-yetkinligi">kırsal okullarda yapay zekâ ve öğretmen yetkinliği yazısına</a> da bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler UNESCO'nun 5 Ekim 2026 tarihli <a href="https://www.unesco.org/en/articles/new-unesco-data-every-two-teachers-world-needs-one-more" target="_blank" rel="noopener noreferrer">yeni öğretmen verileri açıklaması</a> ve <a href="https://www.unesco.org/en/days/teachers" target="_blank" rel="noopener noreferrer">Dünya Öğretmenler Günü sayfası</a> temel alınarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek bir sınıfı, öğretmeni veya öğrenciyi göstermez.</p>
    `,
  }),
  editorial({
    slug: "dso-2025-su-sanitasyon-hijyen-raporu",
    title: "Temiz Su ve Sanitasyon Açığı Neden Bir Sağlık Krizi?",
    excerpt: "DSÖ'nün 2025 WASH raporu, milyarlarca insanın güvenli su, sanitasyon ve hijyen hizmetlerinden yoksun kaldığını; sağlık tesislerindeki temel su eksikliğinin de sürdüğünü gösteriyor.",
    category: "Yaşam",
    published_at: "2026-10-06T09:06:00+03:00",
    cover_image: "/editorial/2026-10-06/dso-wash-su-sanitasyon.webp",
    original_source_url: "https://www.who.int/publications/i/item/B09880",
    content: `
<p>Temiz su, güvenli tuvalet ve el yıkama olanağı yalnız konfor değil, hastalıkları önleyen temel sağlık altyapısı. Dünya Sağlık Örgütü'nün 5 Ekim'de yayımladığı 2025 su, sanitasyon ve hijyen raporu, 2015'ten bu yana ilerleme kaydedilmesine rağmen dünyanın Sürdürülebilir Kalkınma Amacı 6 rotasının hâlâ gerisinde olduğunu belirtiyor.</p>

<h2>Sağlık tesislerinde bile temel su eksikliği var</h2>

<p>Rapora göre milyarlarca insan güvenli biçimde yönetilen içme suyu, sanitasyon veya hijyen hizmetlerinden yoksun. Bir milyardan fazla kişi, temel su hizmeti dahi bulunmayan sağlık tesislerinde bakım alıyor. DSÖ, yetersiz su, sanitasyon ve hijyen koşullarının her yıl tahmini 1,4 milyon ölüme katkıda bulunduğunu; kolera, çatışma ve iklim kaynaklı şokların kırılganlığı artırdığını bildiriyor.</p>

<p>Kurumun 2026–2035 stratejisindeki küresel tahminler açığın boyutunu ayrıntılandırıyor: 2,1 milyar kişi güvenli yönetilen içme suyuna, 3,4 milyar kişi güvenli yönetilen sanitasyona erişemiyor. Yaklaşık 106 milyon kişi doğrudan arıtılmamış yüzey suyunu kullanırken 354 milyon kişi açık alanda dışkılama yapmak zorunda kalıyor. Bu sayılar tek bir ülkenin altyapı durumunu anlatmıyor; dünya ölçeğindeki hizmet basamaklarını karşılaştıran tahminler.</p>

<h2>DSÖ'nün rolü altyapı inşa etmekten farklı</h2>

<p>DSÖ doğrudan su hattı veya arıtma tesisi kurmuyor. Sağlık risklerini standartlara, izleme araçlarına, düzenleyici çerçevelere ve ülkelerin kullanabileceği teknik rehberlere dönüştürüyor. Yeni strateji, hizmet sayısını artırmanın yanında güvenlik, eşitlik, iklim dayanıklılığı ve sürdürülebilirliği birlikte ölçmeyi hedefliyor. Çünkü bir su bağlantısının bulunması, kaynağın her zaman temiz, erişilebilir veya kesintilere dayanıklı olduğunu tek başına kanıtlamıyor. Düzenli kalite kontrolü ve bakım da erişimin parçası sayılıyor.</p>

<p>Yerel altyapı kararlarının nasıl parçalı projelere dönüştüğünü görmek için <a href="/haber/girnede-yagmur-suyu-altyapisi-icin-uc-noktali-plan">Girne'deki yağmur suyu altyapısı planına</a> da göz atılabilir. Yağmur suyu yönetimi ile içme suyu güvenliği farklı sistemler olsa da iklim baskısına dayanıklı kent altyapısı ihtiyacında buluşuyor.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler DSÖ'nün 5 Ekim 2026 tarihli <a href="https://www.who.int/publications/i/item/B09880" target="_blank" rel="noopener noreferrer">2025 WASH yıllık raporu</a> ile kurumun <a href="https://www.who.int/publications/i/item/B09661" target="_blank" rel="noopener noreferrer">2026–2035 su, sanitasyon, hijyen ve atık stratejisi</a> karşılaştırılarak derlenmiştir. Bu yazı tıbbi tavsiye değildir. Kapak temsili bir editoryal görseldir; gerçek bir sağlık tesisi veya topluluğu göstermez.</p>
    `,
  }),
  editorial({
    slug: "hubble-beyaz-cuce-ikinci-nesil-gezegen-adayi",
    title: "Ölen Bir Yıldızın Çevresinde Yeni Gezegen Oluşmuş Olabilir",
    excerpt: "Hubble arşivindeki niyobyum izleri ile TESS ışık değişimleri, HS 0209+0832 adlı beyaz cücenin çevresinde yıldızın attığı maddeden oluşmuş ikinci nesil bir gezegen adayı bulunabileceğine işaret ediyor.",
    category: "Bilim & Uzay",
    published_at: "2026-10-06T09:05:00+03:00",
    cover_image: "/editorial/2026-10-06/hubble-ikinci-nesil-gezegen.webp",
    original_source_url: "https://science.nasa.gov/missions/hubble/suspected-second-generation-planet-solves-nasa-hubble-cold-case/",
    content: `
<p>Bir yıldızın ölümü, çevresindeki gezegen öyküsünün de sonu olmayabilir. NASA'nın 5 Ekim'de duyurduğu çalışma, HS 0209+0832 adlı beyaz cücenin çevresinde “ikinci nesil” bir gezegen adayı bulunabileceğini gösteriyor. Buradaki gezegen doğrudan görüntülenmiş değil; kimyasal izler ve düzenli parlaklık değişimleri, en olası açıklamalardan birini oluşturuyor.</p>

<h2>1999 verisindeki çözülemeyen çizgiler yeniden okundu</h2>

<p>Beyaz cüce, yakıtını tüketip dış katmanlarını uzaya bırakan düşük kütleli bir yıldızın sıcak çekirdeği. Hubble 1999'da bu yıldızı gözlediğinde tayfta yaklaşık 100 kimyasal özellik tanımlanamamıştı. Araştırmacılar güncellenmiş atom verileriyle arşivi yeniden inceledi ve gizemli çizgilerin çoğunu niyobyumla eşleştirdi. Demirden ağır bu element, ölmekte olan yıldızların kısa süreli ve aşırı koşullarında üretilebiliyor.</p>

<p>Ekip, yıldızın attığı niyobyum bakımından zengin maddenin bir bölümünün birleşerek gaz devi oluşturmuş olabileceğini düşünüyor. NASA'nın emekliye ayrılan FUSE teleskobunun verileri de güçlü niyobyum işaretini doğruladı. TESS ise beyaz cüceyi dört ay izledi ve yaklaşık 6 milyon kilometre uzaklıkta dolanan bir cisme işaret eden periyodik parlaklık değişimleri kaydetti.</p>

<h2>Aday gezegen neden maddesini kaybediyor?</h2>

<p>Tahmine göre cisim Jüpiter büyüklüğünde bir gaz devi. Genç ve çok sıcak beyaz cücenin yoğun enerjisi gezegenin atmosferini aşındırıyor olabilir. Kopan gaz, kuyruk benzeri bir yapı ve yıldız çevresinde disk oluşturup yeniden beyaz cücenin yüzeyine düşerse Hubble'ın ölçtüğü niyobyumu açıklayabilir.</p>

<p>Bu senaryo henüz kesin bir gezegen doğrulaması değil. Oluşum mekanizmasının ne kadar yaygın olduğu, cismin kütlesi ve uzun vadeli yörüngesi için daha fazla gözlem gerekiyor. Araştırma ekibi önümüzdeki yıllarda benzer beyaz cüce sistemlerini Hubble ile karşılaştırmayı planlıyor. Sonuç, eski uzay verilerinin yeni atom veritabanları ve başka teleskoplarla birleştirildiğinde yıllar sonra yeni sorular açabildiğini gösteriyor. Gezegen sistemlerindeki yıkıcı süreçlerin başka bir örneği için <a href="/haber/webb-gezegen-carpismalarinin-toz-izlerini-okudu">Webb'in çarpışma tozlarını izlediği çalışmaya</a> da bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA'nın 5 Ekim 2026 tarihli <a href="https://science.nasa.gov/missions/hubble/suspected-second-generation-planet-solves-nasa-hubble-cold-case/" target="_blank" rel="noopener noreferrer">Hubble bilim duyurusu</a> ve bağlantılı <a href="https://www.nature.com/articles/s41550-026-02983-7" target="_blank" rel="noopener noreferrer">Nature Astronomy çalışması</a> temel alınarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek teleskop görüntüsü veya doğrulanmış gezegen fotoğrafı değildir.</p>
    `,
  }),
  editorial({
    slug: "saturn-karsi-konum-4-ekim-2026-gozlem-rehberi",
    title: "Satürn Karşı Konumda: 4 Ekim Gecesi Nasıl İzlenir?",
    excerpt: "Satürn 4 Ekim'de karşı konuma geliyor; gün batımına yakın doğup gecenin büyük bölümünde gökyüzünde kalacağı için yılın en elverişli gözlem dönemlerinden biri başlıyor.",
    category: "Bilim & Uzay",
    published_at: "2026-10-04T09:07:00+03:00",
    cover_image: "/editorial/2026-10-04/saturn-karsi-konum.webp",
    original_source_url: "https://www.jpl.nasa.gov/videos/whats-up-october-2026-skywatching-tips-from-nasa/",
    content: `
<p>Satürn, 4 Ekim 2026'da “karşı konum”a geliyor. Bu ifade gezegenin Dünya'dan bakıldığında Güneş'in karşı tarafında görünmesini anlatıyor: Dünya, Güneş ile Satürn'ün arasından geçiyor. NASA'nın Jet Propulsion Laboratory birimi, bu hizalanma sayesinde halkalı gezegenin gün batımına yakın doğacağını ve gecenin büyük bölümünde gökyüzünde kalacağını belirtiyor.</p>

<h2>Gözlem için ne yapmak gerekiyor?</h2>

<p>Satürn çıplak gözle parlak, sarımsı bir nokta gibi seçilebilir; halkaları görmek içinse sabitlenmiş küçük bir teleskop gerekir. Karanlık bir yerde gözlerin çevreye alışması için en az 20 dakika beklemek, telefon ekranının parlaklığını azaltmak ve açık bir ufuk seçmek gözlemi kolaylaştırır. Dürbün gezegeni bulmaya yardımcı olabilir, ancak halkaları belirgin biçimde ayırmak için genellikle yeterli büyütme sağlamaz.</p>

<p>“Karşı konum” tek gecelik dar bir pencere değildir. Bulut, ışık kirliliği veya başka bir engel varsa Satürn sonraki haftalarda da akşam göğünde uzun süre görülebilir. Açık alanda gözlem yaparken araç trafiğinden uzak, güvenli ve izinli bir nokta seçmek; gece dönüşü için aydınlatma bulundurmak gerekir. Gözlem saatini ve yönünü bulunduğunuz konuma göre bir gökyüzü uygulamasıyla kontrol etmek en sağlıklı yöntemdir. Teleskopla bakarken yüksek büyütmeye hemen geçmek yerine düşük büyütmeyle gezegeni bulup görüntüyü ortalamak daha pratiktir.</p>

<h2>Ekim göğünde başka neler var?</h2>

<p>JPL'nin 1 Ekim'de yayımladığı aylık gökyüzü rehberine göre ince hilal 6 Ekim sabahı Jüpiter'e yakın görünecek. Orionid meteor yağmuru 21–22 Ekim gecesi zirve yapacak; parlak Ay sönük meteorları bastırabileceği için en iyi fırsat Ay battıktan sonraki şafak öncesi saatlerde olabilir. 27–28 Ekim gecesinde ise Ay, Ülker yıldız kümesinin yakınından geçecek.</p>

<p>Satürn gözlemi, bir uzay aracının çektiği yakın plan görüntüyle aynı ayrıntıyı sunmaz; amaç, gezegeni gerçek zamanlı gökyüzünde bulmaktır. Venüs'e gönderilecek bir aracın zorlu koşullara nasıl hazırlandığını merak edenler <a href="/haber/davinci-venus-sicaklik-testi">DAVINCI ısı testi yazısına</a> da göz atabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA JPL'nin 1 Ekim 2026 tarihli <a href="https://www.jpl.nasa.gov/videos/whats-up-october-2026-skywatching-tips-from-nasa/" target="_blank" rel="noopener noreferrer">Ekim gökyüzü rehberi</a> ve NASA'nın <a href="https://science.nasa.gov/saturn/" target="_blank" rel="noopener noreferrer">Satürn bilgi sayfası</a> temel alınarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; teleskop fotoğrafı veya gerçek bir uzay görüntüsü değildir.</p>
    `,
  }),
  editorial({
    slug: "nairobi-elektrikli-motosiklet-ve-otobus-donusumu",
    title: "Nairobi'de Elektrikli Ulaşımı Ne Hızlandırıyor?",
    excerpt: "Elektrikli motosikletler ve otobüsler Nairobi'de işletme maliyetini ve hava kirliliğini azaltma potansiyeli taşıyor; batarya değişimi ile kiralama modelleri ilk yatırım engelini aşmaya çalışıyor.",
    category: "Dünya",
    published_at: "2026-10-04T09:06:00+03:00",
    cover_image: "/editorial/2026-10-04/nairobi-elektrikli-ulasim.webp",
    original_source_url: "https://www.unep.org/news-and-stories/story/could-electric-vehicles-help-african-capital-clean-its-air-and-fight-climate",
    content: `
<p>Nairobi'de elektrikli ulaşımın en görünür yüzü özel otomobiller değil, her gün yolcu ve yük taşıyan motosiklet taksiler. Birleşmiş Milletler Çevre Programı'nın 2 Ekim'de yayımladığı saha anlatısı, elektrikli motosiklete geçen sürücülerin enerji giderinin benzin maliyetinin yarısından az olabildiğini aktarıyor. Bu fark, günde 100–150 kilometre yol yapan ve aracını gelir aracı olarak kullanan sürücüler için doğrudan kazanca dönüşebiliyor.</p>

<h2>Hava kalitesi ve elektrik karışımı neden önemli?</h2>

<p>UNEP'in aktardığı verilere göre karayolu taşımacılığı, Nairobi'deki ince parçacık kirliliğinin yaklaşık yüzde 40'ını oluşturuyor. Kenya elektrik şebekesinin yaklaşık yüzde 90'ının yenilenebilir kaynaklara dayanması, egzozdan kaynaklanan yerel kirliliğin yanında toplam sera gazı etkisini azaltma ihtimalini de güçlendiriyor. Ancak bu sonuç her ülkede aynı olmaz; elektrik üretim karışımı ve araçların kullanım yoğunluğu birlikte değerlendirilmeli.</p>

<p>Yeni kaydedilen motosikletlerin yaklaşık yüzde 15'inin elektrikli olduğu belirtiliyor. Yüksek satın alma bedeli hâlâ temel engellerden biri. Bazı şirketler bu sorunu bataryayı araçtan ayıran modelle çözmeye çalışıyor: sürücü daha düşük bedelle motosikleti alıyor, boş bataryayı istasyonda dolusuyla değiştiriyor ve kullanım için ücret ödüyor. Hızlı değişim, taksi ve teslimat işinde şarj bekleme süresini de azaltıyor.</p>

<h2>Otobüslerde model nasıl çalışıyor?</h2>

<p>Nairobi'de toplu ulaşımın büyük bölümü otobüslere dayanıyor. UNEP'e göre kentte yaklaşık 20 bin dizel otobüs bulunuyor. Yerel üreticilerden biri elektrikli otobüsleri operatörlere şarj ve bakım dahil kullanım başına ödeme modeliyle kiralıyor. Böylece ilk yatırım yükü azalırken yakıt gideri daha öngörülebilir hale geliyor. Kenya ve Ruanda'daki mevcut filo büyüyor, fakat ek elektrik üretimi, şarj altyapısı, finansman ve istikrarlı kamu politikası olmadan ölçeklenme sınırlı kalabilir.</p>

<p>Nairobi örneği, elektrikli ulaşımın yalnız araç teknolojisiyle değil; batarya, finansman, şebeke ve iş modeliyle birlikte ilerlediğini gösteriyor. Kentsel çevre baskısının başka bir boyutu için <a href="/haber/arktik-deniz-buzu-2026-minimumu">2026 Arktik deniz buzu değerlendirmesine</a> de bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler UNEP'in 2 Ekim 2026 tarihli <a href="https://www.unep.org/news-and-stories/story/could-electric-vehicles-help-african-capital-clean-its-air-and-fight-climate" target="_blank" rel="noopener noreferrer">Nairobi elektrikli ulaşım dosyası</a> ile bağlantılı resmî kurum verileri temel alınarak derlenmiştir. Kapak temsili bir editoryal görseldir; belirli bir sürücüyü, şirketi veya gerçek trafik sahnesini göstermez.</p>
    `,
  }),
  editorial({
    slug: "larnaka-aqtivate-yuksek-basarimli-hesaplama-kuantum",
    title: "Larnaka'da AQTIVATE: Süper Bilgisayar, Yapay Zekâ ve Kuantum Aynı Masada",
    excerpt: "AQTIVATE konferansı, yüksek başarımlı hesaplama, makine öğrenmesi ve kuantum algoritmalarını fizik, mühendislik ve biyoloji problemleri çevresinde Larnaka'da buluşturdu.",
    category: "Teknoloji",
    published_at: "2026-10-04T09:05:00+03:00",
    cover_image: "/editorial/2026-10-04/larnaka-aqtivate-hesaplama.webp",
    original_source_url: "https://aqtivate.ucy.ac.cy/news/aqtivate-conference-held-in-cyprus/",
    content: `
<p>Larnaka, 28 Eylül–2 Ekim 2026 arasında yüksek başarımlı hesaplama, makine öğrenmesi ve kuantum algoritmalarını aynı programda buluşturan AQTIVATE konferansına ev sahipliği yaptı. Kıbrıs Üniversitesi bağlantılı projenin 2 Ekim tarihli duyurusuna göre doktora araştırmacıları, danışmanlar ve uzmanlar fizik, mühendislik ve biyolojideki hesaplama problemlerini birlikte ele aldı.</p>

<h2>“Exascale” ve kuantum başlıkları ne anlama geliyor?</h2>

<p>Programda çok büyük hesaplama sistemleri için modelleme ve ölçeklenebilir algoritmalar, makine öğrenmesi yöntemleri, kuantum algoritmaları ve tensör ağları öne çıktı. Uygulama alanları arasında kafes kuantum kromodinamiği, hesaplamalı akışkanlar dinamiği ve hesaplamalı biyoloji bulunuyor. Bu başlıkların ortak noktası, geleneksel yöntemlerle çözümü çok uzun sürebilen veya çok fazla bellek isteyen problemlere daha verimli yaklaşım araması.</p>

<p>Konferans duyurusu belirli bir bilimsel atılım ilan etmiyor; tamamlanan araştırmaların ve yöntemlerin paylaşıldığı bir buluşmayı kayda geçiriyor. Bu ayrım önemli çünkü kuantum hesaplama oturumunun varlığı, bugün kullanılan süper bilgisayarların yerini hemen kuantum makinelerin alacağı anlamına gelmiyor. AQTIVATE'ın yaklaşımı, yüksek başarımlı hesaplama, veri odaklı yöntemler ve kuantum araştırmasını birbirini tamamlayan araçlar olarak ele alıyor.</p>

<h2>Projenin eğitim boyutu</h2>

<p>AQTIVATE, Avrupa Birliği'nin Marie Skłodowska-Curie Doktora Ağları kapsamında desteklenen ortak bir eğitim ve araştırma programı. Proje özetine göre 15 doktora araştırmacısını kapsıyor; dokuz derece veren kurum, dört büyük araştırma merkezi ve Kıbrıs, Almanya, İtalya ile İsveç'teki dört ulusal süper bilgisayar merkezi ağda yer alıyor. Araştırmacıların sanayi veya süper bilgisayar merkezinde çalışma dönemi geçirmesi ve birden fazla kurumun ortak derece vermesi hedefleniyor.</p>

<p>Larnaka toplantısı bu ağın farklı alanlardan gelen çalışmalarını yüz yüze karşılaştırdığı bir ara durak oldu. Yerel ölçekte Kıbrıs'ın yalnız etkinliğe ev sahipliği yapmasını değil, hesaplama altyapısı ve araştırmacı eğitimi üzerinden Avrupa araştırma ağına katılımını da görünür kılıyor. Eğitimde yapay zekânın başka bir boyutu için <a href="/haber/kirsal-okullarda-yapay-zeka-ogretmen-yetkinligi">öğretmen yetkinliği yazısına</a> da bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler AQTIVATE'ın 2 Ekim 2026 tarihli <a href="https://aqtivate.ucy.ac.cy/news/aqtivate-conference-held-in-cyprus/" target="_blank" rel="noopener noreferrer">konferans duyurusu</a> ve kurumun <a href="https://aqtivate.ucy.ac.cy/research-summary/" target="_blank" rel="noopener noreferrer">araştırma özeti</a> temel alınarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek konferans salonu veya bilimsel veri görselleştirmesi değildir.</p>
    `,
  }),
  editorial({
    slug: "dso-kuresel-saglik-tahminleri-2023",
    title: "DSÖ Verileri: Dünya Daha Uzun Yaşıyor, Sağlıklı Yıllar Aynı Hızda Artmıyor",
    excerpt: "DSÖ’nün 2000–2023 dönemini kapsayan yeni tahminleri, yaşam beklentisinin pandemi öncesine yaklaştığını; kronik hastalıklar ve ruh sağlığı yükünün büyüdüğünü gösteriyor.",
    category: "Yaşam",
    published_at: "2026-10-03T11:08:00+03:00",
    cover_image: "/editorial/2026-10-03/dso-kuresel-saglik-tahminleri.webp",
    original_source_url: "https://www.who.int/naoero/news/detail-global/02-10-2026-new-who-estimates-show-changing-global-health-landscape",
    content: `
<p>Dünya Sağlık Örgütü’nün 2 Ekim’de yayımladığı Küresel Sağlık Tahminleri, yaşam süresinin COVID-19 dönemindeki düşüşten sonra toparlandığını, ancak sağlıklı geçirilen yılların aynı hızda geri dönmediğini gösteriyor. 2000–2023 dönemini kapsayan veri seti; ölüm nedenlerini, hastalık yükünü ve yaşam beklentisini ülke, bölge, yaş ve cinsiyet kırılımlarında karşılaştırıyor.</p>

<h2>Yaşam beklentisi toparlandı, sağlıklı süre geride kaldı</h2>

<p>Küresel yaşam beklentisi 2023’te 73,3 yıla ulaştı; bu değer 2019’daki 73,4 yıla çok yakın. Sağlıklı yaşam beklentisi ise 62,8 yılda kaldı ve pandemi öncesi düzeyin 0,4 yıl altında ölçüldü. İki gösterge arasındaki fark, yalnız ne kadar yaşandığını değil, bu sürenin ne kadarının hastalık veya engellilikle geçirildiğini de izlemek gerektiğini ortaya koyuyor. Bölgesel ve gelir düzeyine göre ayrılmış sonuçlar, küresel ortalamanın gerisindeki eşitsizlikleri de görünür kılıyor.</p>

<p>Bulaşıcı olmayan hastalıklar 2023’te dünya genelindeki ölümlerin yüzde 74’ünü oluşturdu; 2000’de bu oran yüzde 58’di. En sık on ölüm nedeninin sekizi bu grupta yer aldı. İskemik kalp hastalığı yaklaşık 9,5 milyon ölüm ve 210 milyon sağlıklı yaşam yılı kaybıyla başlıca yük olmaya devam etti.</p>

<h2>Diyabet, demans ve ruh sağlığı verileri ne söylüyor?</h2>

<p>Diyabete bağlı ölüm riski özellikle Güneydoğu Asya’da yükseldi. Alzheimer hastalığı ve diğer demanslar 2000’de 19’uncu sıradayken 2023’te küresel ölüm nedenleri arasında beşinci sıraya çıktı; demansa bağlı ölümler bu dönemde üç katına ulaştı. 2019–2023 arasında yaşa göre standartlaştırılmış sağlıklı yaşam yılı kaybı oranı depresyonda yaklaşık yüzde 20, kaygı bozukluklarında ise yaklaşık yüzde 45 arttı.</p>

<p>Bunlar doğrudan sayımlardan ibaret değil; ulusal ölüm kayıtları, DSÖ programları, BM ortakları ve bilimsel çalışmalardan üretilen karşılaştırılabilir tahminler. Bu nedenle ülke verilerinin kalitesi ve belirsizlik aralıkları sonuçları yorumlarken önem taşıyor. Yaşlanan nüfusa yönelik politika görünümü için <a href="/haber/saglikli-yaslanma-raporu-bakim-ve-veri-acigi">Sağlıklı Yaşlanma On Yılı ara raporuna</a> da bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler DSÖ’nün 2 Ekim 2026 tarihli <a href="https://www.who.int/naoero/news/detail-global/02-10-2026-new-who-estimates-show-changing-global-health-landscape" target="_blank" rel="noopener noreferrer">küresel sağlık güncellemesi</a> ile kurumun <a href="https://www.who.int/data/global-health-estimates" target="_blank" rel="noopener noreferrer">Küresel Sağlık Tahminleri veri ve yöntem sayfası</a> karşılaştırılarak derlenmiştir. Bu yazı tıbbi tavsiye değildir. Kapak temsili bir editoryal görseldir; gerçek hasta veya veri ekranı göstermez.</p>
    `,
  }),
  editorial({
    slug: "jammertest-gps-spoofing-ve-sinyal-dogrulama",
    title: "GPS Noktası Neden Yanlış Yere Sıçrayabilir? Jammertest Ne Gösterdi?",
    excerpt: "Norveç’teki Jammertest, uydu navigasyon alıcılarını kontrollü karıştırma ve sahte sinyallerle sınadı; Galileo’nun yeni doğrulama hizmeti gerçek koşullarda denendi.",
    category: "Teknoloji",
    published_at: "2026-10-03T11:07:00+03:00",
    cover_image: "/editorial/2026-10-03/jammertest-uydu-navigasyonu.webp",
    original_source_url: "https://www.esa.int/Applications/Satellite_navigation/Jammertest_pumps_up_the_jam_in_Norway",
    content: `
<p>Telefondaki mavi nokta kaybolduğunda sorun her zaman harita uygulamasında olmayabilir. Norveç’in Andøya adasında yapılan Jammertest, uydu navigasyon alıcılarını kontrollü karıştırma ve sahte sinyal senaryolarına sokarak hangi sistemlerin konumunu koruyabildiğini sınadı. ESA’nın 2 Ekim’de yayımladığı değerlendirme, günlük cihazlardan kritik altyapıya kadar geniş bir alanda aynı temel riskin bulunduğunu gösteriyor.</p>

<h2>Karıştırma ile sahte konum aynı şey değil</h2>

<p>“Jamming” güçlü bir yayınla gerçek uydu sinyalini bastırıyor; alıcı konum hesaplayamadığı için nokta kaybolabiliyor. “Spoofing” ise alıcıya sahte sinyal vererek var görünen konumu yanlış yere taşıyor. “Meaconing” adı verilen yöntemde gerçek uydu sinyali yakalanıp başka yerde yeniden yayımlanıyor; cihazın saat veya konum hesabı böylece sapabiliyor.</p>

<p>Bu etkiler yalnız rota tarifini bozmuyor. Uydu navigasyonu havacılıkta, elektrik şebekelerinde, finansal zaman damgalarında ve acil yardım hizmetlerinde konumla birlikte hassas zaman bilgisi sağlıyor. Bu nedenle testte basit telefon ve spor saatlerinin yanı sıra özel antenler, izleme istasyonları, telekom altyapısı ve yeni uydu sinyalleri değerlendirildi. Kontrollü saha, geliştiricilerin laboratuvarda üretmesi zor olan farklı sinyal güçlerini, hareketli hedefleri ve değişen arazi koşullarını aynı hafta içinde karşılaştırmasına olanak sağladı.</p>

<h2>Galileo’nun yeni hizmeti neyi sınadı?</h2>

<p>16 Eylül’de beş Galileo uydusu iki saat boyunca yeni şifreli test sinyali yayımladı. Andøya’daki ve Hollanda’daki ESA laboratuvarındaki alıcılar, parazitli koşullarda bu sinyallerle konum hesapladı. ESA bunu yaklaşan Signal Authentication Service’in gerçek ortamda kurduğu ilk sivil doğrulanmış konum olarak tanımlıyor. Hizmet, mevcut navigasyon mesajı doğrulamasıyla birlikte alıcının sinyalin kaynağını kontrol etmesine yardım etmeyi amaçlıyor.</p>

<p>Bir saha başarısı, bütün cihazların her saldırıya karşı hazır olduğu anlamına gelmiyor. ESA onlarca terabayt verinin hâlâ işleneceğini ve farklı alıcıların sonuçlarının programlara aktarılacağını belirtiyor. Uydu verisinin güvenlikte başka bir kullanımı için <a href="/haber/earthcare-volkanik-kulu-ucus-guvenligi-icin-izledi">EarthCARE’nin uçuş güvenliği gözlemine</a> de göz atılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler ESA’nın 2 Ekim 2026 tarihli <a href="https://www.esa.int/Applications/Satellite_navigation/Jammertest_pumps_up_the_jam_in_Norway" target="_blank" rel="noopener noreferrer">Jammertest değerlendirmesi</a> ve 17 Eylül tarihli <a href="https://www.esa.int/Applications/Satellite_navigation/Galileo/Galileo_s_first_civil_authenticated_position_fix_under_spoofing_conditions" target="_blank" rel="noopener noreferrer">Galileo sinyal doğrulama açıklaması</a> temel alınarak derlenmiştir. Kapak temsili bir editoryal görseldir; gerçek test sahası veya sinyal haritası değildir.</p>
    `,
  }),
  editorial({
    slug: "davinci-venus-sicaklik-testi",
    title: "DAVINCI, Venüs Sıcaklığına Karşı Altı Tur Testi Geçti",
    excerpt: "NASA’nın DAVINCI iniş sondasının mühendislik modeli, yaklaşık 465 dereceye çıkan altı ısı döngüsünde iç donanımı koruyabildiğini gösterdi.",
    category: "Bilim & Uzay",
    published_at: "2026-10-03T11:06:00+03:00",
    cover_image: "/editorial/2026-10-03/davinci-venus-isi-testi.webp",
    original_source_url: "https://www.nasa.gov/image-article/nasas-davinci-probe-can-stand-the-heat/",
    content: `
<p>NASA’nın DAVINCI görevi için geliştirilen iniş sondasının mühendislik modeli, Venüs yüzeyine yaklaşırken karşılaşacağı hızlı ısınmayı taklit eden testlerden geçti. NASA 2 Ekim’de sonucu yeniden öne çıkardı; deneylerin kendisi 28 Ağustos–10 Eylül arasında yapıldı. Bu tarih ayrımı önemli: yeni duyuru, yeni bir Venüs inişi veya yüzey ölçümü anlamına gelmiyor.</p>

<h2>Fırın testi nasıl kuruldu?</h2>

<p>Yaklaşık bir pilates topu büyüklüğündeki model, seramik kaplı bir test odasına yerleştirildi. Sıcaklık yaklaşık bir saat içinde 465 santigrat dereceye çıkarıldı; bu hız, sondanın Venüs atmosferinden yüzeye doğru 55–60 dakikalık inişinde beklenen ısınmayı taklit etti. Ekip aynı döngüyü toplam altı kez tekrarladı.</p>

<p>Modelin içine gerçek bilim araçları yerine onları temsil eden donanım yerleştirildi ve 100’den fazla termal sensörle izlendi. Her döngüde dış kabuk çok yüksek sıcaklığa maruz kalırken iç bölümün hassas sistemleri koruyup koruyamadığı ölçüldü. NASA, modelin altı çevrimi de hasarsız tamamladığını belirtiyor. Deney, yalnız dış kabuğun ayakta kalmasını değil; bağlantı noktaları, yalıtım ve iç sıcaklık dağılımının iniş süresince birlikte çalışmasını sınadı. Bu ölçümler, uçuş tasarımındaki güvenlik paylarının gözden geçirilmesine de veri sağlayacak.</p>

<h2>Sonda Venüs’te neyi araştıracak?</h2>

<p>DAVINCI’nin titanyum gövdesi hem güçlü ve hafif olmalı hem de aşındırıcı atmosfer koşullarına dayanmalı. Özel giriş portları, sıcak gazların ölçüm aygıtlarına kontrollü biçimde ulaşmasını sağlayacak. Araç atmosferdeki asal gazları ve başka molekülleri inceleyerek Venüs’ün kökeni, evrimi ve geçmişte su barındırıp barındırmadığı sorularına veri toplayacak.</p>

<p>Kameralar iniş sırasında yüzeyin yüksek çözünürlüklü görüntülerini elde etmeyi, radyo sistemi ise verileri yaklaşık 9 bin kilometre yukarıdaki taşıyıcı uzay aracına göndermeyi hedefliyor. Isı testi önemli bir mühendislik doğrulaması olsa da uçuş donanımının tamamlandığı veya görevin nihai onayı aldığı anlamına gelmiyor. Başka bir gezegen sistemi çalışması için <a href="/haber/webb-gezegen-carpismalarinin-toz-izlerini-okudu">Webb’in gezegen çarpışmaları araştırmasına</a> da bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA’nın 2 Ekim 2026 tarihli <a href="https://www.nasa.gov/image-article/nasas-davinci-probe-can-stand-the-heat/" target="_blank" rel="noopener noreferrer">güncel görsel duyurusu</a> ile 24 Eylül tarihli <a href="https://science.nasa.gov/blogs/davinci/2026/09/24/nasas-davinci-beats-heat-in-preparation-for-blistering-venus-descent/" target="_blank" rel="noopener noreferrer">ayrıntılı test raporu</a> temel alınarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek test fotoğrafı veya Venüs görüntüsü değildir.</p>
    `,
  }),
  editorial({
    slug: "webb-gezegen-carpismalarinin-toz-izlerini-okudu",
    title: "Webb, Gezegen Çarpışmalarının Toz İzlerini Nasıl Okudu?",
    excerpt: "James Webb Uzay Teleskobu, 21 aşırı enkaz diskindeki mineralleri inceleyerek Mars ve Ay büyüklüğündeki cisimlerin çarpışmalarını birbirinden ayıran izler buldu.",
    category: "Bilim & Uzay",
    published_at: "2026-10-02T09:07:00+03:00",
    cover_image: "/editorial/2026-10-02/webb-gezegen-carpismalari.webp",
    original_source_url: "https://science.nasa.gov/missions/webb/nasas-webb-provides-crash-course-on-planet-shattering-collisions/",
    content: `
<p>Genç yıldızların çevresindeki sıcak toz halkaları, gözle görülmeyen gezegen oluşum süreçlerinin enkazını taşıyor. NASA’nın 1 Ekim’de duyurduğu çalışmada James Webb Uzay Teleskobu ve arşivdeki Spitzer verileri kullanılarak 21 “aşırı enkaz diski” incelendi. Bulgular, tozun mineral bileşiminin çarpışmanın ölçeği hakkında ipucu verebildiğini gösteriyor; ancak araştırmacılar uzaktaki tek tek gezegenleri doğrudan görüntülemedi.</p>

<h2>Aşırı enkaz diski ne anlatıyor?</h2>

<p>Bir yıldız sistemi gençken gaz ve tozla dolu gezegen oluşum diskiyle çevrili oluyor. Gaz azaldıkça geride çarpışan küçük cisimlerin ürettiği daha seyrek enkaz kalıyor. Aşırı enkaz diskleri ise kayalık gezegenlerin bulunduğu bölgelere benzer uzaklıklarda alışılmadık miktarda sıcak toz içeriyor. NASA’ya göre eldeki gözlemler, genç yıldızların yaklaşık yüzde 1’inde bu evrenin görünür izlerine rastlandığını düşündürüyor.</p>

<p>Ekip, Webb’in orta kızılötesi tayflarıyla toz tanelerinin boyutunu ve mineral yapısını karşılaştırdı. Orta kızılötesi gözlemler, görünür ışıkta seçilemeyen mineral izlerini ayırarak doğrudan görüntülenemeyecek kadar küçük gezegen embriyolarının geçmişini dolaylı biçimde okumaya imkân veriyor. Örneklemin yaklaşık üçte biri silika bakımından zengindi. Araştırmacılar bunu, Mars büyüklüğündeki cisimlerin yüksek enerjili çarpışmalarında kayanın önemli bölümünün buharlaşmasıyla ilişkilendiriyor. Silikası daha düşük diskler ise Ay büyüklüğündeki cisimlerin daha düşük enerjili veya sıyıran çarpışmalarından doğmuş olabilir.</p>

<h2>Bizim Güneş Sistemimizle bağlantı nerede?</h2>

<p>Silika zengini disklerin 300 milyon yıldan genç yıldızlarda görülmesi, kayalık gezegenlerin ilk birkaç yüz milyon yılda şekillenebileceğini öngören modellerle uyumlu. Dünya ile Mars büyüklüğündeki varsayımsal Theia’nın çarpışmasının Ay’ı oluşturduğu düşüncesi de benzer bir döneme yerleşiyor. Bu benzerlik, incelenen sistemlerin Güneş Sistemimizin geçmişine bire bir kopya olduğu anlamına gelmiyor.</p>

<p>Örneklem sınırlı: yaşlı yıldız ölçütlerine uyan yalnız üç disk bulunuyor. Bu nedenle silika ile yaş arasındaki bağın yeni gözlemlerle sınanması gerekiyor. Roman teleskobunun başka bir doğrudan görüntüleme adımı için <a href="/haber/roman-ilk-koronagraf-isigi-ve-hassas-yonelim">ilk koronagraf ışığı haberine</a> de bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA’nın 1 Ekim 2026 tarihli <a href="https://science.nasa.gov/missions/webb/nasas-webb-provides-crash-course-on-planet-shattering-collisions/" target="_blank" rel="noopener noreferrer">Webb bilim duyurusu</a> ile <a href="https://doi.org/10.3847/1538-4357/ae88fe" target="_blank" rel="noopener noreferrer">The Astrophysical Journal makalesi</a> temel alınarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek bir çarpışma veya teleskop fotoğrafı değildir.</p>
    `,
  }),
  editorial({
    slug: "earthcare-volkanik-kulu-ucus-guvenligi-icin-izledi",
    title: "EarthCARE, Volkanik Külün Uçuş Seviyesindeki Katmanlarını Ölçtü",
    excerpt: "ESA’nın EarthCARE uydusu, Anak Krakatau püskürmesindeki kül, sülfat ve bulut katmanlarını dikey olarak ayırarak havacılık tahminlerinin doğrulanmasına katkı sağladı.",
    category: "Bilim & Uzay",
    published_at: "2026-10-02T09:06:00+03:00",
    cover_image: "/editorial/2026-10-02/earthcare-volkanik-kul.webp",
    original_source_url: "https://www.esa.int/Applications/Observing_the_Earth/FutureEO/EarthCARE/EarthCARE_s_view_of_volcanic_plume_boosts_air_safety",
    content: `
<p>Volkanik bir bulutun uydu görüntüsünde nerede olduğu kadar, hangi yükseklikte bulunduğu da uçuş güvenliği için önemli. Avrupa Uzay Ajansı’nın 1 Ekim tarihli açıklamasına göre EarthCARE uydusu, eylülde faaliyeti artan Endonezya’daki Anak Krakatau’nun bulutunu dikey katmanlarıyla ölçtü. Veriler, Darwin Volkanik Kül Danışma Merkezi’nin üst atmosferde batıya ilerleyen bileşenin yüksekliğini sınamasına yardımcı oldu.</p>

<h2>Lidar ve radar aynı buluta farklı bakıyor</h2>

<p>EarthCARE dört aygıt taşıyor. ATLID adlı atmosferik lidar, morötesi lazer darbelerinin parçacıklardan geri saçılmasını ölçerek aerosol katmanlarının yüksekliği ve yoğunluğu hakkında profil çıkarıyor. Bulut profilleme radarı ise daha uzun dalga boyu nedeniyle daha büyük parçacıklara duyarlı. Çok tayflı görüntüleyici ve geniş bant radyometre de bulutların, aerosollerin ve Dünya’nın enerji dengesinin birlikte incelenmesini sağlıyor.</p>

<p>5 Eylül tarihli geçişte araçlar; ince ve kalın sülfat katmanları, ince kül ve daha iri kül olabileceği düşünülen ayrı bir yapı saptadı. Dikey profil, yalnız üstten çekilmiş bir görüntünün ayıramadığı katmanların yolcu uçaklarının kullandığı irtifalarla nerede kesiştiğini görmeyi kolaylaştırıyor. Radar, kaynaktan yaklaşık 200 kilometre uzakta yüzeyden 6 kilometre yüksekliğe kadar uzanan büyük parçacık işareti gördü. Araştırmacılar bunun iri kül kümeleri olduğu yorumunun henüz doğrulanması gerektiğini özellikle belirtiyor.</p>

<h2>Uçuş tahminine katkısı ne oldu?</h2>

<p>Volkanik kül motorlara zarar verebilir, kokpit camını aşındırarak görüşü azaltabilir; kükürt dioksit gibi gazlar da kabin havası açısından risk oluşturabilir. Bu nedenle dünyadaki dokuz Volkanik Kül Danışma Merkezi, uçuş ekiplerine bölgesel uyarılar hazırlıyor. EarthCARE’nin lidar verisi, bulutun yaklaşık 15 kilometredeki üst bileşeninin tahmin edilen yönde ilerlediğini doğrulamaya destek verdi.</p>

<p>Tek bir uydu geçişi bulutun bütün zaman içindeki davranışını göstermiyor ve güvenli rota kararının tek kaynağı değil. Meteorolojik modeller, başka uydular ve saha gözlemleri birlikte kullanılıyor. Farklı bir volkanı radar görüntüleriyle izleyen çalışma için <a href="/haber/nisar-kamcatka-volkanini-uzaydan-adim-adim-izledi">NISAR’ın Kamçatka gözlemine</a> de göz atılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler ESA’nın 1 Ekim 2026 tarihli <a href="https://www.esa.int/Applications/Observing_the_Earth/FutureEO/EarthCARE/EarthCARE_s_view_of_volcanic_plume_boosts_air_safety" target="_blank" rel="noopener noreferrer">volkanik bulut incelemesi</a> ve kurumun <a href="https://www.esa.int/Applications/Observing_the_Earth/FutureEO/EarthCARE" target="_blank" rel="noopener noreferrer">EarthCARE görev sayfası</a> temel alınarak derlenmiştir. Kapak temsili bir editoryal görseldir; gerçek Anak Krakatau görüntüsü veya uçuş rotası değildir.</p>
    `,
  }),
  editorial({
    slug: "saglikli-yaslanma-raporu-bakim-ve-veri-acigi",
    title: "Sağlıklı Yaşlanmada İlerleme Var; Bakım, Finansman ve Veri Açığı Sürüyor",
    excerpt: "BM Sağlıklı Yaşlanma On Yılı ara raporu, yaş ayrımcılığı yasaları ve uzun süreli bakım politikalarında ilerleme saptarken finansman ve izleme açıklarına dikkat çekiyor.",
    category: "Yaşam",
    published_at: "2026-10-02T09:05:00+03:00",
    cover_image: "/editorial/2026-10-02/saglikli-yaslanma-raporu.webp",
    original_source_url: "https://www.who.int/philippines/news/detail-global/01-10-2026-un-decade-of-healthy-ageing-midpoint-report-finds-progress--calls-for-greater-investment",
    content: `
<p>Dünya Sağlık Örgütü’nün koordinasyonuyla hazırlanan BM Sağlıklı Yaşlanma On Yılı ara raporu, ülkelerin yaş ayrımcılığı, uzun süreli bakım ve yaş dostu çevrelerde ilerlediğini; buna karşılık kaynak ve veri açıklarının 2030 hedeflerini yavaşlattığını gösteriyor. Rapor 28 Eylül’de BM Genel Kuruluna iletildi, DSÖ ise temel bulguları 1 Ekim’de yayımladı.</p>

<h2>Hangi alanlarda ilerleme ölçüldü?</h2>

<p>Yaşa dayalı ayrımcılığa karşı mevzuatı bulunan ülkelerin oranı 2018’de yüzde 44,5 iken son değerlendirmede yüzde 57,7’ye çıktı. Ulusal uzun süreli bakım politikası bildirenlerin oranı da 2023’teki yüzde 49’dan yüzde 56,7’ye yükseldi. Ülkelerin yüzde 54,6’sı yaş dostu çevre programları ve aynı oranda ülke yaşlılara yönelik kapsamlı sağlık ve sosyal değerlendirmeler bildirdi.</p>

<p>Bu göstergeler, bir yasanın veya politikanın her bölgede aynı kalitede uygulandığını kanıtlamıyor. Rapora göre yaşlanma konusunda aktif çok paydaşlı platform bildiren ülkelerin oranı 2020’de yüzde 53,1 iken yüzde 43,3’e geriledi. Üçte birden fazla ülke, uzun süreli bakım geliştirmek için çok az ya da hiç özel kaynak ayırmadığını belirtti.</p>

<h2>Veri açığı neden günlük hayatı etkiliyor?</h2>

<p>Ülkelerin yalnız yüzde 22,7’si yaşlıların sağlık durumunu zaman içinde izleyebiliyor. İşitme cihazı, gözlük veya yürüteç gibi yardımcı ürünlere erişimi güvence altına alan mevzuatın bulunduğu ülkelerin oranı ise yüzde 45,4. Sağlık, gelir, barınma ve bakım ihtiyacı düzenli ölçülmediğinde aynı yaştaki herkesin aynı gereksinime sahip olduğu varsayımıyla plan yapılabiliyor.</p>

<p>Dünya genelinde 60 yaş ve üzerindeki nüfus 2020’de 1 milyarı geçti; 2050’de 2,1 milyara ulaşması bekleniyor. Daha uzun yaşam, tek başına sağlıklı ve bağımsız geçirilen yılların arttığı anlamına gelmiyor. Bu nedenle rapor, hizmetlerin yaşlıların kendi deneyimleriyle birlikte tasarlanmasını, ulusal bütçe ve izleme sistemlerinin güçlendirilmesini istiyor. Entegre sağlık hizmetlerinin başka bir örneği için <a href="/haber/tuberkuloz-ve-hiv-bakiminda-entegre-model-cagrisi">tüberküloz ve HIV bakım modeli haberine</a> de bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler DSÖ’nün 1 Ekim 2026 tarihli <a href="https://www.who.int/philippines/news/detail-global/01-10-2026-un-decade-of-healthy-ageing-midpoint-report-finds-progress--calls-for-greater-investment" target="_blank" rel="noopener noreferrer">ara rapor özeti</a> ve kurumun <a href="https://www.who.int/initiatives/decade-of-healthy-ageing" target="_blank" rel="noopener noreferrer">Sağlıklı Yaşlanma On Yılı sayfası</a> temel alınarak derlenmiştir. Bu yazı tıbbi tavsiye değildir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek rapor katılımcılarını göstermemektedir.</p>
    `,
  }),
  editorial({
    slug: "kalabalik-etkinliklerde-asiri-sicak-rehberi",
    title: "Kalabalık Etkinliklerde Aşırı Sıcağa Karşı Yeni DSÖ Rehberi Ne Öneriyor?",
    excerpt: "DSÖ’nün yeni rehberi, spor karşılaşmaları, festivaller ve kitlesel buluşmalarda sıcak riskinin su, gölge, program ve sağlık hizmetleri birlikte planlanarak azaltılabileceğini vurguluyor.",
    category: "Yaşam",
    published_at: "2026-10-01T09:05:00+03:00",
    cover_image: "/editorial/2026-10-01/kalabalik-etkinlik-asiri-sicak.webp",
    original_source_url: "https://www.who.int/hongkongchina/news/detail-global/30-09-2026-who-releases-new-guidance-to-prevent-heat-related-illness-at-mass-gatherings",
    content: `
<p>Açık hava konseri, spor karşılaşması, hac yolculuğu veya büyük bir kültür festivali; sıcak hava ile yoğun kalabalık birleştiğinde yalnız katılımcıları değil çalışanları, gönüllüleri ve yerel sağlık sistemini de zorlayabiliyor. Dünya Sağlık Örgütü’nün 30 Eylül’de yayımladığı yeni paket, sıcak riskini etkinlik planının yan başlığı değil, temel güvenlik ve operasyon konusu olarak ele alıyor.</p>

<h2>Tek çözüm “daha çok su içmek” değil</h2>

<p>DSÖ’nün 1980–2025 arasındaki çalışmaları inceleyen kanıt derlemesi, kitlesel etkinliklerde yaklaşık yarım milyon tıbbi başvuru ve 22 binden fazla sıcakla ilişkili hastalık kaydı saptadı. Buna karşılık iyi örgütlenmiş saha sağlık sistemi bulunan etkinliklerde hastaların yüzde 90’dan fazlası mekânda tedavi edilebildi. Bu oran, hazırlığın ambulans ve hastane yükünü de azaltabileceğine işaret ediyor.</p>

<p>Rehber tek bir önleme dayanmıyor. Güvenli içme suyu ve tuvaletlere kolay erişim, gölgeli veya serinleme alanları, günün en sıcak saatlerine göre program değişikliği, kalabalık akışının düzenlenmesi, çalışanlar için dinlenme planı, açık risk iletişimi ve gerçek zamanlı sağlık izlemi birlikte ele alınıyor. Mekân tasarımı, ulaşım ve güvenlik ekipleri de sağlık planının parçası sayılıyor.</p>

<p>Yaşlılar, çocuklar, hamileler, kronik hastalığı bulunanlar ve sıcak ortamda uzun süre çalışan görevliler için ek koruma gerekebiliyor. Bu grupların serin alanlara ve sağlık desteğine erişimi önceden planlanmalı.</p>

<h2>Risk etkinlik başlamadan ölçülmeli</h2>

<p>Yeni paket; uygulama rehberi, sistematik incelemeler, iletişim kaynakları ve ayrı bir risk değerlendirme aracı içeriyor. Değerlendirmenin yalnız hava sıcaklığına bakmaması gerekiyor. Nem, güneş altında kalma süresi, fiziksel efor, kalabalık yoğunluğu, suya erişim ve yerel sağlık kapasitesi birlikte değerlendiriliyor. Hazırlık, etkileri azaltma ve etkinlik sonrası değerlendirme aşamalarının tamamında aynı yaklaşımın sürdürülmesi öneriliyor.</p>

<p>Rehber, belirli bir etkinliğin otomatik olarak güvenli olduğu anlamına gelmiyor ve ulusal kuralların yerine geçmiyor. Organizatörlerin yerel hava uyarıları, iş sağlığı yükümlülükleri ve acil durum planlarıyla birlikte kullanacağı bir çerçeve sunuyor. Dünya çapındaki daha geniş sağlık hazırlığı yaklaşımı için <a href="/haber/dunya-yeni-pandemilere-hazirlik-taahhudunu-yeniledi">küresel pandemi hazırlığı taahhüdü</a> de incelenebilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler DSÖ’nün 30 Eylül 2026 tarihli <a href="https://www.who.int/hongkongchina/news/detail-global/30-09-2026-who-releases-new-guidance-to-prevent-heat-related-illness-at-mass-gatherings" target="_blank" rel="noopener noreferrer">haber duyurusu</a> ile kurumun 120 sayfalık <a href="https://www.who.int/publications/i/item/9789240124332" target="_blank" rel="noopener noreferrer">uygulama rehberi</a> karşılaştırılarak derlenmiştir. Bu yazı tıbbi tavsiye değildir. Kapak temsili bir editoryal görseldir; gerçek bir etkinliği göstermez.</p>
    `,
  }),
  editorial({
    slug: "roman-ilk-koronagraf-isigi-ve-hassas-yonelim",
    title: "Roman Uzay Teleskobu İlk Koronagraf Işığını Aldı: Test Ne Kanıtladı?",
    excerpt: "NASA’nın Roman teleskobu hassas yönelim testlerini geçti; koronagrafı da ilk kez kozmik ışık alarak odaklanmış görüntü üretebildiğini gösterdi.",
    category: "Bilim & Uzay",
    published_at: "2026-10-01T09:04:00+03:00",
    cover_image: "/editorial/2026-10-01/roman-koronagraf-ilk-isik.webp",
    original_source_url: "https://science.nasa.gov/blogs/roman/2026/09/30/nasa-checks-roman-guidance-system-takes-first-coronagraph-observation/",
    content: `
<p>NASA’nın Nancy Grace Roman Uzay Teleskobu, bilim gözlemlerine hazırlanırken iki önemli devreye alma adımını tamamladı. Teleskobun hassas yönelim sistemi 15–21 Eylül arasında yapılan testleri geçti; Koronagraf Aygıtı ise 22 Eylül’de ilk kez uzaydan gelen ışığı aldı. Sonuç, sistemlerin çalıştığını gösteren erken bir mühendislik kilometre taşı olsa da henüz yeni bir ötegezegen keşfi anlamına gelmiyor.</p>

<h2>Teleskop hedefte nasıl sabit kalıyor?</h2>

<p>Roman’ın ana kamerası Geniş Alan Aygıtı’ndaki 18 dedektörün küçük bir bölümü, konumu iyi bilinen ayrı kılavuz yıldızları hızla izlemek için kullanılıyor. Yönelim kontrol sistemi teleskobu hedefe çevirdikten sonra hassas kılavuz sistemi yıldızların konumunu saniyede yaklaşık dört kez bildiriyor. Uzay aracı da olası kaymayı çok küçük hareketlerle düzeltiyor.</p>

<p>NASA’ya göre testler, teleskobun Geniş Alan Aygıtı gözlemlerinde yarım saat; daha uzun süren koronagraf gözlemlerinde sekiz saat boyunca derecenin yüz binde birinden daha iyi kararlılıkla hedefte kalabildiğini gösterdi. Bu hassasiyet, dakikalar veya saatler boyunca toplanan ışığın bulanıklaşmaması için gerekli.</p>

<h2>İlk koronagraf görüntüsü ne anlattı?</h2>

<p>İlk adımda aygıt, Büyük Macellan Bulutu’ndaki sönük bir yıldızı görüntüledi. Dedektörler kirleticilerin yüzeye yapışmasını önlemek için nihai çalışma sıcaklığından daha sıcak tutulduğundan görüntüde beklenen gürültü vardı. Daha sonra dedektörler soğutuldu ve ekip, gökyüzünün seçilen başka bir bölümünde beklediği çok sayıda yıldızı gördü. NASA bu aşamayı, ışığın sistemden geçtiğini ve aygıtın odaklanmış görüntü üretebildiğini doğrulayan sınırlı test olarak tanımlıyor.</p>

<p>Koronagrafın asıl amacı, parlak yıldız ışığını maskeler ve biçimi değiştirilebilen aynalarla bastırarak yanındaki çok daha sönük gezegenleri ve toz disklerini doğrudan görüntülemeyi denemek. Bunun için giderek karmaşıklaşan kalibrasyonlar tamamlanacak. Evreni farklı dalga boylarında inceleyecek başka bir görev için <a href="/haber/prima-uzay-teleskobu-evrenin-soguk-yuzunu-arayacak">PRIMA uzay teleskobu haberine</a> de bakılabilir.</p>

<p>Önümüzdeki testler, yıldız ışığını bastıran optik bileşenlerin uzay ortamında birlikte ne kadar kararlı çalıştığını sınayacak. Bilimsel performans ancak bu kalibrasyonların ardından değerlendirilebilecek.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA’nın 30 Eylül 2026 tarihli <a href="https://science.nasa.gov/blogs/roman/2026/09/30/nasa-checks-roman-guidance-system-takes-first-coronagraph-observation/" target="_blank" rel="noopener noreferrer">devreye alma güncellemesi</a> ve kurumun <a href="https://science.nasa.gov/mission/roman-space-telescope/coronagraph/" target="_blank" rel="noopener noreferrer">Roman Koronagrafı tanıtımı</a> temel alınarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek teleskop fotoğrafı veya bilimsel görüntü değildir.</p>
    `,
  }),
  editorial({
    slug: "kirsal-okullarda-yapay-zeka-ogretmen-yetkinligi",
    title: "Kırsal Okullarda Yapay Zekâ: Donanımdan Önce Öğretmen Yetkinliği",
    excerpt: "UNESCO’nun Çin ve Güneydoğu Asya’dan eğitimcileri buluşturan programı, kırsal okullarda yapay zekâ ve STEM dönüşümünün öğretmen eğitimiyle birlikte ilerlemesi gerektiğini vurguluyor.",
    category: "Teknoloji",
    published_at: "2026-10-01T09:03:00+03:00",
    cover_image: "/editorial/2026-10-01/kirsal-okul-ai-ogretmen.webp",
    original_source_url: "https://www.unesco.org/en/articles/china-southeast-asia-programme-strengthens-teacher-capacity-ai-and-stem-education-rural-communities",
    content: `
<p>Kırsal bir okula bilgisayar veya yapay zekâ aracı götürmek, tek başına eğitimde dijital dönüşüm sağlamıyor. UNESCO’nun 30 Eylül’de duyurduğu Çin–Güneydoğu Asya kapasite programı, altyapı yatırımı ile öğretmenlerin teknoloji, etik ve pedagojik kullanım becerilerinin birlikte geliştirilmesi gerektiğini öne çıkarıyor.</p>

<p>17–23 Ağustos’ta Pekin’de düzenlenen programa Çin ve Güneydoğu Asya’dan 100’den fazla eğitim politikacısı, okul yöneticisi, öğretmen ve uzman katıldı. Çalışmalar; yapay zekâ okuryazarlığı, STEM eğitimi, dijital eşitlik ve kırsal ya da yeterince hizmet alamayan topluluklarda teknolojinin kullanımı üzerine deneyim paylaşımına odaklandı. Katılımcılar okulları, eğitim kurumlarını ve teknoloji paydaşlarını da ziyaret etti.</p>

<h2>Öğretmenin rolü neden merkezde?</h2>

<p>Bir aracın sınıfta bulunması, öğrencinin ne öğrendiğini veya bilginin güvenilir biçimde kullanıldığını garanti etmiyor. Öğretmen; aracın ders hedefiyle ilişkisini kuruyor, hatalı çıktıları sorgulatıyor, öğrencilerin kişisel verilerini koruyor ve erişim farklılıklarının yeni bir eşitsizliğe dönüşmesini önlemeye çalışıyor. Programın ortak mesajı da teknolojinin eğitime katkı sağlayabileceği, ancak anlamlı ve kapsayıcı öğrenmeyi öğretmenin mümkün kıldığı yönünde.</p>

<h2>Yapay zekâ yetkinliği hangi becerileri içeriyor?</h2>

<p>UNESCO’nun öğretmenler için yapay zekâ yetkinlik çerçevesi 15 beceriyi beş alanda topluyor: insan merkezli yaklaşım, yapay zekâ etiği, temel bilgiler ve uygulamalar, yapay zekâ pedagojisi ve mesleki öğrenme. “Edinme, derinleştirme ve üretme” aşamaları, tek seferlik bir araç tanıtımı yerine sürekli mesleki gelişim öngörüyor.</p>

<p>Programın düzenlenmiş olması, katılımcı ülkelerde kırsal okulların altyapı veya öğretmen açığının çözüldüğünü kanıtlamıyor. Sınıf sonuçlarını değerlendirmek için eğitimin yerel müfredata nasıl aktarıldığı, öğretmenlere uzun vadeli destek verilip verilmediği ve öğrenciler arasındaki erişim farklarının ölçülmesi gerekiyor. Yapay zekânın bilgi üretimindeki daha geniş etkisi için <a href="/haber/yapay-zeka-bilim-kulturunun-yerini-alabilir-mi">bilim kültürü ve yapay zekâ haberine</a> de göz atılabilir.</p>

<p>İnternet bağlantısı, cihaz bakımı, yerel dilde içerik ve teknik destek sürekliliği de öğretmenin öğrendiğini sınıfta uygulayabilmesini doğrudan etkiliyor. Bu nedenle başarı yalnız dağıtılan cihaz sayısıyla ölçülemez.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler UNESCO’nun 30 Eylül 2026 tarihli <a href="https://www.unesco.org/en/articles/china-southeast-asia-programme-strengthens-teacher-capacity-ai-and-stem-education-rural-communities" target="_blank" rel="noopener noreferrer">program duyurusu</a> ve kurumun <a href="https://www.unesco.org/en/articles/ai-competency-framework-teachers" target="_blank" rel="noopener noreferrer">öğretmenler için yapay zekâ yetkinlik çerçevesi</a> temel alınarak derlenmiştir. Kapak temsili bir editoryal görseldir; gerçek bir okul veya program katılımcısını göstermemektedir.</p>
    `,
  }),
  editorial({
    slug: "montana-yangin-bulutunda-nadir-pileus-gozlemi",
    title: "Montana’daki Yangın Bulutunun Üzerinde Nadir Bir “Şapka” Görüldü",
    excerpt: "NASA’nın araştırma uçağı, Sand Creek yangınının oluşturduğu pirokümülüsün üzerinde yalnızca birkaç dakika yaşayan pileus bulutunu 50 tayfsal bantta görüntüledi.",
    category: "Bilim & Uzay",
    published_at: "2026-09-30T09:13:00+03:00",
    cover_image: "/editorial/2026-09-30/montana-yangin-bulutu-pileus.webp",
    original_source_url: "https://science.nasa.gov/earth/earth-observatory/fire-cloud-with-a-pileus-on-top/",
    content: `
<p>Montana’daki Sand Creek orman yangınının üzerinde yükselen dumanlı pirokümülüs bulutu, 11 Ağustos’ta çok kısa ömürlü başka bir bulutla örtüldü. NASA’nın ER-2 araştırma uçağındaki MASTER aygıtı, pirokümülüsün tepesinde ince ve düzgün bir tabaka gibi duran pileus bulutunu görüntüledi. “Şapka” anlamına gelen Latince kökten adını alan bu bulut türü biliniyor; ancak bir yangın bulutuyla etkileşiminin bu ayrıntıda kaydedilmesi nadir.</p>

<h2>Bulutun üzerinde bulut nasıl oluştu?</h2>

<p>Yangının ısıttığı hava çok hızlı yükselerek üstündeki daha nemli yatay hava katmanını yukarı itti. Yükselen hava soğuyunca içerdiği su buharı yoğunlaştı ve pirokümülüsün üzerinde pürüzsüz pileus tabakası oluştu. Süreç, nemli havanın bir dağın üzerinden geçerken yükselip bulut oluşturmasına benziyor; burada geçici “dağ” görevini büyüyen yangın bulutu üstlendi.</p>

<p>Pileus bulutları çoğu zaman birkaç dakika içinde alttaki güçlü konveksiyon tarafından yutuluyor. Araştırmacılar uçuş sırasında duman sütununu yaklaşık 30 dakikada bir görüntüledi; pileus yalnızca tek sahnede açıkça seçilebildi. Bu kısa pencere, yangın dumanı içindeki son derece güçlü yukarı hava hareketlerinin doğrudan işareti sayılıyor.</p>

<h2>Tek kare neden 50 farklı ölçüm içeriyor?</h2>

<p>MASTER görünür ışıktan kızılötesine uzanan 50 tayfsal bantta veri topluyor. Doğal renkli görüntü duman, su ve bulut biçimini gösterirken kısa dalga kızılötesi bantlar yanmış alanı ve çevredeki etkin yangın noktalarını ayırabiliyor. Aynı anda uçağın aşağı bakan radarları da bulutun iç yapısını inceledi. Böylece ekip, yüzeydeki yangının davranışını yükselen duman sütunu ve bulut süreçleriyle birlikte haritalayabildi.</p>

<p>Gözlem 17.40’ta, yangın Mount Comet’in batı yamacında rüzgâr ve arazi kanallarıyla hızlanırken yapıldı. Tek başına pileus görüntüsü yangının gelecekte nasıl ilerleyeceğini göstermiyor; fakat NASA’nın INSPYRE kampanyası için yüzey yangını ile üst atmosferdeki süreçleri aynı anda ölçmenin neden değerli olduğunu ortaya koyuyor. Farklı bir doğal olayı uzaydan izleyen çalışma için <a href="/haber/nisar-kamcatka-volkanini-uzaydan-adim-adim-izledi">NISAR’ın Kamçatka volkanı gözlemi</a> de okunabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA Earth Observatory’nin 29 Eylül 2026 tarihli <a href="https://science.nasa.gov/earth/earth-observatory/fire-cloud-with-a-pileus-on-top/" target="_blank" rel="noopener noreferrer">gözlem yazısı</a> ve NASA’nın <a href="https://espo.nasa.gov/inspyre" target="_blank" rel="noopener noreferrer">INSPYRE görev sayfası</a> temel alınarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek yangın veya uçuş fotoğrafı değildir.</p>
    `,
  }),
  editorial({
    slug: "tuberkuloz-ve-hiv-bakiminda-entegre-model-cagrisi",
    title: "Tüberküloz ve HIV Bakımında Aynı Kapıya Çıkan Sistem Neden Gerekli?",
    excerpt: "DSÖ Avrupa ve Sınır Tanımayan Doktorlar, Doğu Avrupa ile Orta Asya’da tüberküloz ve HIV hizmetlerini tek bakım zincirinde buluşturmak için işbirliği başlattı.",
    category: "Dünya",
    published_at: "2026-09-30T09:12:00+03:00",
    cover_image: "/editorial/2026-09-30/tb-hiv-entegre-bakim.webp",
    original_source_url: "https://www.who.int/belarus/news/item/29-09-2026-who-europe-and-msf-join-forces-to-improve-tb-and-hiv-care-across-eastern-europe-and-central-asia",
    content: `
<p>Doğu Avrupa ve Orta Asya’da tüberküloz, ilaca dirençli tüberküloz ve HIV aynı kişileri ve toplulukları sıkça etkiliyor. Dünya Sağlık Örgütü Avrupa Bölge Ofisi ile Sınır Tanımayan Doktorlar (MSF), hastaların ayrı kurumlar arasında kaybolmasını azaltmak için tanı, tedavi ve sosyal desteği tek bakım zincirinde birleştiren modeller üzerinde çalışacaklarını açıkladı.</p>

<h2>Rakamlar hangi boşluğu gösteriyor?</h2>

<p>DSÖ’nün tahminine göre Avrupa Bölgesi’nde 2024’te yaklaşık 204 bin kişi tüberküloza yakalandı; 161 bin 569 yeni veya tekrarlayan vaka bildirildi. Bu fark, hastalanan yaklaşık her beş kişiden birinin teşhis edilmediğini ya da kayıtlara girmediğini gösteriyor. Ortak DSÖ-ECDC gözetim raporu ayrıca yeni vakaların yüzde 23’ünde çok ilaca direnç bulunduğunu; küresel oranın yüzde 3,2 olduğunu belirtiyor.</p>

<p>Bölge 2015–2024 arasında tüberküloz görülme sıklığını yüzde 39 azaltarak önemli ilerleme kaydetti. Yine de 2025 için belirlenen yüzde 50 azalma hedefinin gerisinde kaldı. HIV bağışıklık sistemini zayıflattığı için tüberküloza yakalanma ve hastalığın ağır seyretme riskini artırıyor; tüberküloz da HIV ile yaşayan kişilerde önde gelen ölüm nedenlerinden biri olmayı sürdürüyor.</p>

<h2>Entegre bakım neyi değiştirebilir?</h2>

<p>Ayrı hizmetler hastanın farklı günlerde farklı merkezlere gitmesine, test sonuçlarının parçalanmasına ve tedavi takibinin kesilmesine yol açabiliyor. Entegre model; tüberküloz ve HIV testlerini, ilaç tedavilerini, ruh sağlığı ve sosyal desteği aynı ekip içinde koordine etmeyi amaçlıyor. Hızlı tanı ve ilaç duyarlılık testleri uygun tedaviyi erkenden seçmeye, daha kısa ve ağızdan alınan rejimler ise takibi kolaylaştırmaya yardımcı olabilir.</p>

<p>Taşkent’te 29–30 Eylül’de yapılan buluşma, DSÖ, MSF ve Özbekistan Sağlık Bakanlığını bölgedeki uygulayıcılarla bir araya getiriyor. Duyuru tek başına hizmetlerin bütün ülkelerde hemen değiştiği anlamına gelmiyor; etkisi, geliştirilen modelin yerel sağlık sistemlerine aktarılması ve tanı ile tedavi sonuçlarının şeffaf biçimde izlenmesiyle ölçülebilecek. Sağlık sistemlerinin daha geniş hazırlık gündemi için <a href="/haber/dunya-yeni-pandemilere-hazirlik-taahhudunu-yeniledi">küresel pandemi hazırlığı taahhüdü</a> de incelenebilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler DSÖ Avrupa’nın 29 Eylül 2026 tarihli <a href="https://www.who.int/belarus/news/item/29-09-2026-who-europe-and-msf-join-forces-to-improve-tb-and-hiv-care-across-eastern-europe-and-central-asia" target="_blank" rel="noopener noreferrer">işbirliği açıklaması</a> ile ECDC ve DSÖ’nün <a href="https://www.ecdc.europa.eu/en/publications-data/tuberculosis-surveillance-and-monitoring-europe-2026-2024-data" target="_blank" rel="noopener noreferrer">2026 gözetim raporu</a> karşılaştırılarak derlenmiştir. Bu bir tıbbi tavsiye değildir. Kapak temsili bir editoryal görseldir; gerçek hasta veya klinik göstermemektedir.</p>
    `,
  }),
  editorial({
    slug: "dil-haklari-ve-ceviri-teknolojilerinde-kimin-sesi-var",
    title: "Çeviri Teknolojilerinde Kimin Sesi Var? Dil Hakkı Neden Veriyle Başlıyor?",
    excerpt: "UNESCO’nun Uluslararası Çeviri Günü buluşması, düşük kaynaklı ve Yerli dillerin dijital araçlarda görünmesi için teknoloji kadar topluluk onayı ve veri yönetimini de öne çıkarıyor.",
    category: "Kültür",
    published_at: "2026-09-30T09:11:00+03:00",
    cover_image: "/editorial/2026-09-30/dil-haklari-ceviri-teknolojileri.webp",
    original_source_url: "https://www.unesco.org/en/articles/linguistic-diversity-and-language-rights-power-being-understood",
    content: `
<p>Bir dili konuşabilmek, kişinin kamu hizmetinde, eğitimde veya internette anlaşılacağı anlamına gelmiyor. UNESCO ve Translation Commons’ın 30 Eylül Uluslararası Çeviri Günü kapsamında düzenlediği 2026 buluşması, dil çeşitliliğini kültürel bir zenginliğin ötesinde bilgiye erişim ve katılım hakkı olarak ele alıyor. Gündemin merkezinde Yerli diller, çeviri teknolojileri ve dil verisinin kim tarafından yönetildiği bulunuyor.</p>

<h2>Dijital araçlar neden her dili eşit görmüyor?</h2>

<p>Otomatik çeviri, konuşma tanıma ve metin üretme sistemleri çok miktarda dijital örneğe dayanıyor. İnternette az temsil edilen bir dil için yazılı ve sesli veri sınırlıysa sistem daha fazla hata yapabiliyor veya o dili hiç desteklemeyebiliyor. Yazı sistemi, lehçe farklılıkları ve yerel anlamlar da yalnızca kelime eşleştirmeyle çözülemiyor. Bu durum eğitim materyalinden acil durum duyurusuna kadar birçok alanda eşitsizlik yaratabiliyor.</p>

<p>Daha çok veri toplamak tek başına çözüm değil. Dil kayıtlarının kimden alındığı, topluluğun kullanım için onay verip vermediği, veriye kimin eriştiği ve ticari ürünlerde nasıl kullanıldığı açık olmalı. Özellikle Yerli dillerde arşivleme ile açık erişim hedefleri, toplulukların kültürel bilgi üzerindeki hakları ve bazı ifadelerin bağlama özel kalması gereğiyle birlikte düşünülüyor.</p>

<h2>İnsan çevirmenin rolü küçülüyor mu?</h2>

<p>Yapay zekâ araçları taslak üretimini hızlandırabilir; fakat hukuk, sağlık, diplomasi ve kültürel miras gibi alanlarda anlam kayması ciddi sonuçlar doğurabilir. İnsan çevirmen yalnızca cümleyi dönüştürmez; bağlamı, hedef kitleyi, terminolojiyi ve olası yanlış anlamayı değerlendirir. UNESCO’nun yaklaşımı, teknoloji geliştirenlerle dil uzmanlarını ve toplulukları aynı karar masasına çağırıyor.</p>

<p>Birleşmiş Milletler Genel Kurulu 2017’de 30 Eylül’ü Uluslararası Çeviri Günü ilan etti. Gün, dil uzmanlarının uluslararası diyalog ve işbirliğindeki rolünü hatırlatıyor. 2026 tartışması ise bu görevin dijital çağda veri yönetişimi, erişilebilir tasarım ve dil haklarıyla genişlediğini gösteriyor. Görsel dillerde erişimin farklı boyutu için <a href="/haber/isaret-dilleri-gunu-ulusal-isaret-dilleri-erisim">ulusal işaret dilleri haberine</a> de bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler UNESCO’nun 30 Eylül 2026 tarihli <a href="https://www.unesco.org/en/articles/linguistic-diversity-and-language-rights-power-being-understood" target="_blank" rel="noopener noreferrer">dil çeşitliliği buluşması</a>, kurumun <a href="https://www.unesco.org/en/articles/unesco-shapes-inclusive-multilingual-and-human-centered-digital-futures-wsis-forum-2026" target="_blank" rel="noopener noreferrer">dijital çok dillilik çalışması</a> ve BM’nin <a href="https://www.un.org/en/observances/international-translation-day" target="_blank" rel="noopener noreferrer">Uluslararası Çeviri Günü sayfası</a> temel alınarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir illüstrasyondur; gerçek kişileri veya belirli bir dil sistemini göstermemektedir.</p>
    `,
  }),
  editorial({
    slug: "juice-dunya-yercekimiyle-jupiter-yolunda-hiz-kazandi",
    title: "JUICE, Dünya’nın Yerçekimiyle Jüpiter Yolunda Hız Kazandı",
    excerpt: "ESA’nın JUICE uzay aracı, Dünya’ya yakın geçişte rotasını 20 derece değiştirdi ve hızını saniyede 3,5 kilometre artırarak Jüpiter yolculuğunda kritik bir adımı tamamladı.",
    category: "Bilim & Uzay",
    published_at: "2026-09-29T09:18:00+03:00",
    cover_image: "/editorial/2026-09-29/juice-dunya-yercekimi-manevrasi.webp",
    original_source_url: "https://www.esa.int/Science_Exploration/Space_Science/Juice/Successful_Earth_flyby_improves_Juice_s_course_to_Jupiter",
    content: `
<p>Avrupa Uzay Ajansı’nın (ESA) Jüpiter Buzlu Uydular Kâşifi JUICE, 28 Eylül’de Dünya’nın çok yakınından geçerek Jüpiter yolculuğundaki kritik manevralardan birini tamamladı. Uzay aracı, Dünya’nın çekiminden yararlanarak uçuş yönünü önceki rotasına göre 20 derece değiştirdi ve hızına saniyede 3,5 kilometre ekledi. Böylece aynı değişim için motorlarını uzun süre çalıştırmak yerine gezegenin yerçekimini kullandı.</p>

<h2>Yakın geçiş ne kadar hassastı?</h2>

<p>JUICE, 28 Eylül saat 11.45 UTC’de Hint Okyanusu’nun yaklaşık 8.640 kilometre üzerinden geçti. ESA ekipleri manevra öncesindeki dört haftada altı olası düzeltme penceresi ayırmıştı; hesaplanan yaklaşma koridoruna girmek için yalnızca bir küçük itki gerekti. Araç 17 Ağustos’tan beri daha sık izleniyor ve yakın geçiş sonrası yörünge ölçümleri 10 Ekim’e kadar sürecek.</p>

<p>Yerçekimi desteği uzay aracına bedelsiz enerji vermiyor. JUICE, Dünya’nın Güneş çevresindeki hareketinden çok küçük bir pay alarak hızını ve yönünü değiştiriyor; Dünya üzerindeki etkisi ise ölçülemeyecek kadar küçük kalıyor. Kazanılan yakıt, Jüpiter sisteminde yapılacak bilimsel gözlemler ve yörünge düzenlemeleri için korunabiliyor.</p>

<h2>Dünya aynı zamanda bir test alanı oldu</h2>

<p>Yakın geçiş yalnızca rota düzeltmesi değildi. JUICE’ın 10 bilim aracından bazıları, özellikleri iyi bilinen Dünya ve Ay üzerinde yeniden sınandı. Araç ayrıca günler boyunca Dünya’nın Güneş’in ters yönüne uzanan manyetik kuyruğundan geçti. ESA-Çin ortak yapımı SMILE görevi kutup ışıkları ile Dünya’ya yakın parçacıkları izlerken JUICE daha uzaktaki manyetik alanı ölçtü. İki gözlem, manyetik kuyruğun kutuplardaki etkilerle ilişkilendirilmesi için birlikte değerlendirilecek.</p>

<p>Bilimsel kamera JANUS’un yüksek çözünürlüklü Dünya ve Ay görüntüleri, veri aktarımı ve ekip incelemesinin ardından yayımlanacak. Bu nedenle ESA’nın ilk duyurusu, henüz bütün bilim sonuçlarının hazır olduğu anlamına gelmiyor.</p>

<p>JUICE Ocak 2029’da Dünya’ya son kez yaklaşacak, 2031’de Jüpiter’e ulaşacak ve Europa, Callisto ile Ganymede çevresinde toplam 35 yakın geçiş yapacak. Uzak evreni farklı dalga boylarında inceleyecek başka bir görev için <a href="/haber/prima-uzay-teleskobu-evrenin-soguk-yuzunu-arayacak">PRIMA uzay teleskobu haberine</a> de bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler ESA’nın 28 Eylül 2026 tarihli <a href="https://www.esa.int/Science_Exploration/Space_Science/Juice/Successful_Earth_flyby_improves_Juice_s_course_to_Jupiter" target="_blank" rel="noopener noreferrer">yakın geçiş açıklaması</a> ve kurumun <a href="https://www.esa.int/Science_Exploration/Space_Science/Juice" target="_blank" rel="noopener noreferrer">JUICE görev sayfası</a> karşılaştırılarak derlenmiştir. Kapak Ugavole için üretilmiş temsili editoryal görseldir; gerçek görev fotoğrafı veya rota haritası değildir.</p>
    `,
  }),
  editorial({
    slug: "letonya-alkol-satis-kisitlamalari-ilk-sonuclar",
    title: "Letonya’nın Alkol Satış Kısıtlamalarında İlk Beş Ayda Ne Değişti?",
    excerpt: "DSÖ Avrupa’nın erken değerlendirmesine göre Letonya’da satış saatleri, hızlı teslimat ve promosyonlara getirilen sınırların ardından tamamen alkole bağlı ölümler ilk beş ayda yüzde 27 azaldı.",
    category: "Yaşam",
    published_at: "2026-09-29T09:17:00+03:00",
    cover_image: "/editorial/2026-09-29/letonya-alkol-politikasi.webp",
    original_source_url: "https://www.who.int/europe/news/item/28-09-2026-new-alcohol-policy-measures-in-latvia-produce-rapid-public-health-gains",
    content: `
<p>Letonya’da alkollü içeceklere erişimi azaltan yeni kuralların ardından, tamamen alkole bağlanan nedenlerden ölümler ilk beş ayda yüzde 27 düştü. Dünya Sağlık Örgütü Avrupa Bölgesi’nin Letonya Sağlık Bakanlığının talebiyle yaptığı erken değerlendirme, 1 Ağustos–31 Aralık 2025 döneminde 60’tan fazla ölümün önlenmiş olabileceğini hesaplıyor.</p>

<h2>Hangi kurallar değişti?</h2>

<p>Parlamentonun Ocak 2025’te kabul ettiği düzenlemelerin temel bölümü 1 Ağustos’ta yürürlüğe girdi. Perakende satış saatleri kısaltıldı; internetten veya uygulamadan alınan içeceklerin anında teslim edilmesi engellendi. Kumar mekânlarındaki satışlara, küçük ambalajlara, fiyat ve indirim reklamlarına ve promosyon kampanyalarına da sınırlar getirildi. Amaç, özellikle gece saatlerindeki ve plansız satın almaları azaltmaktı.</p>

<p>DSÖ değerlendirmesi; alkol zehirlenmesi, alkole bağlı karaciğer hastalığı ve alkolün yol açtığı akut pankreatit gibi ölüm nedenlerine odaklandı. Bunlar “tamamen alkole atfedilebilir” başlığı altında izleniyor. Dış nedenler, kalp-damar hastalıkları ve kendine zarar verme gibi alkolün payının daha karmaşık olduğu göstergeler için daha uzun takip gerektiği belirtiliyor.</p>

<h2>Yüzde 27 ne kadar kesin bir sonuç?</h2>

<p>Sonuç dikkat çekici olsa da henüz son söz değil. İnceleme yalnızca beş aylık reform sonrası veriye dayanıyor ve bulgular bağımsız hakem değerlendirmesine sunuldu. Mevsimsel değişimler, kayıt biçimi ve başka sağlık politikaları gibi etkenlerin ayrıştırılması için daha uzun zaman dizileri gerekiyor. Bu nedenle sayı, kuralların bütün etkisini kanıtlayan kesin bir neden-sonuç hesabı olarak değil, izlenmesi gereken güçlü bir erken işaret olarak okunmalı.</p>

<p>Letonya’nın yetişkin başına yıllık toplam alkol tüketimi 14,2 litreyle dünya çapında yüksek seviyelerde. DSÖ Avrupa Bölgesi genelinde ise alkol kullanımının yılda yaklaşık 800 bin ölümle bağlantılı olduğu tahmin ediliyor. Kurum, fiziksel erişimi azaltmayı, vergileri kullanmayı ve pazarlamayı sınırlamayı bulaşıcı olmayan hastalıkları önlemede maliyet etkili araçlar arasında sayıyor.</p>

<p>Kalite standartlarının sağlık politikasındaki başka bir örneği için <a href="/haber/dso-tibbi-cihaz-on-yeterlilik-programi-genisledi">DSÖ’nün tıbbi cihaz ön yeterlilik programı haberine</a> de bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler DSÖ Avrupa’nın 28 Eylül 2026 tarihli <a href="https://www.who.int/europe/news/item/28-09-2026-new-alcohol-policy-measures-in-latvia-produce-rapid-public-health-gains" target="_blank" rel="noopener noreferrer">Letonya değerlendirmesi</a> ve kurumun <a href="https://www.who.int/europe/health-topics/alcohol" target="_blank" rel="noopener noreferrer">alkol kullanımı konu sayfası</a> temel alınarak derlenmiştir. Kapak temsili bir editoryal görseldir; belirli bir mağazayı veya gerçek istatistik grafiğini göstermemektedir.</p>
    `,
  }),
  editorial({
    slug: "dijital-cagda-bilgiye-erisim-ve-bilgi-butunlugu",
    title: "Bilgi Kirliliği Çağında “Bilgiye Erişim” Neden Tek Başına Yetmiyor?",
    excerpt: "UNESCO’nun 2026 gündemi, kamunun bilgiye erişim hakkını; doğrulanabilir resmî veri, şeffaflık, medya okuryazarlığı ve yapay zekâ kaynaklı içeriklerle mücadeleyle birlikte ele alıyor.",
    category: "Teknoloji",
    published_at: "2026-09-29T09:16:00+03:00",
    cover_image: "/editorial/2026-09-29/bilgi-butunlugu-dijital-cag.webp",
    original_source_url: "https://www.unesco.org/en/articles/integrity-dividend-value-knowing",
    content: `
<p>Dijital ortamda bilgiye ulaşmak hiç olmadığı kadar kolay; fakat erişilen içeriğin doğru, güncel ve hangi kuruma dayandığının anlaşılması aynı hızda kolaylaşmadı. UNESCO’nun 2026 Uluslararası Bilgiye Evrensel Erişim Günü için seçtiği tema bu farkı merkeze alıyor: bilgiye erişim hakkı, dijital çağda “bilgi bütünlüğünü” korumaya nasıl yardımcı olabilir?</p>

<h2>Erişim ile güvenilirlik arasındaki fark</h2>

<p>Bir belgenin internette bulunması tek başına şeffaflık sağlamıyor. Dosyanın güncel sürümünün yayımlanması, kararın kim tarafından ve hangi verilerle alındığının açıklanması, arşivlerin aranabilir olması ve bilgilerin farklı dil ve erişilebilirlik ihtiyaçlarına uygun sunulması gerekiyor. Proaktif açıklama, vatandaşın yalnızca talepte bulunmasını beklemek yerine kamu yararı taşıyan verilerin düzenli biçimde yayımlanması anlamına geliyor.</p>

<p>UNESCO’nun 2025 izleme çalışmasına göre 141 ülkede bilgiye erişim için yasal güvenceler bulunuyor. Buna rağmen parçalanmış izleyici grupları, platformlara bağımlılık, kurumlara duyulan güvenin azalması ve yapay zekâyla üretilen ikna edici sahte içerikler yasal hakkın uygulamadaki etkisini zayıflatabiliyor. Bu nedenle açık veri, bağımsız medya, denetim kurumları ve medya okuryazarlığı birbirinin yerine geçen çözümler değil; aynı güven zincirinin farklı halkaları.</p>

<h2>2026 toplantılarında hangi sorular öne çıkıyor?</h2>

<p>Sierra Leone’de 28–30 Eylül’de düzenlenen küresel konferans, bilgi komiserlerini, kamu kurumlarını ve sivil toplumu bir araya getiriyor. Bangkok’ta 29 Eylül’de yapılan Güneydoğu Asya paneli ise yanlış bilgi, dezenformasyon ve nefret söylemi karşısında kamu kayıtlarına erişimin nasıl güçlendirilebileceğini tartışıyor. UNESCO, 2000’den bu yana 100’den fazla ülkenin anayasal, yasal veya politika düzeyinde erişim güvencesi benimsediğini belirtiyor.</p>

<p>Buradaki amaç, resmî kaynağı otomatik olarak hatasız kabul etmek değil. Tarih, yöntem, veri kaynağı ve düzeltme geçmişi görünür olduğunda gazeteciler, araştırmacılar ve vatandaşlar iddiaları karşılaştırabilir. Kurumların yanlış bilgiyi yalnızca kaldırmaya odaklanması da yeterli değil; zamanında ve doğrulanabilir bilgi boşluğu doldurulmazsa söylentiler daha hızlı yayılabiliyor.</p>

<p>Yapay zekânın bilgi üretimindeki rolünü farklı bir açıdan incelemek için <a href="/haber/yapay-zeka-bilim-kulturunun-yerini-alabilir-mi">bilim kültürü ve yapay zekâ haberine</a> de göz atılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler UNESCO’nun 28 Eylül 2026 tarihli <a href="https://www.unesco.org/en/articles/integrity-dividend-value-knowing" target="_blank" rel="noopener noreferrer">bilgi bütünlüğü değerlendirmesi</a>, 29 Eylül tarihli <a href="https://www.unesco.org/en/articles/access-information-and-information-integrity-digital-age-lessons-and-challenges-south-east-asia" target="_blank" rel="noopener noreferrer">bölgesel etkinlik sayfası</a> ve <a href="https://www.unesco.org/en/days/universal-access-information" target="_blank" rel="noopener noreferrer">uluslararası gün kaydı</a> karşılaştırılarak derlenmiştir. Kapak temsili bir editoryal görseldir.</p>
    `,
  }),
  editorial({
    slug: "gronland-buzunun-altindaki-vadi-agi",
    title: "Grönland Buzunun Altında 1.943 Vadilik Ağ Haritalandı",
    excerpt: "NASA öncülüğündeki çalışma, buz yüzeyindeki küçük dalgalardan yararlanarak Grönland buz tabakasının altındaki 1.943 vadiyi birbirine bağlayan yeni bir harita oluşturdu.",
    category: "Bilim & Uzay",
    published_at: "2026-09-28T09:12:00+03:00",
    cover_image: "/editorial/2026-09-28/gronland-buz-alti-vadileri.webp",
    original_source_url: "https://science.nasa.gov/earth/earth-observatory/uncovering-the-valleys-hidden-below-greenlands-ice/",
    content: `
<p>Grönland’ın 1,7 milyon kilometrekarelik buz tabakasının altında, insan gözünün doğrudan görmediği geniş bir vadi ağı bulunuyor. NASA öncülüğündeki yeni haritalama çalışması, 1.943 buzulaltı vadisini bir araya getirdi. Vadilerin yaklaşık üçte biri önceki yaygın haritada görünmüyordu; bilinenlerin yaklaşık yarısının ise iç kesimlere daha uzun uzandığı anlaşıldı. Sonuç, kıtanın buz öncesi coğrafyasını daha bütünlüklü biçimde okumaya yardım ediyor.</p>

<h2>Buzun altı yüzeyden nasıl okunuyor?</h2>

<p>Araştırmacılar “Buz Akışı Bozulma Analizi” adlı yöntemi kullandı. Buz, alttaki bir sırtın veya vadinin üzerinden ilerlerken yüzeyde çok küçük yükselti ve akış değişimleri bırakıyor. ICESat-2 gibi uydu gözlemleri ve yüzey hız haritaları bu ince işaretleri kaydediyor; yöntem de görünmeyen ana kayanın olası biçimini hesaplıyor.</p>

<p>Çalışmanın yazarları yeni sonucu radar ölçümlerinin yerine geçen doğrudan bir görüntü olarak sunmuyor. Mevcut BedMachine Greenland verisiyle yeni hesapları birleştiriyor ve radar bulunan bölgelerde doğrulama yapıyorlar. Araştırma makalesine göre mevcut 150 metre çözünürlüklü haritanın buzla kaplı hücrelerinin yalnız yüzde 4,4’ünde radar gözlemi bulunuyor. Bu nedenle yüzey izlerinden çıkarım, özellikle yavaş akan ve seyrek ölçülmüş iç bölgelerdeki boşlukları azaltabiliyor.</p>

<h2>Vadiler neden önemli?</h2>

<p>Alt yüzeyin şekli buzun hangi yöne ve ne hızla akabileceğini, buz altındaki suyun nerelerde toplanıp ilerleyebileceğini etkiliyor. Yeni harita, büyük çıkış buzullarının çoğuna bağlı vadilerin iç kesimlere önceki tahminlerden daha fazla uzandığını gösteriyor. Bu bilgi, buz tabakasının geçmişini açıklamanın yanında gelecekteki değişim modellerini de iyileştirebilir; ancak tek başına yeni bir deniz seviyesi tahmini üretmiyor.</p>

<p>Güney ve doğudaki yüksek arazilerden başlayan bazı vadi desenleri, buz tabakasının oluşum tarihine dair mevcut görüşle uyumlu. Batı-orta bölgede güneybatı-kuzeydoğu doğrultusunda uzanan düz vadiler ise olası tektonik etkiler konusunda yeni sorular doğuruyor. Arktik değişimini üst yüzeyden izleyen başka bir ölçüm için <a href="/haber/arktik-deniz-buzu-2026-minimumu">2026 Arktik deniz buzu minimumu haberine</a> de bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA Earth Observatory’nin 28 Eylül 2026 tarihli <a href="https://science.nasa.gov/earth/earth-observatory/uncovering-the-valleys-hidden-below-greenlands-ice/" target="_blank" rel="noopener noreferrer">değerlendirmesi</a> ve Geophysical Research Letters’ta yayımlanan <a href="https://doi.org/10.1029/2026GL122028" target="_blank" rel="noopener noreferrer">hakemli araştırma</a> karşılaştırılarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir kesit görselidir; gerçek radar görüntüsü veya ölçüm haritası değildir.</p>
    `,
  }),
  editorial({
    slug: "2027-guney-yarimkure-grip-asisi-bilesimi",
    title: "2027 Güney Yarımküre Grip Aşısının İçeriği Nasıl Belirlendi?",
    excerpt: "DSÖ, 2027 Güney Yarımküre grip sezonu için önerilen virüs bileşimini açıkladı; karar küresel laboratuvar gözetimi ve dolaşımdaki türlerin karşılaştırılmasına dayanıyor.",
    category: "Yaşam",
    published_at: "2026-09-28T09:11:00+03:00",
    cover_image: "/editorial/2026-09-28/grip-asisi-kuresel-gozetim.webp",
    original_source_url: "https://www.who.int/news/item/25-09-2026-recommendations-announced-for-influenza-vaccine-composition-for-the-2027-southern-hemisphere-influenza-season",
    content: `
<p>Dünya Sağlık Örgütü, 2027 Güney Yarımküre grip sezonunda kullanılacak aşılar için önerdiği virüs bileşimini açıkladı. Bu duyuru, aşının bir ülkeye ulaştığı veya herkes için aynı tarihte uygulanacağı anlamına gelmiyor. Öneri; üreticilerin, ulusal düzenleyici kurumların ve aşılama programlarının aylar süren hazırlığına bilimsel bir başlangıç sağlıyor.</p>

<h2>Neden bileşim her yıl yeniden değerlendiriliyor?</h2>

<p>Grip virüsleri zaman içinde değişiyor. DSÖ, Küresel Grip Gözetim ve Müdahale Sistemi aracılığıyla farklı ülkelerdeki laboratuvarların paylaştığı örnekleri, genetik verileri ve dolaşım örüntülerini yılda iki kez inceliyor. Şubat-ağustos 2026 döneminde A(H1N1)pdm09, A(H3N2) ve B virüsleri bütün bölgelerde farklı oranlarda görüldü. Çoğu bölgede influenza A baskınken Kuzey ve Batı Afrika, Kuzey Amerika ve Doğu Asya’da influenza B daha yaygındı.</p>

<p>2027 Güney Yarımküre sezonu için yumurtada üretilen üç bileşenli aşılarda A/Missouri/11/2025 benzeri H1N1, A/Darwin/1454/2025 benzeri H3N2 ve B/Tokyo/EIS13-175/2025 benzeri Victoria soyu öneriliyor. Hücre kültürü, rekombinant protein veya nükleik asit temelli üretimde ise H1N1 aynı kalırken H3N2 için A/Darwin/1415/2025, B için B/Pennsylvania/14/2025 benzeri virüsler seçildi.</p>

<h2>Farklı üretim yöntemleri neden farklı adaylar kullanıyor?</h2>

<p>Bir referans virüsün üretim ortamındaki davranışı, yumurta ve hücre temelli süreçlerde aynı olmayabilir. Bu nedenle uzmanlar dolaşımdaki virüslere mümkün olduğunca yakın bağışıklık yanıtı hedeflerken her üretim platformu için uygun adayları ayrı değerlendirebiliyor. Öneri listesi bir tedavi reçetesi değil; belirli bir kişinin aşı zamanı ve uygunluğu kendi ülkesinin sağlık otoritesi ile sağlık uzmanlarının güncel yönlendirmesine bağlı.</p>

<p>Uzmanlar toplantıda hayvanlardan insanlara geçen grip virüslerini de gözden geçirdi ve olası pandemi durumunda üretimi hızlandırabilecek aday aşı virüslerini değerlendirdi. Küresel salgın hazırlığının daha geniş çerçevesi için <a href="/haber/dunya-yeni-pandemilere-hazirlik-taahhudunu-yeniledi">ülkelerin pandemi hazırlığı taahhüdü haberine</a> de göz atılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler DSÖ’nün 25 Eylül 2026 tarihli <a href="https://www.who.int/news/item/25-09-2026-recommendations-announced-for-influenza-vaccine-composition-for-the-2027-southern-hemisphere-influenza-season" target="_blank" rel="noopener noreferrer">aşı bileşimi açıklaması</a> ve <a href="https://www.who.int/teams/global-influenza-programme/influenza-seasonal" target="_blank" rel="noopener noreferrer">Küresel Grip Programı sayfası</a> karşılaştırılarak derlenmiştir. Kapak temsili bir editoryal görseldir; gerçek virüs görüntüsü veya belirli bir aşı ürünü değildir.</p>
    `,
  }),
  editorial({
    slug: "dso-tibbi-cihaz-on-yeterlilik-programi-genisledi",
    title: "DSÖ, Tıbbi Cihaz Kalite Programını Yapay Zekâya Kadar Genişletti",
    excerpt: "DSÖ’nün genişleyen ön yeterlilik programı, doğum kontrol araçlarının yanında tüberküloz taramasında kullanılan bilgisayar destekli görüntüleme yazılımlarını da kapsayacak.",
    category: "Teknoloji",
    published_at: "2026-09-28T09:10:00+03:00",
    cover_image: "/editorial/2026-09-28/tibbi-cihaz-kalite-programi.webp",
    original_source_url: "https://www.who.int/news/item/25-09-2026-who-announces-expansion-of-prequalification-programme-for-medical-devices",
    content: `
<p>Dünya Sağlık Örgütü, temel tıbbi cihazlar için yürüttüğü ön yeterlilik programının kapsamını genişletti. Yeni çerçeve; kadın ve erkek kondomları, rahim içi araçlar, tıbbi erkek sünnet cihazları ve tüberküloz taramasında kullanılan bilgisayar destekli saptama yazılımlarını ortak bir kalite değerlendirme yapısına taşıyor. Değişim, dijital araçların küresel sağlık alımlarındaki yerini daha görünür kılıyor.</p>

<h2>“Ön yeterlilik” ne işe yarıyor?</h2>

<p>DSÖ’nün süreci, bir ürünün kalite, güvenlik ve performans belgelerini bağımsız ve standart bir yöntemle inceliyor. Şartları karşılayan ürünler ön yeterlilik listesine ekleniyor. Birleşmiş Milletler kuruluşları, bağışçılar, satın alma kurumları ve ulusal yetkililer bu listeyi özellikle düzenleme kapasitesinin sınırlı olduğu yerlerde güvenilir bir başvuru noktası olarak kullanabiliyor.</p>

<p>Bu liste, bütün ülkelerde otomatik satış izni anlamına gelmiyor. Ulusal ruhsat, tedarik kararı, yerel kullanım kılavuzu ve sağlık programlarının kapsamı ayrı süreçlerle belirleniyor. DSÖ açıklamasına göre ülkelerin yaklaşık yüzde 70’i ilaçlar ve aşılar için yetersiz veya zayıf düzenleyici sistem bildirmiş durumda; diğer sağlık ürünlerinde güçlük daha da büyük olabiliyor. Genişlemenin hedefi, ortak bir teknik eşik sağlayarak satın alma kararındaki belirsizliği azaltmak.</p>

<h2>Yapay zekâ programda nerede duruyor?</h2>

<p>Kapsama alınan CAD-TB yazılımları, dijital akciğer röntgenlerini analiz ederek tüberküloz ihtimali bulunan kişileri daha ileri test için işaretliyor. Yazılımın çıktısı kesin tanı değil; doğrulayıcı test ve klinik değerlendirme gerekiyor. Yüksek tüberküloz yüküne sahip bölgelerde güvenilir tarama, daha fazla kişiyi tanı sürecine erken yönlendirebilir. Programın yazılımı da fiziksel cihazlar gibi kalite ve performans incelemesine alması, sağlık teknolojisi değerlendirmesinin artık yalnız donanımla sınırlı olmadığını gösteriyor.</p>

<p>Kondom ve rahim içi araçların değerlendirmesi Birleşmiş Milletler Nüfus Fonu’ndan DSÖ’ye aktarılıyor. Erkek sünnet cihazları da daha önceki ayrı kanaldan geniş tıbbi cihaz çerçevesine geçiyor. Uzak ortamda görüntülemeyi kolaylaştıran farklı bir sağlık teknolojisi örneği için <a href="/haber/iss-yapay-zeka-destekli-ultrason-deneyi">ISS’de yapay zekâ destekli ultrason çalışmasına</a> da bakılabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler DSÖ’nün 25 Eylül 2026 tarihli <a href="https://www.who.int/news/item/25-09-2026-who-announces-expansion-of-prequalification-programme-for-medical-devices" target="_blank" rel="noopener noreferrer">program genişletme açıklaması</a>, kurumun <a href="https://extranet.who.int/prequal/news/who-announces-expansion-prequalification-programme-medical-devices" target="_blank" rel="noopener noreferrer">ön yeterlilik duyurusu</a> ve <a href="https://www.who.int/health-topics/medical-devices" target="_blank" rel="noopener noreferrer">tıbbi cihazlar sayfasıyla</a> karşılaştırılarak derlenmiştir. Kapak temsili bir editoryal görseldir; gerçek değerlendirme tesisi veya ürün markalarını göstermemektedir.</p>
    `,
  }),
  editorial({
    slug: "arktik-deniz-buzu-2026-minimumu",
    title: "Arktik Deniz Buzu 2026 Minimumuna İndi: Son 20 Yılın Ortak İşareti",
    excerpt: "NASA ve NSIDC ölçümlerine göre Arktik deniz buzu 12 Eylül’de 4,60 milyon kilometrekareye gerileyerek uydu kayıtlarının en düşük onuncu seviyesini paylaştı.",
    category: "Bilim & Uzay",
    published_at: "2026-09-27T09:12:00+03:00",
    cover_image: "/editorial/2026-09-27/arktik-deniz-buzu-minimumu.webp",
    original_source_url: "https://science.nasa.gov/science-research/earth-science/climate-science/sea-ice/arctic-sea-ice-2026-min/",
    content: `
<p>Arktik Okyanusu’ndaki deniz buzu, yaz erime döneminin sonunda 12 Eylül 2026’da yaklaşık 4,60 milyon kilometrekareye geriledi. NASA ile Colorado Boulder Üniversitesi bünyesindeki Ulusal Kar ve Buz Veri Merkezi’nin (NSIDC) ölçümü, 2026’yı uydu kayıtlarında 2008, 2010 ve 2025 ile birlikte en düşük onuncu minimum seviyeye yerleştiriyor.</p>

<h2>“Onuncu en düşük” neden rahatlatıcı değil?</h2>

<p>Tek bir yılın sıralaması, uzun dönemli değişimi tek başına anlatmıyor. Sürekli uydu gözlemlerinin başladığı 1978 sonundan bu yana en düşük 20 Arktik minimumunun tamamı 2007–2026 döneminde görüldü. NSIDC, 2026 değerinin 1980’ler, 1990’lar ve 2000’lerin başındaki seviyelerden belirgin biçimde daha düşük olduğunu vurguluyor.</p>

<p>Deniz buzu sonbahar ve kışın büyüyor, ilkbahar ile yaz boyunca eriyor ve genellikle eylülde yıllık en küçük alanına ulaşıyor. Rüzgâr, bulutluluk ve yaz sıcaklıkları her yılın sonucunu etkileyebiliyor. NASA’ya göre son on yıldaki artan bulut örtüsü bazı yazlarda güneş ışınımının erimeyi daha fazla hızlandırmasını sınırladı. Bu durum eylül alanında görece bir plato oluşturdu; ancak plato tarihsel olarak düşük bir düzeyde.</p>

<h2>Ölçüm alanı neyi ifade ediyor?</h2>

<p>“Deniz buzu alanı”, buzun tamamen kapladığı yüzeyi saymakla aynı şey değil. Uydu verilerinde belirli oranda buz içeren okyanus hücreleri birlikte değerlendirilerek buzun yayıldığı alan hesaplanıyor. Bu nedenle buzun kalınlığı, yaşı ve parçalı yapısı aynı büyüklükteki iki yılda farklı olabilir. NSIDC ayrıca rüzgârın buzları sıkıştırmasının minimum değeri küçük ölçüde değiştirebileceğini, sayının henüz ön değerlendirme olduğunu belirtiyor.</p>

<p>Antarktika’da ise deniz buzu yıllık maksimumuna yaklaşırken ağustosta kısa süreli ve sıra dışı bir gerileme görüldü. Güney kutbundaki buz, kara tarafından çevrelenmediği için rüzgâr ve hava koşullarına daha serbest yanıt veriyor; bilim insanları bu nedenle tek yıllık dalgalanmaları uzun dönemli eğilim olarak yorumlarken temkinli davranıyor.</p>

<p>Uyduların buz değişimini nasıl izlediğine başka bir örnek için <a href="/haber/nasa-aqua-uydusu-a81-d33b-buzdaglari">Aqua uydusunun iki büyük buzdağını aynı karede görüntülediği haberi</a> de okunabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA’nın 23 Eylül 2026 tarihli <a href="https://science.nasa.gov/science-research/earth-science/climate-science/sea-ice/arctic-sea-ice-2026-min/" target="_blank" rel="noopener noreferrer">Arktik deniz buzu değerlendirmesi</a> ile NSIDC’nin aynı tarihli <a href="https://nsidc.org/news-analyses/news-stories/arctic-sea-ice-has-reached-minimum-extent-2026-antarctic-sea-ice-maximum-most-likely-reached-well" target="_blank" rel="noopener noreferrer">bağımsız ölçüm açıklaması</a> karşılaştırılarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek uydu görüntüsü veya 2026 ölçüm haritası değildir.</p>
    `,
  }),
  editorial({
    slug: "swift-gozlemevi-gama-isini-takibine-dondu",
    title: "Swift Gözlemevi Gama Işını Takibine Döndü, Ancak Zamanı Daralıyor",
    excerpt: "NASA’nın Swift gözlemevi üçüncü bilim aracını yeniden çalıştırdı ve ani gama ışını patlamalarına otomatik yönelme yeteneğini geri kazandı.",
    category: "Bilim & Uzay",
    published_at: "2026-09-27T09:11:00+03:00",
    cover_image: "/editorial/2026-09-27/swift-gama-isini-takibi.webp",
    original_source_url: "https://science.nasa.gov/blogs/swift/2026/09/25/nasas-swift-powers-on-third-instrument-restarts-automated-slewing/",
    content: `
<p>NASA’nın Neil Gehrels Swift Gözlemevi, yüksek enerjili gökyüzünü izleyen üçüncü bilim aracını yeniden devreye aldı. Burst Alert Telescope adı verilen teleskop, 18 Eylül’de kalibrasyonun tamamlanmasının ardından gama ışınlarını yeniden algılamaya başladı. Görev ekibi 21 Eylül’de, uydunun ani parlamalara otomatik olarak yönelme yeteneğini de yeniden açtı.</p>

<h2>Swift neden hızla dönmek zorunda?</h2>

<p>Gama ışını patlamaları, evrendeki en güçlü ve en kısa süreli olaylar arasında. Burst Alert Telescope tek seferde gökyüzünün yaklaşık yüzde 16’sını izliyor. Yeni bir parlama algıladığında günlük gözlem planını keserek uydunun morötesi/optik ve X-ışını teleskoplarını aynı bölgeye yönlendiriyor. Böylece patlamanın farklı dalga boylarındaki hızla değişen izi, olay solmadan kaydedilebiliyor.</p>

<p>Bu otomatik yönelme şubat ayında durdurulmuştu. Swift’in alçalan yörüngesinde atmosferik sürüklenmeyi azaltmak için bilim hedefleri, güneş panellerinin daha elverişli konumda kalacağı gökyüzü noktalarıyla değiştirilmişti. Burst Alert Telescope da enerji tüketimini azaltmak amacıyla nisanda kapatıldı. Plan, ticari bir uzay aracıyla Swift’i daha yüksek yörüngeye taşımaktı; ancak bu görev küçültülünce gözlemevi ağustosta yeniden bilim verisi toplamaya başladı.</p>

<h2>Bilim dönüşü ile yörünge riski aynı anda ilerliyor</h2>

<p>Swift şu anda Dünya’nın yaklaşık 325 kilometre üzerinde bulunuyor. NASA, yükseklik 300 kilometrenin altına indiğinde uzay aracı operasyonlarının zorlaşacağını ve bilim gözlemlerinin büyük olasılıkla sona ereceğini belirtiyor. Mevcut tahmin, bu eşiğin ekimin ilk yarısında ya da ortasında aşılabileceği yönünde. Bu bir kesin kapanış tarihi değil; yörünge koşulları ve görev ekibinin sonraki kararları sonucu değiştirebilir.</p>

<p>2004’te fırlatılan Swift, gama ışını patlamalarını görünür, morötesi, X-ışını ve gama ışını bantlarında birlikte incelemek için tasarlandı. Yeniden çalışan üçlü sistem, kalan sürede yeni patlamalara hızlı yanıt verme fırsatını artırıyor. Uzak evreni farklı dalga boylarında araştıracak bir başka görev için <a href="/haber/prima-uzay-teleskobu-evrenin-soguk-yuzunu-arayacak">PRIMA uzak kızılötesi teleskobu haberine</a> de göz atabilirsin.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA’nın 25 Eylül 2026 tarihli <a href="https://science.nasa.gov/blogs/swift/2026/09/25/nasas-swift-powers-on-third-instrument-restarts-automated-slewing/" target="_blank" rel="noopener noreferrer">Swift görev güncellemesinden</a> ve NASA’nın <a href="https://science.nasa.gov/mission/swift/" target="_blank" rel="noopener noreferrer">görev sayfasından</a> derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek Swift görüntüsü veya gerçek bir gama ışını patlaması fotoğrafı değildir.</p>
    `,
  }),
  editorial({
    slug: "okullarda-ruh-sagligi-icin-ogretmen-rehberi",
    title: "Okullarda Ruh Sağlığı İçin Öğretmenin Rolü Nerede Başlayıp Bitiyor?",
    excerpt: "UNESCO, UNICEF ve DSÖ’nün yeni rehberi; güvenli sınıf ortamı, erken sıkıntı belirtileri, yönlendirme ve öğretmenlerin kendi iyilik hâli için uygulanabilir adımlar sunuyor.",
    category: "Yaşam",
    published_at: "2026-09-27T09:10:00+03:00",
    cover_image: "/editorial/2026-09-27/okul-ruh-sagligi-ogretmen-rehberi.webp",
    original_source_url: "https://www.unesco.org/en/articles/teaching-care-practical-guide-teachers-support-mental-health-and-well-being-schools",
    content: `
<p>Bir öğrencinin zorlandığını ilk fark eden yetişkinlerden biri öğretmeni olabilir. Ancak fark etmek, tanı koymak veya terapi uygulamak anlamına gelmiyor. UNESCO, UNICEF ve Dünya Sağlık Örgütü’nün ortak hazırladığı “Teaching with Care” rehberi, öğretmenin sınıftaki destekleyici rolünü somutlaştırırken bu sınırı özellikle koruyor.</p>

<h2>Güvenli sınıf ortamı günlük davranışlarla kuruluyor</h2>

<p>25 Eylül’de UNESCO tarafından duyurulan rehber; öğrencilerin kendini güvende, dahil ve saygı görmüş hissettiği bir sınıf ortamı kurmayı başlangıç noktası olarak ele alıyor. Olumlu ilişkiler, açık sınıf kuralları, akranlar arasında yardım davranışı ve sosyal-duygusal beceriler ayrı bir uzmanlık seansı yerine günlük ders akışına dahil edilebilecek alanlar olarak sunuluyor.</p>

<p>Kuruluşlara göre dünyada yaklaşık her yedi ergenden biri bir ruh sağlığı sorunu yaşıyor. Stres, dışlanma ve güç yaşam koşulları da öğrencinin derse katılımını ve öğrenmesini etkileyebiliyor. Bu oran, tek tek öğrenciler için tanı anlamına gelmiyor; okulun önleyici ve kapsayıcı bir ortam kurmasının neden önemli olduğunu gösteren küresel bir çerçeve sağlıyor.</p>

<h2>Öğretmen uzman desteğinin yerini almıyor</h2>

<p>Rehberin en kritik mesajı rol sınırı. Öğretmenden ruh sağlığı durumunu teşhis etmesi veya özel tedavi vermesi beklenmiyor. Beklenen; davranıştaki kalıcı değişimleri, belirgin geri çekilmeyi ya da sıkıntı işaretlerini gözlemlemek, öğrenciyi damgalamadan dinlemek ve okulun belirlenmiş destek sistemine yönlendirmek. Acil risk veya güvenlik kaygısı bulunduğunda kurumun koruma prosedürleri ile sağlık ve sosyal hizmet kanalları devreye girmeli.</p>

<p>Aileler, okul yönetimi, psikolojik danışmanlar ve yerel hizmetler arasındaki bağlantı da bu yaklaşımın parçası. Destek yalnız bir öğretmenin omzuna bırakıldığında hem öğrenci hem eğitimci için sürdürülebilir olmuyor. Rehber bu nedenle öğretmenlerin kendi iyilik hâlini, meslektaş desteğini ve gerektiğinde yardım istemesini de sınıf sağlığının bileşeni sayıyor.</p>

<h2>Rehber nasıl okunmalı?</h2>

<p>Belge küresel kullanım için hazırlandığından, her okulun mevzuatı, sevk zinciri ve mevcut uzman kapasitesi farklı olabilir. Uygulama yerel kurumların politikalarıyla uyarlanmalı; metin kişisel tıbbi öneri yerine eğitim ortamları için genel bir çerçeve sunuyor. Öğrenci yaşamına daha geniş bir açıdan bakmak için <a href="/haber/adada-ogrenci-olmanin-12-kisa-yolu">adada öğrenci olmanın kısa yolları rehberini</a> de okuyabilirsin.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler UNESCO’nun 25 Eylül 2026 tarihli <a href="https://www.unesco.org/en/articles/teaching-care-practical-guide-teachers-support-mental-health-and-well-being-schools" target="_blank" rel="noopener noreferrer">“Teaching with Care” duyurusu</a> ve DSÖ’nün <a href="https://www.who.int/publications/i/item/9789240124912" target="_blank" rel="noopener noreferrer">resmî yayın sayfasıyla</a> karşılaştırılarak derlenmiştir. Kapak Ugavole için üretilmiş temsili bir editoryal illüstrasyondur; gerçek öğrenci, öğretmen veya okul ortamını belgelememektedir.</p>
    `,
  }),
  editorial({
    slug: "dunya-yeni-pandemilere-hazirlik-taahhudunu-yeniledi",
    title: "Dünya Yeni Pandemilere Nasıl Hazırlanacak? Liderlerden Ortak Taahhüt",
    excerpt: "BM ve DSÖ, gelecekteki salgınlara hazırlık için erken uyarı, adil aşı erişimi, dayanıklı sağlık sistemleri ve sürdürülebilir finansman başlıklarını öne çıkardı.",
    category: "Dünya",
    published_at: "2026-09-26T09:12:00+03:00",
    cover_image: "/editorial/2026-09-26/pandemi-hazirlik-taahhudu.webp",
    original_source_url: "https://www.who.int/news/item/25-09-2026-world-leaders-renew-commitment-to-protect-the-world-from-future-pandemics",
    content: `
<p>COVID-19’un sağlık sistemlerinde ve toplumlarda bıraktığı açıklar, beş yıl sonra dünya gündeminde kalmaya devam ediyor. Devlet ve hükümet liderleri, 25 Eylül’de Birleşmiş Milletler Genel Kurulu kapsamında düzenlenen ikinci üst düzey pandemi hazırlığı toplantısında gelecekteki salgınlara karşı ortak hareket etme taahhüdünü yeniledi. Dünya Sağlık Örgütü’nün açıklamasına göre odak; önleme, erken tespit, hızlı müdahale ve tıbbi ürünlere adil erişim.</p>

<h2>Siyasi taahhüt hangi alanları kapsıyor?</h2>

<p>Toplantıda görüşülen çerçeve, salgın başlamadan önce daha güçlü gözetim ve erken uyarı sistemleri kurulmasını; sağlık çalışanları ile temel hizmetlerin kriz sırasında ayakta tutulmasını amaçlıyor. Aşı, tanı testi ve tedavilerin yalnız yüksek gelirli ülkelere ulaşmaması da temel başlıklardan biri. Sürdürülebilir finansman, yerel ve bölgesel üretim kapasitesi ile insan, hayvan ve çevre sağlığını birlikte ele alan “Tek Sağlık” yaklaşımı da gündemde.</p>

<p>BM’nin toplantı sayfası, bu buluşmanın 2023’teki ilk üst düzey toplantıdan sonra ilerlemeyi değerlendirmek için yapıldığını doğruluyor. DSÖ ise aradan geçen dönemde Pandemi Anlaşması’nın kabulü, Uluslararası Sağlık Tüzüğü’nün güçlendirilmesi ve Pandemi Fonu gibi adımları sıralıyor. Buna rağmen son Ebola, mpox ve kolera salgınları, hazırlığın tamamlanmış bir iş olmadığını gösteriyor.</p>

<h2>Karar ile uygulama arasındaki fark</h2>

<p>Bu toplantı, her ülkede aynı gün yürürlüğe giren bağlayıcı bir sağlık programı anlamına gelmiyor. Siyasi bildiriler ortak yönü belirliyor; bütçe ayrılması, ulusal planların güncellenmesi, veri paylaşımı ve tedarik kapasitesi gibi somut sonuçlar ise ülkelerin sonraki uygulamalarına bağlı. DSÖ de finansman boşlukları ve tıbbi ürünlere eşitsiz erişim gibi sorunların sürdüğünü vurguluyor.</p>

<p>Gündelik yaşam açısından önemli soru, yeni bir salgında hastanelerin ne kadar hızlı bilgi ve kaynak paylaşabileceği. Erken uyarı verilerinin güvenilir olması, laboratuvar ağlarının işlemesi ve risk iletişiminin açık yürütülmesi, paniği azaltırken müdahale süresini kısaltabilir. Sağlık teknolojilerinin nasıl kullanılacağına dair başka bir örnek için <a href="/haber/iss-yapay-zeka-destekli-ultrason-deneyi">ISS’de yapay zekâ destekli ultrason çalışmasını</a> da okuyabilirsin.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler DSÖ’nün 25 Eylül 2026 tarihli <a href="https://www.who.int/news/item/25-09-2026-world-leaders-renew-commitment-to-protect-the-world-from-future-pandemics" target="_blank" rel="noopener noreferrer">toplantı açıklaması</a>, <a href="https://www.who.int/news-room/events/detail/2026/09/18/default-calendar/who-at-the-united-nations-general-assembly-2026" target="_blank" rel="noopener noreferrer">UNGA81 programı</a> ve <a href="https://www.un.org/pga/81/event/high-level-meeting-on-pandemic-prevention-preparedness-and-response/" target="_blank" rel="noopener noreferrer">BM Genel Kurulu toplantı sayfasıyla</a> karşılaştırılarak derlenmiştir. Kapak, Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek toplantı salonunu veya katılımcıları göstermez.</p>
    `,
  }),
  editorial({
    slug: "prima-uzay-teleskobu-evrenin-soguk-yuzunu-arayacak",
    title: "PRIMA Uzay Teleskobu Evrenin Soğuk ve Tozlu Yüzünü Arayacak",
    excerpt: "NASA’nın geliştirme aşamasına aldığı PRIMA, uzak kızılötesi gözlemlerle gezegenlerin, galaksilerin ve kara deliklerin oluşum tarihini araştırmayı hedefliyor.",
    category: "Bilim & Uzay",
    published_at: "2026-09-26T09:11:00+03:00",
    cover_image: "/editorial/2026-09-26/prima-uzay-teleskobu.webp",
    original_source_url: "https://www.nasa.gov/news-release/nasa-selects-far-infrared-telescope-as-first-in-new-mission-class/",
    content: `
<p>Evrenin bazı önemli bölgeleri görünür ışıkta parlak değil, yoğun tozun arkasında saklı. NASA, bu soğuk ve karanlık alanları uzak kızılötesi dalga boylarında incelemesi planlanan PRIMA uzay teleskobunu geliştirmede bir sonraki aşamaya taşıdı. “PRobe far-Infrared Mission for Astrophysics” adının kısaltması olan PRIMA, NASA’nın yeni Probe Explorers sınıfındaki ilk astrofizik görevi olacak.</p>

<h2>PRIMA neyi farklı görecek?</h2>

<p>Yaklaşık 1,8 metre çapındaki teleskop, James Webb Uzay Teleskobu’nun kızılötesi gözlemleri ile radyo teleskoplarının kapsadığı alan arasında kalan uzak kızılötesi bölgeyi tarayacak. Bu ışık, yıldız oluşum bölgelerindeki soğuk tozu, genç gezegen sistemlerini ve galaksilerin merkezindeki kara deliklerin çevresini incelemek için değerli. Bilim ekibi; ağır elementlerin zaman içinde nasıl biriktiğini, galaksiler ile kara deliklerin birlikte nasıl büyüdüğünü ve suyun gezegen sistemlerine hangi yollarla taşındığını araştırmayı hedefliyor.</p>

<p>NASA, görevi Phase B adı verilen ön tasarım ve teknoloji geliştirme aşamasına seçti. Bu karar, teleskobun kesin olarak üretime ve fırlatmaya hazır olduğu anlamına gelmiyor. Teknik, mali ve takvim performansı daha sonra yapılacak onay incelemesinde değerlendirilecek. Görev onaylanırsa proje maliyeti fırlatma dışındaki kalemler için 1,2 milyar dolarla sınırlandırılacak.</p>

<h2>2033 hedefi ve uluslararası ortaklık</h2>

<p>Planlanan fırlatma yılı 2033, temel görev süresi ise beş yıl. Proje NASA Jet Propulsion Laboratory tarafından yönetilecek. Fransa, İtalya, Almanya, Kanada, Güney Kore, Japonya ve Birleşik Krallık uzay kurumları da katkı sağlayacak. Bu ortaklık, teleskobun donanım ve bilim programının tek bir merkeze bağlı kalmadan geliştirilmesini amaçlıyor.</p>

<p>PRIMA’nın değeri yalnız daha keskin görüntüler üretmesinde değil, farklı gözlemevlerinin verilerini tamamlamasında yatıyor. Aynı gök cismini yakın kızılötesi, uzak kızılötesi ve radyo dalgalarında incelemek, yıldızlar ile gezegenlerin oluşum hikâyesini daha bütünlüklü kurabilir. Yakın gelecekteki başka bir görev için <a href="/haber/nasa-roman-uzay-teleskobu-firlatmaya-hazir">Nancy Grace Roman Uzay Teleskobu dosyasına</a> da göz atabilirsin.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA’nın 23 Eylül’de yayımlayıp 24 Eylül 2026’da güncellediği <a href="https://www.nasa.gov/news-release/nasa-selects-far-infrared-telescope-as-first-in-new-mission-class/" target="_blank" rel="noopener noreferrer">PRIMA görev duyurusundan</a> derlenmiştir. Kapak, Ugavole için üretilmiş temsili bir editoryal görseldir; teleskobun kesinleşmiş teknik görünümünü veya gerçek bir uzay fotoğrafını göstermez.</p>
    `,
  }),
  editorial({
    slug: "nisar-kamcatka-volkanini-uzaydan-adim-adim-izledi",
    title: "NISAR, Kamçatka’daki Volkanın Lav Akışını Uzaydan Adım Adım İzledi",
    excerpt: "NASA ile ISRO’nun NISAR uydusu, yaklaşık beş yüzyıl sonra yeniden faaliyete geçen Krasheninnikov volkanındaki değişimi radar görüntüleriyle kaydetti.",
    category: "Bilim & Uzay",
    published_at: "2026-09-26T09:10:00+03:00",
    cover_image: "/editorial/2026-09-26/nisar-kamcatka-volkani.webp",
    original_source_url: "https://www.jpl.nasa.gov/news/us-india-satellite-captures-time-lapse-video-of-volcanic-eruption/",
    content: `
<p>Rusya’nın Kamçatka Yarımadası’ndaki Krasheninnikov volkanı, yaklaşık beş yüzyıllık sessizliğin ardından 2025 yazında yeniden faaliyete geçti. NASA ile Hindistan Uzay Araştırma Örgütü’nün ortak NISAR uydusu, volkanın kuzey kraterinden yayılan lav alanını aylar boyunca aynı yörünge noktalarından izledi. NASA Jet Propulsion Laboratory, 17 radar karesinin birleştirilmesiyle oluşan zaman dizisini 24 Eylül’de yayımladı.</p>

<h2>Bulutların arkasındaki değişim nasıl görüldü?</h2>

<p>NISAR, optik bir fotoğraf makinesi gibi yalnız görünür ışığa bağlı değil. Sentetik açıklıklı radar sistemi, yeryüzüne mikrodalga darbeleri gönderip yüzeyden dönen sinyalleri ölçüyor. Bu sayede gece veya bulutlu hava gibi koşullarda da yüzey değişimleri izlenebiliyor. Görüntülerde yeni ve pürüzlü lav alanı, çevredeki kar ya da çıplak zeminden daha parlak görünüyor.</p>

<p>Uydu ilk görüntüyü 25 Aralık 2025’te, yörünge sonrası kontrollerini tamamlarken aldı. Ardından her 12 günde iki kez, farklı geçiş yönlerinde aynı bölgeyi taradı. Ağustos ortasına kadar seçilen 17 kare; lavın önce küçük iç kalderayı doldurmasını, daha geniş kratere taşmasını ve doğuya doğru yelpaze biçiminde yayılmasını gösteriyor.</p>

<h2>On metrelik karelerle tehlike takibi</h2>

<p>Bu zaman dizisindeki her piksel, yüzeyde yaklaşık 10’a 10 metrelik bir alanı temsil ediyor. Düzenli tekrar ve yüksek çözünürlük, uzak bölgelerdeki volkan, heyelan, deprem kaynaklı deformasyon veya buz hareketi gibi olayların gelişimini karşılaştırmalı olarak incelemeyi kolaylaştırıyor. JPL, NISAR’ın deniz seviyesinin üzerindeki yaklaşık 1.300 aktif volkan için geniş kapsamlı veri üretebileceğini belirtiyor.</p>

<p>Görüntüler doğrudan bir tahliye kararı ya da tek başına erken uyarı sistemi değildir. Yer sensörleri, sismik ölçümler ve yerel kurumların değerlendirmeleriyle birlikte kullanıldığında bilimsel izleme ve olası acil durum müdahalesine destek sağlayabilir. Dünya gözlem uydularının başka bir kullanımını görmek için <a href="/haber/nasa-aqua-uydusu-a81-d33b-buzdaglari">A81 ve D33B buzdağlarının izlenmesine</a> de bakabilirsin.</p>

<h2>İki radarın tamamlayıcı gücü</h2>

<p>NISAR, serbest uçan bir uzay görevinde iki farklı radar dalga boyunu birlikte taşıyan ilk uydu. NASA’nın sağladığı L-band radar, uzun dalga boyu sayesinde bitki örtüsünün altındaki zemini gözlemleyebilir. ISRO’nun sağladığı S-band ise bitki örtüsü ve yüzey yapısı hakkında tamamlayıcı veri topluyor. On iki metre genişliğindeki ağ reflektör, NASA’nın uzaya gönderdiği en büyük radar anteni olma özelliğini taşıyor.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA JPL’nin 24 Eylül 2026 tarihli <a href="https://www.jpl.nasa.gov/news/us-india-satellite-captures-time-lapse-video-of-volcanic-eruption/" target="_blank" rel="noopener noreferrer">NISAR volkan gözlemi açıklamasından</a> derlenmiştir. Kapak, Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek NISAR görüntüsünü, uydunun birebir tasarımını veya güncel saha koşullarını göstermez.</p>
    `,
  }),
  editorial({
    slug: "iss-yapay-zeka-destekli-ultrason-deneyi",
    title: "ISS’de Yapay Zekâ Destekli Ultrason: Doktor Uzakken Muayene Nasıl Yapılacak?",
    excerpt: "NASA’nın EchoFinder-2 çalışması, artırılmış gerçeklik ve yapay zekâ yardımıyla astronotların uzayda ultrason taraması yapabilmesini araştırıyor.",
    category: "Bilim & Uzay",
    published_at: "2026-09-25T09:12:00+03:00",
    cover_image: "/editorial/2026-09-25/iss-ai-ultrason.webp",
    original_source_url: "https://www.nasa.gov/blogs/spacestation/2026/09/24/advanced-health-tech-research-continues-to-protect-astronaut-health/",
    content: `
<p>Uluslararası Uzay İstasyonu’nda bir ultrason muayenesi yapmak, Dünya’daki hastanede aynı işlemi uygulamaktan daha zor. Uzay aracında her an bir uzman bulunmuyor; iletişim gecikmeleri ise Ay’ın ötesindeki görevlerde uzaktan yönlendirmeyi daha da sınırlayabilir. NASA’nın 24 Eylül tarihli istasyon günlüğü, bu soruna odaklanan EchoFinder-2 çalışmasının yeni uygulamasını aktarıyor.</p>

<h2>Tablet, artırılmış gerçeklik ve yapay zekâ birlikte çalışıyor</h2>

<p>NASA astronotları Jessica Meir ile Jack Hathaway, Columbus laboratuvarında sırayla birbirlerinin organlarını ultrasonla taradı. Yerdeki bir teknisyen süreci gerçek zamanlı izledi. Sistemde bir tablet, artırılmış gerçeklik ve yapay zekâ kullanılarak probun doğru noktaya ve açıya getirilmesi hedefleniyor. Yazılım daha sonra organların bulunmasına ve görüntülenmesine yardımcı oluyor.</p>

<p>Çalışmanın amacı bir doktorun tanısını otomatik olarak vermek değil. Araştırmacılar, gelecekte mürettebatın Dünya’dan sürekli uzman yönlendirmesi alamadığı koşullarda tıbbi görüntüleme aracını daha bağımsız kullanıp kullanamayacağını test ediyor. NASA sonuçların, daha uzak görevlere giden ekiplerin sağlık takibine katkı sağlayabileceğini belirtiyor; çalışma henüz günlük klinik kullanım için kesinleşmiş bir ürün anlamına gelmiyor.</p>

<h2>Uzayda sağlık takibi tek bir cihazla sınırlı değil</h2>

<p>Aynı gün mürettebat bağışıklık sistemi araştırması için kan örneklerini işledi. Örnekler santrifüjde bileşenlerine ayrıldı ve daha sonra incelenmek üzere bilim dondurucusuna yerleştirildi. ESA astronotu Sophie Adenot ise egzersiz sırasında tansiyon, kalp atışı ve solunumu izleyen sensörlü Bio-Monitor yeleği ile başlığını kullandı.</p>

<p>Bu üç çalışma aynı sorunun farklı parçalarına bakıyor: İnsan bedeni mikro yerçekimine nasıl uyum sağlıyor ve değişimler sınırlı ekipmanla nasıl izlenebilir? Ultrason görüntüsü iç organları, kan örnekleri bağışıklık yanıtını, giyilebilir sensörler ise egzersiz sırasındaki fizyolojiyi takip ediyor.</p>

<p>Uzay sağlığı araştırmaları Dünya’daki tıbbi kararların yerine geçmez ve bu haber kişisel sağlık önerisi değildir. Yaşamın sıra dışı koşullara uyumuna başka bir açıdan bakmak için <a href="/haber/63-derecede-cogalabilen-ates-amibi-yasamin-sinirlari">63°C’de çoğalabilen ateş amibi araştırmasını</a> da okuyabilirsin.</p>

<p>Deneyin bir sonraki aşamasında sistemin farklı kullanıcılar ve görev koşullarında ne kadar tutarlı çalıştığı, NASA’nın paylaşacağı sonuçlarla daha net anlaşılacak.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler NASA’nın 24 Eylül 2026 tarihli <a href="https://www.nasa.gov/blogs/spacestation/2026/09/24/advanced-health-tech-research-continues-to-protect-astronaut-health/" target="_blank" rel="noopener noreferrer">ISS görev günlüğünden</a> derlenmiştir. Kapak, Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek mürettebatı, gerçek muayeneyi veya NASA fotoğrafını göstermez.</p>
    `,
  }),
  editorial({
    slug: "yapay-zeka-bilim-kulturunun-yerini-alabilir-mi",
    title: "Yapay Zekâ Bilim Kültürünün Yerini Alabilir mi? UCL’den Denge Çağrısı",
    excerpt: "UCL ve Goethe Üniversitesi araştırmacıları, yapay zekânın bilim insanlarının merakı, deneyimi ve beklenmedik bulguları değerlendirme gücüyle birlikte kullanılmasını savunuyor.",
    category: "Teknoloji",
    published_at: "2026-09-25T09:11:00+03:00",
    cover_image: "/editorial/2026-09-25/yapay-zeka-bilim-kulturu.webp",
    original_source_url: "https://www.ucl.ac.uk/news/2026/sep/ai-must-be-integrated-scientific-research-culture",
    content: `
<p>Yapay zekâ büyük veri kümelerinde örüntü bulabilir, olası hipotezleri sıralayabilir ve araştırmacıların dikkatini umut verici sonuçlara yöneltebilir. Peki bu hız, laboratuvarda yıllar içinde oluşan sezgi ve merakın yerini tutar mı? University College London’dan Henning Walczak ile Goethe Üniversitesi’nden Ivan Dikic, 24 Eylül’de duyurulan yorum yazılarında asıl hedefin insan araştırmacıyı değiştirmek değil, iki yeteneği aynı bilim kültüründe buluşturmak olması gerektiğini savunuyor.</p>

<h2>Beklenmedik bulgular neden önemli?</h2>

<p>Yazarların temel itirazı yapay zekânın kullanımına değil, araştırma ekiplerinin yalnız tahmin ve verimlilik mantığıyla yeniden kurulmasına. Bilimsel atılımların bir bölümü, önceden planlanan sonucun dışında kalan gözlemlerden doğuyor. Deneyimli bilim insanları başarısız deneyleri, yayımlanmamış gözlemleri ve biyolojik olarak neyin makul olduğuna dair yıllar içinde oluşan yargıyı da kararlarına katıyor.</p>

<p>Bu tür bilgi her zaman düzenli bir veri tabanına girmiyor. Dolayısıyla modelin göremediği bir deney geçmişi, laboratuvarın en değerli kaynaklarından biri olabilir. Yazarlar buna insanın merak, yaratıcılık, deneysel içgörü ve bilimsel yargı kapasitesini vurgulayan “doğal zekâ” çerçevesiyle yaklaşıyor.</p>

<h2>AlphaFold örneği ne anlatıyor?</h2>

<p>UCL’nin açıklamasında AlphaFold önemli bir örnek olarak veriliyor. Yapay zekâ, protein yapılarını tahmin etme alanında büyük bir sıçrama sağladı. Ancak bu başarı, Protein Data Bank’te onlarca yıl boyunca biriktirilen deneysel yapı verileri olmadan mümkün olmayacaktı. Başka bir ifadeyle güçlü model ile sabırlı laboratuvar emeği birbirinin alternatifi değil; aynı keşif zincirinin parçaları.</p>

<p>Bu metin yeni bir deney sonucu değil, iki bilim insanının <em>Nature Cell Biology</em> için kaleme aldığı görüş yazısına dayanıyor. Bu nedenle “yapay zekâ bilimi zayıflatır” şeklinde kesin bir kanıt olarak okunmamalı. Önerilen yaklaşım, kurumların araç yatırımı yaparken deneysel uzmanlığı, disiplinler arası karşılaşmaları ve merak odaklı temel araştırmayı da koruması.</p>

<p>Bilimin farklı alanlarla temas ettiği bir örnek için <a href="/haber/lefkosada-european-researchers-night-2026-bilim-rotasi">Lefkoşa’daki European Researchers’ Night bilim rotasına</a> da göz atabilirsin.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler UCL’nin 24 Eylül 2026 tarihli <a href="https://www.ucl.ac.uk/news/2026/sep/ai-must-be-integrated-scientific-research-culture" target="_blank" rel="noopener noreferrer">“AI must be integrated into scientific research culture”</a> açıklamasından derlenmiştir. Kapak, Ugavole için üretilmiş temsili bir editoryal görseldir; gerçek bir laboratuvarı, kişileri veya araştırma sonucunu belgelememektedir.</p>
    `,
  }),
  editorial({
    slug: "fotografik-hafiza-50-yillik-portre-koleksiyonu",
    title: "Fotoğrafik Hafıza: 50 Yıllık Portre Koleksiyonu Bir Tarihi Nasıl Anlatıyor?",
    excerpt: "Smithsonian Ulusal Portre Galerisi, fotoğraf koleksiyonunun 50. yılını 120’den fazla eserle kutlayan yeni sergisini duyurdu.",
    category: "Kültür",
    published_at: "2026-09-25T09:10:00+03:00",
    cover_image: "/editorial/2026-09-25/fotografik-hafiza-sergisi.webp",
    original_source_url: "https://www.si.edu/newsdesk/releases/national-portrait-gallery-announces-photographic-memory-fifty-years-collecting",
    content: `
<p>Bir müzenin portre koleksiyonu yalnız yüzleri değil, kimin tarihte görünür kaldığını da anlatır. Smithsonian Ulusal Portre Galerisi, fotoğraf koleksiyonunun 50. yılını “Photographic Memory: Fifty Years of Collecting” sergisiyle kutlayacağını 24 Eylül’de duyurdu. Washington’daki sergide 120’den fazla fotoğrafik portre yer alacak.</p>

<h2>Dagereotipten dijital çağa</h2>

<p>Sergi 14 Kasım 2026’da açılacak ve 7 Kasım 2027’ye kadar görülebilecek. Eserler 1843’ten günümüze uzanan kronolojik bir düzende sunulacak. Girişteki zaman çizelgesi, dagereotip gibi erken tekniklerden çağdaş dijital üretime kadar fotoğraf süreçlerinin nasıl değiştiğini gösterecek.</p>

<p>Galerinin fotoğraf toplamaya resmen başladığı 1976’dan önce, tarihsel kişiliklerin bir bölümünü koleksiyona katmak zordu; çünkü herkes için yapılmış bir resim ya da heykel bulunmuyordu. Fotoğraf, farklı mesleklerden ve topluluklardan kişilerin portre koleksiyonunda temsil edilme alanını genişletti. Kuruma göre fotoğraflar artık müzenin toplam varlığının yaklaşık yarısını oluşturuyor.</p>

<h2>Kamera önündeki ve arkasındaki kişi</h2>

<p>Duyuruda 1846 civarına tarihlenen Dolley Madison dagereotipi, Abraham Lincoln’ün “çatlak plaka” portresi ve Ida B. Wells-Barnett’in nadir kabine kartları gibi örnekler anılıyor. Yirminci ve yirmi birinci yüzyıl bölümünde ise sanatçı, yazar, müzisyen, aktivist ve sporcuların portreleri bulunuyor.</p>

<p>Bu seçkiyi yalnız “ünlü yüzler” listesi olarak okumamak gerekiyor. Serginin vurgularından biri, fotoğrafı çeken kişinin de görüntünün anlamını kurması. Işık, kadraj, poz ve baskı tekniği; portredeki kişinin nasıl hatırlanacağını etkiliyor. Sergi bu nedenle hem kamera önündeki kişileri hem de fotoğrafçıların görsel dilini ele alıyor.</p>

<p>Sergi, Amerikan tarihine odaklanan bir kurumun koleksiyonundan hazırlanıyor; dolayısıyla bütün dünya fotoğraf tarihini kapsadığı iddiasını taşımıyor. Açılış tarihi de henüz gelmediği için bu yazı bir sergi eleştirisi değil, kurumun açıkladığı programın ön izlemesi. Dijital sergi deneyimlerine ilgi duyanlar <a href="/haber/dusler-zamani-japonya-sergisi-27-eylul-2026">Düşler Zamanı: Japonya sergisi rehberini</a> de okuyabilir.</p>

<p>Ziyaret etmeyi planlayanların açılış yaklaşırken eser listesi, günlük saatler ve erişim koşulları için müzenin güncel sayfasını yeniden kontrol etmesi gerekiyor.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bilgiler Smithsonian’ın 24 Eylül 2026 tarihli <a href="https://www.si.edu/newsdesk/releases/national-portrait-gallery-announces-photographic-memory-fifty-years-collecting" target="_blank" rel="noopener noreferrer">sergi duyurusu</a> ile Ulusal Portre Galerisi’nin <a href="https://npg.si.edu/exhibition/photographic-memory-fifty-years-collecting" target="_blank" rel="noopener noreferrer">sergi sayfasından</a> derlenmiştir. Kapak, Ugavole için üretilmiş temsili bir editoryal görseldir; sergideki gerçek portreleri veya galeri salonunu göstermemektedir.</p>
    `,
  }),
  editorial({
    slug: "girnede-yagmur-suyu-altyapisi-icin-uc-noktali-plan",
    title: "Girne’de Yağmur Suyu Altyapısı İçin Üç Noktalı Plan Açıklandı",
    excerpt: "Girne Belediyesi, Prestij ve Lemon Park çevresindeki su baskınlarını azaltmak için kutu menfez, yağmur suyu hattı ve menfez yenilemesini kapsayan bir plan açıkladı.",
    category: "Gündem",
    published_at: "2026-09-24T09:16:00+03:00",
    cover_image: "/editorial/2026-09-24/girne-yagmur-suyu-altyapisi.webp",
    original_source_url: "https://www.girnebelediyesi.com/girnede-su-baskinlarina-karsi-altyapi-calismalari-suruyor/",
    content: `
<p>Girne Belediyesi, Prestij ve Lemon Park sitelerinin bulunduğu çevrede yıllardır yaşanan su baskınlarını azaltmayı hedefleyen altyapı çalışmaları için yeni bir yol haritası açıkladı. Belediyenin 23 Eylül 2026 tarihli duyurusunda, tek bir noktaya odaklanan geçici bir müdahale yerine birbirini tamamlayan üç iş kalemi yer alıyor: mevcut kutu menfezin devamı, yağmur suyu hattının deniz tarafına ulaştırılması ve Sanayi Bölgesi çıkışındaki menfezin yenilenmesi.</p>

<p>Açıklama, bölgede işlerin tamamlandığını değil, çalışmaların başladığını ve bazı adımların planlandığını gösteriyor. Bu ayrım önemli: Yağmur suyu altyapısında etki, ancak kanal, hat ve menfezler birlikte işlediğinde görülebilir. Belediyenin verdiği bilgiler, mahalle sakinleri için hangi alanda neyin hedeflendiğini daha anlaşılır kılıyor.</p>

<h2>Prestij ve Lemon Park çevresinde kutu menfez devam edecek</h2>

<p>Belediyeye göre bölgede daha önce belirli bir noktaya kadar yapılmış, fakat devamı getirilmemiş kutu menfez kanalının çalışmasına yeniden başlandı. Amaç, iki site çevresindeki yağmur suyunun daha düzenli taşınması. Belediye Başkanı Murat Şenkul, kanalın yaklaşık bir ay içinde bitirilmesini hedeflediklerini açıkladı. Bu, açıklanan hedef süredir; kesin bir tamamlanma tarihi ya da çalışmanın ardından taşkın riskinin tamamen ortadan kalkacağı yönünde bir garanti paylaşılmadı.</p>

<h2>GAÜ Kavşağı’nda hattın denize uzatılması planlanıyor</h2>

<p>İkinci başlık, Girne Amerikan Üniversitesi Kavşağı çevresindeki 1000’lik yağmur suyu hattı. Duyuruya göre hat kavşağın güneyine kadar geliyor, ancak yolun kuzeyine geçip deniz tarafına ulaşmıyor. Belediye, yolun kesilerek hattın denize bağlanmasını planlıyor. Bu adımın hedefi, yağış sularının güvenli biçimde denize yönlendirilmesi. Kaynakta yol kapanışı, çalışma günleri veya geçici trafik düzeniyle ilgili ayrıntı bulunmadığı için bu konularda belediyenin yeni duyurularını izlemek gerekiyor.</p>

<h2>Sanayi Bölgesi çıkışındaki menfez yeniden yapılacak</h2>

<p>Üçüncü çalışma, Sanayi Bölgesi çıkışındaki mevcut yağmur suyu menfezi. Belediye, yol yenilemesi sırasında kapasitesi artırılmayan bu yapının ana yolda yağmur suyu birikmesine yol açtığını belirtiyor. Menfezin yeniden yapılması planlanıyor. Altyapı işlerinin ardından ilgili bölgelerde asfalt yenilemesi de gündemde. Ayrıca GAÜ Kavşağı’nda trafik ve yaya güvenliği için kameralı trafik ışıkları kurulması planlanıyor; bu da henüz tamamlanmış bir uygulama değil.</p>

<h2>Bu üç çalışma neden birlikte okunmalı?</h2>

<p>Kutu menfez kanalı, yağmur suyu hattı ve yol altındaki menfez aynı yağışın farklı noktalardaki akışını ilgilendiriyor. Belediye bunları kapsamlı bir altyapı düzenlemesinin parçaları olarak duyurdu; ancak kapasite hesabı, proje bütçesi, yüklenici, şantiye programı ya da denetim takvimi paylaşmadı. Bu nedenle açıklamayı, uygulanmış bir sonuç raporu değil, hedefleri ve çalışma alanlarını gösteren güncel bir durum notu olarak okumak daha doğru.</p>

<h2>Mahalle ölçeğinde takip edilecek notlar</h2>

<p>Yağışlı günlerde bu üç bölgeyi kullananlar için en sağlıklı yaklaşım, çalışma hedefini anlık yol durumu gibi okumamak. Resmî açıklama; çalışmaların kapsamını anlatıyor, fakat alternatif güzergâh, günlük şantiye programı ya da trafik akışı hakkında bilgi vermiyor. Güncel saha bilgisi gerektiğinde belediyenin sonraki bildirimleri esas alınmalı. Girne’nin gündelik temposuna başka bir açıdan bakmak isteyenler, <a href="https://ugavole.com/haber/girnede-kalabaliktan-uzak-bir-gun">Girne’de Kalabalıktan Uzak Bir Gün</a> rehberine de göz atabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Bu yazı, <a href="https://www.girnebelediyesi.com/girnede-su-baskinlarina-karsi-altyapi-calismalari-suruyor/">Girne Belediyesi’nin 23 Eylül 2026 tarihli açıklamasına</a> dayanır. Duyuruda yer almayan yol kapanışı, günlük çalışma takvimi, kesin bitiş tarihi veya taşkın sorununun tamamen çözüleceği iddiası eklenmemiştir. Kapak görseli Ugavole için hazırlanacak temsili bir editoryal görseldir; şantiyenin güncel durumunu ya da belediyenin resmî fotoğrafını göstermez.</p>
    `,
  }),
  editorial({
    slug: "lefkosada-european-researchers-night-2026-bilim-rotasi",
    title: "Lefkoşa’da European Researchers’ Night 2026: Bilim ve Keşif Rotası",
    excerpt: "European Researchers’ Night 2026, 25 Eylül’de Lefkoşa’daki Kıbrıs Devlet Fuarı A ve B salonlarında 80’den fazla etkileşimli bilim etkinliğiyle düzenlenecek.",
    category: "Bilim & Uzay",
    published_at: "2026-09-24T09:15:00+03:00",
    cover_image: "/editorial/2026-09-24/lefkosada-researchers-night.webp",
    original_source_url: "https://erncyprus.com/",
    content: `
<p>European Researchers’ Night 2026, 25 Eylül 2026 Cuma günü Lefkoşa’daki Kıbrıs Devlet Fuarı’nın A ve B salonlarında yapılacak. Kıbrıs Araştırma ve İnovasyon Vakfı tarafından düzenlenen etkinlik, araştırmayı laboratuvar diliyle sınırlamak yerine ziyaretçilerin deney, oyun, gösterim ve kısa atölyelerle temas edebileceği bir buluşma olarak kurgulanıyor.</p>

<p>Bu yılın teması “CELEBRATE 2.0 – Two Decades of STEAM-Powered Inspiration”. STEAM; bilim, teknoloji, mühendislik, sanat ve matematiği aynı öğrenme alanında buluşturan yaklaşımı ifade ediyor. Etkinliğin resmî sayfası, 80’den fazla etkileşimli faaliyetten söz ediyor; bunlar arasında deneyler, canlı gösterimler, atölyeler, sunumlar ve yarışmalar bulunuyor.</p>

<h2>Bir akşamda tek konuya sıkışmayan bilim rotası</h2>

<p>Etkinliğin gücü, ziyaretçiye yalnızca hazır bilgiyi sunmak yerine farklı alanlar arasında dolaşma imkânı vermesinde. Araştırma ve inovasyon sergisinde biyoteknolojiden kültürel mirasa, iklim ve biyolojik çeşitlilikten yapay zekâya uzanan çok sayıda başlık yer alıyor. Örneğin sergi programında çocuklar için bilim hazine avı, mikroskop ve örneklerle biyolojik çeşitlilik çalışmaları, üç boyutlu kültür mirası modellemeleri ve DNA’yı anlatan uygulamalar bulunuyor.</p>

<p>Çocuklar için duyurulan bilim hazine avı, 15 yaşa kadar olan katılımcılara yönelik. Resmî sergi sayfasında başlangıç noktası Avrupa Köşesi ile A ve B salonlarının dış alanı olarak belirtiliyor; iki etkinlik saati de 10.00 ve 17.30. Bu saatler hazine avına ait. Etkinliğin genel açılış veya kapanış saati olarak yorumlanmamalı.</p>

<h2>KIOS standında enerji, su, ulaşım ve siber güvenlik</h2>

<p>Kıbrıs Üniversitesi KIOS Araştırma ve İnovasyon Mükemmeliyet Merkezi, A Salonu Mühendislik Bölgesi’ndeki 37 numaralı stantta yer alacak. KIOS’un duyurusuna göre burada yenilenebilir enerji teknolojileri ve güç sistemleri, akıllı su sistemleri, akıllı ulaşım sistemleri ve siber güvenlik üzerine etkileşimli etkinlikler ile oyunlar sunulacak.</p>

<p>Standın iki somut deneyimi de özellikle dikkat çekiyor. HEPHAESTUS, ziyaretçiyi kritik altyapıları etkileyen bir orman yangınında karar verici rolüne yerleştiren etkileşimli bir deneyim. GuardAI ise yapay zekâ sistemlerinin bazen beklenmedik biçimlerde yanıltılabildiğini gösteren ayrı bir demo. Bu iki örnek, bilimsel çalışmanın yalnızca gelecekteki teknolojiyle değil; enerji, su, ulaşım ve dijital güvenlik gibi gündelik başlıklarla da ilişkili olduğunu görünür kılıyor.</p>

<h2>Kısa bir ziyaret için rota nasıl kurulabilir?</h2>

<p>Etkinliğin resmî sergi listesi çok farklı temaları aynı çatı altında topluyor. Bu yüzden herkesi tek bir programa yönlendirmek yerine, ilgi alanından başlamak daha anlamlı: doğa ve miras meraklıları biyolojik çeşitlilik ile üç boyutlu belgeleme çalışmalarına; teknoloji meraklıları enerji, akıllı su, ulaşım ve siber güvenlik stantlarına; küçük ziyaretçiler ise kendi yaş grubuna duyurulan hazine avına bakabilir. Stantlardaki yoğunluk, tüm içeriğin aynı anda açık olup olmayacağı veya etkinliklerin süresi kaynakta garanti edilmiyor.</p>

<h2>Gitmeden önce neyi kontrol etmek gerekir?</h2>

<p>Resmî program, Araştırma ve İnovasyon Sergisi’nin halka 15.00–22.00 arasında açık olduğunu belirtiyor. Aynı programdaki 08.00–13.00 aralığı planlı okul ziyaretlerine ayrılmış; bu nedenle sabah saatini genel ziyaretçi açılışı gibi okumamak gerekiyor. Avrupa Köşesi ise 08.00–22.00 arasında programlanmış. Avrupa Komisyonu’nun European Researchers’ Night bilgi sayfası, etkinliklerin ücretsiz ve halka açık olduğunu ifade ediyor. Buna karşın Kıbrıs organizatörünün sayfasında özel kayıt, istisna ya da erişim koşulları ayrıntılandırılmadığı için, hareket etmeden önce <a href="https://erncyprus.com/">organizasyonun güncel sayfasını</a> ve <a href="https://erncyprus.com/wp-content/uploads/2026/09/ERN-2026_-Πρόγραμμα.pdf">resmî programı</a> kontrol etmek en güvenli yol. Bilim gündemini ekranda sürdürmek isteyenler için, Ugavole’nin <a href="https://ugavole.com/haber/perseverance-marsta-uc-ayri-su-etkilesimi">Perseverance’ın Mars’taki su izleri</a> dosyası da iyi bir devam okuması olabilir.</p>

<h2>Kaynak ve görsel notu</h2>

<p>Etkinliğin tarih, yer, tema ve 80’den fazla faaliyet bilgisi <a href="https://erncyprus.com/">European Researchers’ Night Cyprus resmî sayfasından</a>; halka açık 15.00–22.00 sergi aralığı <a href="https://erncyprus.com/wp-content/uploads/2026/09/ERN-2026_-Πρόγραμμα.pdf">resmî programdan</a>; ücretsiz ve halka açık olma bilgisi ise <a href="https://marie-sklodowska-curie-actions.ec.europa.eu/european-researchers-night/general-public-information">Avrupa Komisyonu’nun ERN bilgi sayfasından</a> doğrulandı. KIOS’un 37 numaralı standı ve içerikleri <a href="https://www.kios.ucy.ac.cy/kios-invites-the-public-to-explore-play-and-discover-at-researchers-night-2026/">KIOS’un 18 Eylül 2026 tarihli duyurusuna</a> dayanır. Kapak görseli Ugavole için hazırlanacak temsili bir editoryal görseldir; fuar alanını, katılımcıları veya resmî etkinlik fotoğrafını göstermez.</p>
    `,
  }),
  editorial({
    slug: "yassitepe-bes-bin-yillik-zeytin-cekirdekleri-2026",
    title: "Yassıtepe’de 5 Bin Yıllık Zeytin Çekirdekleri: Ege’nin Üretim Geçmişinden Yeni İzler",
    excerpt: "2026 kazılarında bulunan zeytin çekirdekleri ve iki silindir mühür, Bornova’daki tarih öncesi yerleşimin tarım ve ticaret hayatına yeni sorular ekliyor.",
    category: "Kültür",
    published_at: "2026-09-24T09:14:00+03:00",
    cover_image: "/editorial/2026-09-24/yassitepe-zeytin-cekirdekleri.webp",
    original_source_url: "https://izmir.bel.tr/tr/Haberler/%E2%80%8Bizmir-in-troya-si-yassitepe-den-zenginligin-izleri-cikti/59444/156",
    content: `
<p>İzmir’in Bornova ilçesindeki Yassıtepe Höyüğü’nde, 2026 kazı sezonunda yaklaşık 5 bin yıl öncesine tarihlenen zeytin çekirdekleri bulundu. İzmir Büyükşehir Belediyesinin 22 Eylül 2026 tarihli açıklaması, gündelik bir yiyeceğin kalıntısından hareketle Ege’de üretim, saklama ve ticaretin geçmişine bakma fırsatı sunuyor.</p>
<h2>Yeni sezondan iki buluntu</h2>
<p>Kazı başkanı Doç. Dr. Zafer Derin’in değerlendirmelerinin aktarıldığı açıklamaya göre yerleşimde daha önce üzüm ve incir izlerine de ulaşılmıştı. Zeytin çekirdekleri bu tarımsal tabloya ekleniyor. Aynı sezon bir mezarda bulunan iki silindir mühür ise yerleşimin ticari ve sosyal ilişkilerini araştırmak için başka bir ipucu oluşturuyor.</p>
<p>Açıklamada büyük depolama kapları, üretim alanları ve bronz işçiliği de anlatılıyor. Bunlar, Derin’in Yassıtepe’yi planlı bir kent olarak değerlendirmesinin parçaları. Ancak haberin yayımlandığı gün, buluntuların topraktan çıkarıldığı gün değil; kurum kesin keşif tarihlerini vermiyor. Zeytinlerin nerede yetiştirildiği ve hangi işlemlerden geçirildiği konusunda da bu duyurudan kesin sonuç çıkarmak mümkün değil.</p>
<h2>Bornova’nın altında biriken zaman</h2>
<p>Kazı projesinin Ege Üniversitesi bünyesindeki genel bilgi sayfası, Yassıtepe’yi Ege Üniversitesi Hastanesinin güneyinde, Manda Deresi’nin kuzeyindeki bir höyük olarak tanımlıyor. Çevresinde biriken alüvyonlar, yerleşimin arazide olduğundan daha alçak görünmesine yol açmış. Bu yüzden bir höyüğün bugünkü dış görünüşü, içerdiği geçmişin büyüklüğünü tek başına anlatmıyor.</p>
<p>Aynı proje kaydına göre Yassıtepe’deki erken kazılar, Yeşilova programı kapsamında 2010’da başladı. Roma, Tunç Çağı, Kalkolitik ve Neolitik dönemlerle ilişkilendirilen katmanlar, alanın tek bir zamanda oluşmadığını gösteriyor. Erken Tunç Çağı tabakalarından alınan radyokarbon sonuçları da MÖ üçüncü binyılın başlangıcına uzanıyor. Buradaki kronolojik arka planı, 2026’da duyurulan her nesnenin ayrı ayrı tarihlendirmesiyle karıştırmamak gerekiyor.</p>
<h2>Yeşilova ile Yassıtepe neden birlikte anılıyor?</h2>
<p>Zafer Derin’in 2023’te Höyük dergisinde yayımlanan çalışması, Yeşilova, Yassıtepe ve İpeklikuyu’yu İzmir’in tarih öncesi yerleşim alanındaki üç merkez olarak ele alıyor. Çalışmanın odağı özellikle Yeşilova’nın Geç Neolitik mimarisi. Bu araştırma, komşu alanları aynı haritada görmeyi sağlıyor; farklı dönemlerin buluntularını tek bir yerleşimin kesintisiz hikâyesiymiş gibi okumamak için de yararlı bir çerçeve sunuyor.</p>
<p>Makalede kıyı çizgisindeki değişimler ve akarsuların taşıdığı birikintiler, bölgedeki eski yerleşimlerin neden toprak altında kaldığını açıklayan etkenler arasında. Yeşilova’da yapılardan alınan yanmış ağaç örneklerinin tarihlendirilmesi, mimari kalıntılarla birlikte değerlendiriliyor. Dolayısıyla arkeolojik zaman çizelgesi yalnız bir nesnenin görünüşünden değil, bulunduğu tabaka ve başka kanıtlardan da kuruluyor.</p>
<p>Komşu Yeşilova’daki gündelik hayatın izleri arasında evler kadar ortak avlular da yer tutuyor. Kazı projesinin kayıtlarında öğütme taşları, küçük ocaklar ve üretim alanları anlatılıyor. Böyle ayrıntılar, geçmişi yalnız büyük yapılarla tanımamıza gerek olmadığını hatırlatıyor: bir ailenin besin hazırladığı yer de yerleşimin düzenini anlamak için değerli olabilir.</p>
<h2>Sofradaki tanıdık ürüne başka gözle bakmak</h2>
<p>Kıbrıs okuru için zeytin uzak bir ayrıntı değil. <a href="https://ugavole.com/haber/kibris-kahvaltisi-sofrasinda-ne-var">Kıbrıs kahvaltısının zeytin ve çakıstes etrafında kurulan sofrası</a>, bu haberi gündelik hayatla ilişkilendiren bir başlangıç olabilir. Yine de tanıdık bir ürün görmek, iki yer arasında doğrudan tarihsel bağlantı bulunduğu anlamına gelmez. Yassıtepe bulguları kendi kazı bağlamında değerlendirilmelidir.</p>
<p>Bir çekirdeğe bakarken yalnız ne yenildiğini değil, ürünün nasıl saklandığını ve nasıl paylaşıldığını da merak edebiliriz. Bu soruların her birinin yanıtı farklı kanıt ister. Yeni açıklamanın değeri, bütün soruları kapatmasından çok, geçmişin gündelik hayatını daha dikkatli okumaya davet etmesinde.</p>
<h2>Kaynaklar ve görsel notu</h2>
<p><a href="https://izmir.bel.tr/tr/Haberler/%E2%80%8Bizmir-in-troya-si-yassitepe-den-zenginligin-izleri-cikti/59444/156" target="_blank" rel="noopener noreferrer">İzmir Büyükşehir Belediyesi, 22 Eylül 2026</a>; <a href="https://yesilova.ege.edu.tr/genel-bilgi.html" target="_blank" rel="noopener noreferrer">Ege Üniversitesi kazı projesi: genel bilgi</a>; <a href="https://hoyuk.gov.tr/tam-metin/90/tur" target="_blank" rel="noopener noreferrer">Zafer Derin, Höyük, 2023</a>. Kaynaklar 24 Eylül 2026’da kontrol edildi. Kapak görseli temsili bir illüstrasyondur; kazı alanının veya bulunan çekirdeklerin belgesel fotoğrafı değildir.</p>
    `,
  }),
  editorial({
    slug: "dusler-zamani-japonya-sergisi-27-eylul-2026",
    title: "Düşler Zamanı: Japonya Sergisi 27 Eylül 2026’ya Uzatıldı",
    excerpt: "İstanbul Dijital Deneyim Merkezi’ndeki sergi, Japon sanatını hareketli görüntüler ve etkileşimli alanlarla buluşturuyor. Son ziyaret tarihi 27 Eylül; VR deneyimi ayrı ücretli.",
    category: "Kültür",
    published_at: "2026-09-24T09:13:00+03:00",
    cover_image: "/editorial/2026-09-24/dusler-zamani-japonya.webp",
    original_source_url: "https://kultur.istanbul/dusler-zamani-japonya-sergisi-27-eylule-kadar-dijital-deneyim-merkezinde/",
    content: `
<p>İstanbul’daki Dijital Deneyim Merkezi’nde yer alan “Düşler Zamanı: Japonya” sergisinin süresi 27 Eylül 2026’ya uzatıldı. İBB Kültür AŞ’nin 21 Eylül tarihli duyurusuna göre sergi, Japon kültürünün doğa, mitoloji ve zanaatla kurduğu ilişkiyi dijital uygulamalar aracılığıyla ele alıyor. İstanbul’a kısa bir ziyaret planlayanlar için takvime eklenebilecek, bitiş tarihi belli bir kültür durağı.</p>
<h2>Japon sanatına ekranın içinden bakmak</h2>
<p>Burada amaç yalnızca bir görüntünün karşısında durmak değil. Kurumun sergi anlatımında hareketli sahneler, dokunmaya dayalı arayüzler ve fiziksel mekânla birleşen dijital çalışmalar öne çıkıyor. Hokusai’nin Büyük Dalga’sından Kabuki yüzlerine uzanan imgeler, ölçek, ses ve hareket değiştikçe farklı bir seyir deneyimine dönüşüyor.</p>
<p>Serginin kendi sayfası, kiraz çiçekli manzaralarla düşsel Yōkai varlıklarını aynı anlatı içinde buluşturuyor. Müzik seçkisinde Japon davulları ve çağdaş bestecilerin yanında Debussy’nin La Mer’i de anılıyor. Bu birliktelik, ziyaretçiye tek bir eserin tarihini öğretmekten çok çeşitli dönem ve ifade biçimleri arasında dolaşma imkânı veren bir kurgu olarak okunabilir.</p>
<p>Programda Barış Kabalak, Çağatay Güçlü, Danny Rose Studio, DECOL, Fuat Genç, Hakan Yılmaz, Özde Karadağ, Süleyman Yılmaz ve Umur Burak’ın çalışmaları yer alıyor. Ziyaret sırasında ekranlarda gördüğümüz tarihsel referanslarla bu çağdaş üreticilerin katkılarını ayırt etmek, sergiyi yalnız bir fotoğraf fonu olarak görmenin ötesine geçmek için iyi bir başlangıç.</p>
<h2>Dijital Oda’da ziyaretçi ne yapıyor?</h2>
<p>Merkezin Dijital Oda açıklaması, ilk bölümün etkileşimli ekranlar, sensörler ve projeksiyonlarla kurulduğunu belirtiyor. Sergi kapsamında Japon estetiğine ilişkin içerikler bir zaman akışı içinde sunuluyor. Dokunmatik uygulamalar ve oyunlar, ziyaretçilerin parçaları bir araya getirmesine veya bir görüntünün değişimine katılmasına alan açıyor.</p>
<p>Resmî listede Özde Karadağ’ın “Japon Estetiği” ve “Japon Sanatında Zaman” çalışmaları; Barış Kabalak ile Süleyman Yılmaz’ın “Boyalı Yaralar” adlı holografik video enstalasyonu bulunuyor. Hakan Yılmaz ve Umur Burak’ın “1000 Yıllık Bulmaca”sı ise etkileşimli arayüzü olan dijital bir oyun olarak tanımlanıyor. Bu ayrıntılar, serginin aynı teknolojiye dayanan tek bir odadan oluşmadığını anlamaya yardımcı oluyor.</p>
<h2>Gitmeden önce bilet ve ziyaret ayrıntıları</h2>
<p>Merkez, Örnektepe Mahallesi İmrahor Caddesi No:7, Sütlüce/Beyoğlu adresinde. Resmî ziyaret sayfasında pazartesi kapalı olduğu; salı, çarşamba, perşembe ve pazar günleri 10.00–18.00 arasında açık olduğu belirtiliyor. Cuma ve cumartesi için 10.00–22.00 saatleri “yaz dönemi boyunca” kaydıyla veriliyor. Bu nedenle akşam ziyareti düşünenlerin çıkmadan önce güncel saatleri kontrol etmesi yerinde olur.</p>
<p>Biletler gişeden veya Passo üzerinden alınabiliyor; Müze Kart geçmiyor. Sanal gerçeklik deneyimi giriş biletine dahil değil ve ayrıca satın alınıyor. İndirimli bilet koşulları vatandaşlık ve ziyaretçi grubuna göre tanımlandığından, KKTC’den gelen herkesin aynı tarifeye tabi olduğu varsayılmamalı. İndirim ve ücretsiz girişlerde kimlik isteniyor.</p>
<p>Kurum rezervasyon sistemi bulunmadığını, yoğunluk halinde girişlerin kontrollü yapılabileceğini de belirtiyor. Büyük bavullarla girişe izin verilmemesi ve emanet dolabı bulunmaması, havaalanından doğrudan gelmeyi düşünenler için özellikle yararlı bir ayrıntı. Deneyim alanlarının yaş ve sağlık uyarıları da ziyaret sayfasında ayrıca yer alıyor.</p>
<h2>Gelenekle kurulan bağı takip etmek</h2>
<p>Ziyaret için küçük bir öneri: İlginizi çeken tek bir desen veya nesne seçip onun farklı bölümlerde nasıl değiştiğine bakın. Dijital yorum ile dayandığı üretim geleneğini birlikte düşünmek, gördüklerinizi hatırlamayı kolaylaştırabilir. Bu merakı adaya taşımak isteyenler için <a href="https://ugavole.com/haber/kibris-el-isleri-lefkara-sepet-ve-oruculuk">Kıbrıs el işlerini tanıma rehberimiz</a> de malzeme, desen ve emeğe odaklanan bir devam okuması sunuyor.</p>
<h2>Kaynaklar ve görsel notu</h2>
<p><a href="https://kultur.istanbul/dusler-zamani-japonya-sergisi-27-eylule-kadar-dijital-deneyim-merkezinde/" target="_blank" rel="noopener noreferrer">Kültür AŞ’nin 21 Eylül 2026 duyurusu</a>; DDM’nin <a href="https://www.dijitaldeneyimmerkezi.com/Home/ExhibitionJapan" target="_blank" rel="noopener noreferrer">sergi</a>, <a href="https://www.dijitaldeneyimmerkezi.com/Home/DigitalRoom" target="_blank" rel="noopener noreferrer">Dijital Oda</a> ve <a href="https://www.dijitaldeneyimmerkezi.com/Home/Tickets" target="_blank" rel="noopener noreferrer">bilet ve ziyaret</a> sayfaları. Bilgiler 24 Eylül 2026’da kontrol edildi. Kapak görseli temsili bir illüstrasyondur; sergi salonunun gerçek fotoğrafı değildir.</p>
    `,
  }),
  editorial({
    slug: "63-derecede-cogalabilen-ates-amibi-yasamin-sinirlari",
    title: "63°C’de Çoğalabilen Ateş Amibi, Yaşamın Sınırlarını Yeniden Düşündürüyor",
    excerpt: "Kaliforniya’daki sıcak sularda bulunan Incendiamoeba cascadensis, 63°C’de çoğalabilen bilinen en dayanıklı ökaryotlardan biri oldu.",
    category: "Bilim & Uzay",
    published_at: "2026-09-24T09:12:00+03:00",
    cover_image: "/editorial/2026-09-24/ates-amibi-63c.webp",
    original_source_url: "https://science.nasa.gov/science-research/planetary-science/nasa-funded-research-finds-complex-life-defying-record-heat/",
    content: `
<p>Bir hücrenin içinde çekirdek, zarla çevrili küçük yapılar ve korunması gereken genetik bilgi varsa, aşırı sıcaklar onun için ciddi bir sınır oluşturur. Bu yüzden araştırmacılar, karmaşık hücre yapısına sahip canlıların yüksek sıcaklıklara dayanma eşiğini uzun zamandır daha düşük kabul ediyordu. NASA destekli yeni bir çalışma, Kaliforniya’daki Lassen Volkanik Milli Parkı’nın sıcak sularında bulunan <em>Incendiamoeba cascadensis</em> adlı amibin bu varsayımı zorladığını gösteriyor.</p>

<p>Araştırma ekibi, “ateş amibi” olarak da anılan bu tek hücreli canlının 63°C’de bölünerek çoğalabildiğini gözlemledi. NASA’nın 22 Eylül 2026’da yayımladığı açıklamaya göre bu, bilinen tüm ökaryotlar için kaydedilmiş en yüksek çoğalma sıcaklığı. Canlı 63°C’nin üzerinde çoğalmayı bırakıyor; ancak 64°C’ye kadar besin aramak için hareket etmeyi sürdürebiliyor. Laboratuvar sınır testlerinde 66°C’de kısmen etkin kaldığı, 70°C’de beş dakikalık maruziyetten sonra yeniden toparlanabildiği; 80°C’den sonra ise geri dönemediği bildirildi.</p>

<h2>Ökaryot olmak neden fark yaratıyor?</h2>

<p>Ökaryotlar, hücrelerinde çekirdek ve mitokondri gibi zarla çevrili organeller taşıyan canlılar. Tek hücreli alglerden bitkilere ve insanlara uzanan geniş bir grubu kapsıyorlar. Bakteriler ve arkeler gibi daha yalın hücre yapısına sahip canlıların çok sıcak ortamlarda yaşaması yeni bir bilgi değil. Fakat ökaryotlarda proteinlerin bozulması ve hücre zarlarının zarar görmesi, yüksek sıcaklıkta yaşamı daha zorlaştırıyor.</p>

<p>Bu nedenle önceki üst sınır, bazı mantar ve kırmızı alg türlerinde görülen 60°C civarındaydı. <em>I. cascadensis</em> için saptanan 63°C, küçük görünse de bu sınırın nasıl belirlendiği açısından önemli bir fark yaratıyor. Bu, insanların ya da diğer karmaşık canlıların aynı sıcaklığa dayanabildiği anlamına gelmiyor. Tek bir amibin olağanüstü dayanıklılığı, tüm ökaryotların ortak özelliği olarak okunamaz.</p>

<p>Ölçümlerin laboratuvar ve belirli doğal koşullar altında yapıldığını da unutmamak gerekir. Sıcaklık sabit değildir; suyun kimyası, besin kaynakları ve birlikte yaşayan canlılar da dayanıklılığı etkileyebilir.</p>

<h2>Bu amip sıcağa nasıl dayanıyor?</h2>

<p>Ekip, canlının genomunu ve farklı sıcaklıklardaki gen etkinliğini inceledi. DNA’nın zarar görmesini sınırlayan ve proteinlerin doğru biçimde katlanmasına yardımcı olan bazı genlerin yüksek sıcaklıklarda daha etkin çalıştığı görüldü. Araştırmacılar ayrıca bu amipteki bazı proteinlerin yüzey yüklerinin, sıcak ortamda yaşayan bakteri ve arkelerdeki proteinlere benzediğini belirtiyor. Bu sonuçlar, dayanıklılığın tek bir “ısı kalkanından” değil, birden fazla hücresel mekanizmanın birlikte çalışmasından kaynaklanabileceğine işaret ediyor.</p>

<p>Çalışmanın astrobiyoloji açısından değeri de burada: Yaşamın sınırlarını Dünya’daki örneklerle tanımak, başka dünyalarda hangi koşulların araştırmaya değer olduğunu daha iyi anlamaya yardımcı oluyor. Ancak sıcaklık tek başına yeterli değil. NASA’nın aktardığı gibi su, besin, basınç, oksijen ve ortamın asitliği de yaşam için belirleyici. Bu bulgu Mars’ta ya da başka bir gökcisminde yaşam bulunduğunu göstermiyor.</p>

<p>Uzayda yaşanabilirlik arayışının başka bir örneği için, <a href="/haber/perseverance-marsta-uc-ayri-su-etkilesimi">Perseverance’ın Mars kayaçlarında bulduğu su etkileşimi izlerine</a> de göz atabilirsin. İki araştırma da kesin bir yaşam kanıtı sunmuyor; fakat bilim insanlarının nerelere ve hangi sorularla bakacağını genişletiyor.</p>

<h2>Kaynak</h2>

<p>Bilgiler, NASA’nın 22 Eylül 2026 tarihli <a href="https://science.nasa.gov/science-research/planetary-science/nasa-funded-research-finds-complex-life-defying-record-heat/" target="_blank" rel="noopener noreferrer">NASA-Funded Research Finds Complex Life Defying Record Heat</a> açıklamasından derlenmiştir. Araştırma sonuçları <em>Cell</em> dergisinde yayımlanmıştır. Kapak görseli Ugavole için hazırlanmış temsili bir bilim illüstrasyonudur; mikroskop altında çekilmiş gerçek örneğin ya da NASA kaynak görselinin kopyası değildir.</p>
    `,
  }),
  editorial({
    slug: "isaret-dilleri-gunu-ulusal-isaret-dilleri-erisim",
    title: "İşaret Dilleri Günü: Erişim Neden Ulusal İşaret Dilleriyle Başlar?",
    excerpt: "Uluslararası İşaret Dilleri Günü, işaret dillerinin jestlerden ibaret olmadığını; eğitim, kamusal bilgi ve katılım için temel bir hak olduğunu hatırlatıyor.",
    category: "Yaşam",
    published_at: "2026-09-24T09:11:00+03:00",
    cover_image: "/editorial/2026-09-24/isaret-dilleri-gunu.webp",
    original_source_url: "https://www.un.org/en/node/97859",
    content: `
<p>İşaret dilleri bazen konuşulan bir dilin el hareketleriyle bire bir aktarımı gibi düşünülüyor. Oysa işaret dilleri; kendine ait dilbilgisi, sözdizimi, anlatım biçimleri ve kültürel bağlamı bulunan doğal dillerdir. Bu nedenle erişilebilirlik yalnızca altyazı eklemekten ya da bir etkinliğe işaret dili tercümanı çağırmaktan ibaret değildir. Bilgiye, eğitime, kamu hizmetlerine ve kültürel hayata kişinin kullandığı işaret diliyle erişebilmesi de gerekir.</p>

<p>Birleşmiş Milletler, 23 Eylül’ü Uluslararası İşaret Dilleri Günü olarak tanıyor. 2026 temasının adı “Sağır bireylerin insan haklarını ilan etmek.” Tema, İşitme Engelliler Dünya Federasyonu’nun 75. yılına ve Engelli Hakları Sözleşmesi’nin kabulünün 20. yılına denk geliyor. Bu iki dönüm noktası, işaret dillerinin tanınmasının yalnız sembolik bir jest olmadığını; hakların günlük hayatta uygulanmasıyla ilgili olduğunu vurguluyor.</p>

<h2>Tek bir işaret dili yok</h2>

<p>Dünya genelinde yüzlerce farklı işaret dili kullanılıyor. Bir işaret dili, çevresindeki konuşulan dilin görsel kopyası değildir; kendi yapısı, tarihsel gelişimi ve topluluğu vardır. Uluslararası toplantılarda kullanılan International Sign da ulusal işaret dillerinin yerine geçen tek bir evrensel dil değildir. Bu ayrımı bilmek, “birkaç işaret öğrenmek” ile erişilebilir iletişim kurmak arasındaki farkı görmek için önemli.</p>

<p>Bu yüzden bir kurumun, okulun ya da içerik üreticisinin erişilebilirlik iddiası, tek seferlik farkındalık paylaşımıyla sınırlı kalmamalı. Etkinlik duyuruları, acil durum bilgileri, eğitim içerikleri ve kamuya açık videoların nasıl erişilebilir hâle getirildiği; doğrudan katılımı belirler. Sağır topluluk üyelerinin planlama ve üretim sürecine dahil edilmesi de, “bizim hakkımızda hiçbir şey biz olmadan” ilkesinin pratik karşılığıdır.</p>

<p>İyi bir başlangıç, duyurunun hangi dilde ve hangi biçimde ulaşılabilir olduğunu tasarım aşamasında sormaktır. Canlı yayınlarda profesyonel tercüman, kayıtlarda nitelikli altyazı ve metin dökümü, görsel paylaşımlarda ise açıklayıcı alternatif metin planlanabilir. Bu uygulamalar birbirinin rakibi değil, farklı erişim ihtiyaçlarına yanıt veren tamamlayıcı yöntemlerdir.</p>

<h2>İçerik üretirken nelere dikkat edilmeli?</h2>

<p>İşaret dili içeren bir video hazırlanacaksa doğru dilin, yetkin bir işaret dili kullanıcısı veya profesyonel tercümanla sunulması gerekir. Rastgele el hareketleriyle oluşturulmuş görseller, yapay zekâyla üretilmiş işaretler ya da doğrulanmamış “işaret öğretme” kartları yanlış bilgi verebilir. Altyazı ve metin dökümü de değerli araçlardır; ancak bunlar işaret dilinde erişimin her koşulda yerine geçmez.</p>

<p>Bu konu, dili yalnız kelime listesi olarak görmemeyi de hatırlatıyor. Ugavole’deki <a href="/haber/kibris-agzinda-gunluk-hayati-kurtaran-15-ifade">Kıbrıs ağzında günlük ifadeler</a> yazısı, dilin aidiyet ve bağlam taşıdığını anlatıyor. İşaret dilleriyle Kıbrıs ağzı aynı olgu değildir; yine de her ikisi de dilin kimlik, topluluk ve katılım üzerindeki rolünü görünür kılıyor.</p>

<p>İşaret Dilleri Günü’nün ana mesajı basit: Erişim sonradan eklenen bir süs değil, kamusal hayatın başlangıç koşullarından biri. Bu yaklaşım, Sağır bireylerin eğitimde, çalışma hayatında, kültürde ve demokratik süreçlerde kendi dilleriyle tam katılımını mümkün kılmayı hedefliyor. Bu yükümlülük, yalnız kampanya günleriyle sınırlı değildir.</p>

<h2>Kaynak</h2>

<p>Bilgiler, Birleşmiş Milletler’in <a href="https://www.un.org/en/node/97859" target="_blank" rel="noopener noreferrer">International Day of Sign Languages</a> sayfası ile <a href="https://wfdeaf.org/international-week-of-deaf-people-2026/" target="_blank" rel="noopener noreferrer">İşitme Engelliler Dünya Federasyonu’nun 2026 Uluslararası Sağırlar Haftası</a> duyurusundan derlenmiştir. Kapak görseli Ugavole için hazırlanmış temsili bir editoryal illüstrasyondur; herhangi bir işaret dilini öğretme veya gerçek bir işareti temsil etme iddiası taşımaz.</p>
    `,
  }),
  editorial({
    slug: "lefkosa-anadolunun-izleri-sergisi-tel-kirma-tel-sarma-atolyesi",
    title: "Lefkoşa'da Anadolu'nun İzleri Bugün Açılıyor: Sergi ve El Sanatları Atölyesi",
    excerpt: "Lefkoşa'daki Anadolu'nun İzleri Sergisi 22 Eylül'de açılıyor. 23 Eylül'de tel kırma ve tel sarma atölyesi programda.",
    category: "Kültür",
    published_at: "2026-09-22T16:49:00+03:00",
    cover_image: "/editorial/2026-09-22/lefkosa-anadolunun-izleri.webp",
    original_source_url: "https://www.3eylul.com/haber/anadolunun-izleri-sergisi-lefkosada-sanatseverlerle-bulusacak-086d",
    content: `
<p><strong>Program notu:</strong> Anadolu'nun İzleri Sergisi bugün saat 18.00'de açılıyor. Kapak, Ugavole için hazırlanmış temsili bir editoryal illüstrasyondur; gerçek etkinlik fotoğrafı değildir.</p>

<p>Lefkoşa'da geleneksel el sanatlarına odaklanan <strong>Anadolu'nun İzleri Sergisi</strong>, 22 Eylül Salı günü saat 18.00'de açılacak. Programda ertesi gün tel kırma ve tel sarma atölyesi de yer alıyor.</p>

<p>3Eylül'ün Lefkoşa Yunus Emre Enstitüsü açıklamasına dayandırdığı habere göre etkinlik üç gün sürecek. Amaç, Anadolu'nun geleneksel el sanatlarından örnekleri Kuzey Kıbrıs'ta farklı kuşaklarla buluşturmak.</p>

<h2>Programda neler var?</h2>
<ul>
  <li><strong>Sergi açılışı:</strong> 22 Eylül Salı, 18.00</li>
  <li><strong>Etkinlik süresi:</strong> Üç gün</li>
  <li><strong>Atölye:</strong> 23 Eylül Çarşamba, 11.00–13.00</li>
  <li><strong>Atölye başlıkları:</strong> Tel kırma ve tel sarma</li>
</ul>

<p>Tel kırma ve tel sarma, ince metal telin kumaşla buluştuğu geleneksel işleme teknikleri arasında yer alıyor. Atölye, bu üretim biçimlerinin yapım aşamalarını yakından görmek isteyenler için programın uygulamalı bölümü olacak.</p>

<p>Etkinlik duyurusunda ziyaret saatleri, kayıt yöntemi, kontenjan ya da ücret bilgisi belirtilmiyor. Bu nedenle yola çıkmadan önce organizatörün güncel kanallarını kontrol etmek iyi olur.</p>

<p>Kıbrıs'taki geleneksel üretim hikâyelerine meraklıysan, <a href="/haber/kibris-el-isleri-lefkara-sepet-ve-oruculuk">ada el işlerine dair rehberimize</a> de göz atabilirsin.</p>

<h2>Kaynak</h2>
<p>Bilgiler, 3Eylül'ün 19 Eylül 2026 tarihli ve Lefkoşa Yunus Emre Enstitüsü açıklamasına dayandırdığı <a href="https://www.3eylul.com/haber/anadolunun-izleri-sergisi-lefkosada-sanatseverlerle-bulusacak-086d" target="_blank" rel="noopener noreferrer">haberinden</a> derlenmiştir.</p>
    `,
  }),
  editorial({
    slug: "tatlisu-plaj-guresleri-harnup-festivali-2026",
    title: "Tatlısu'da Plaj Güreşleri, İptal Edilen Festivalin Ardından Sembolik Olarak Yapıldı",
    excerpt: "Tatlısu'daki plaj güreşlerinde 130 sporcu mücadele etti. Harnup Festivali iptal edilirken geleneksel spor etkinliği sembolik olarak sürdü.",
    category: "Spor",
    published_at: "2026-09-22T16:48:00+03:00",
    cover_image: "/editorial/2026-09-22/tatlisu-plaj-guresleri.webp",
    original_source_url: "https://brtk.net/tatlisu-belediyesi-ile-gures-federasyonu-is-birliginde-plaj-guresleri-duzenlendi/",
    content: `
<p>Tatlısu Belediyesi ile Güreş Federasyonunun Zambak Tatil Köyü'nde düzenlediği plaj güreşlerinde <strong>130 kız ve erkek sporcu</strong> mücadele etti. Organizasyon, bu yıl Harnup Festivali'nin iptal edilmesinin ardından sembolik olarak yapıldı.</p>

<p>Belediye bilgisini aktaran yerel haberlerde, deniz faciası nedeniyle festivalin planlanan programının iptal edildiği belirtiliyor. Festival kapsamındaki geleneksel plaj güreşleri ise sembolik olarak gerçekleştirildi.</p>

<h2>Etkinlikten kısa notlar</h2>
<ul>
  <li>Etkinlik yeri olarak <strong>Zambak Tatil Köyü</strong> belirtildi.</li>
  <li>130 sporcu karşılaşmalara katıldı.</li>
  <li>Dereceye giren sporculara kupa ve madalya verildi.</li>
  <li>Kaynaklarda sıkletler, sonuç tabloları ve kazananların tam listesi paylaşılmadı.</li>
</ul>

<p>Bu nedenle burada bir sonuç sıralaması vermiyoruz. Haberin öne çıkan tarafı, yerel spor geleneğinin festival takvimindeki değişikliğe rağmen kısa bir buluşmayla sürdürülmesi.</p>

<p>KKTC'deki diğer spor gündemlerini <a href="/spor">Spor sayfamızdan</a> takip edebilirsin.</p>

<h2>Kaynaklar</h2>
<p>Bilgiler, belediye açıklamasını aktaran <a href="https://haberkibris.com/tatlisu-belediyesi-ile-gures-federasyonu-is-birliginde-plaj-guresleri-duzenlendi-1001-2026-09-21.html" target="_blank" rel="noopener noreferrer">Haber Kıbrıs</a> ve <a href="https://brtk.net/tatlisu-belediyesi-ile-gures-federasyonu-is-birliginde-plaj-guresleri-duzenlendi/" target="_blank" rel="noopener noreferrer">BRTK</a> haberlerinden derlenmiştir. Kapak görseli Ugavole için hazırlanmış temsili bir editoryal illüstrasyondur.</p>
    `,
  }),
  editorial({
    slug: "muze-gazhane-sesli-karsilasmalar-atolyesi-22-eylul-2026",
    title: "Müze Gazhane'de Ücretsiz Sesli Karşılaşmalar Atölyesi Bu Akşam",
    excerpt: "Sesli Karşılaşmalar atölyesi 22 Eylül saat 19.00'da Müze Gazhane'de ücretsiz gerçekleşecek.",
    category: "Kültür",
    published_at: "2026-09-22T16:47:00+03:00",
    cover_image: "/editorial/2026-09-22/muze-gazhane-sesli-karsilasmalar.webp",
    original_source_url: "https://kultur.istanbul/etkinlik/sesli-karsilasmalar/",
    content: `
<p>Kültür.İstanbul'un etkinlik sayfasına göre <strong>Sesli Karşılaşmalar</strong>, 22 Eylül Salı günü saat 19.00'da Müze Gazhane'de yapılacak. Klinik Psikolog Nazlı Özkan eşliğindeki etkinlik, atölye ve eğitim kategorisinde yer alıyor ve ücretsiz olarak duyuruluyor.</p>

<p>Resmî sayfada atölyenin içerik akışı, süresi, kontenjanı ya da kayıt yöntemi yer almıyor. Katılım koşullarını organizatörün güncel duyurusundan kontrol etmek gerekiyor.</p>

<h2>Etkinlik bilgileri</h2>
<ul>
  <li><strong>Tarih:</strong> 22 Eylül 2026, Salı</li>
  <li><strong>Saat:</strong> 19.00</li>
  <li><strong>Yer:</strong> Müze Gazhane, İstanbul</li>
  <li><strong>Tür:</strong> Atölye ve eğitim</li>
  <li><strong>Ücret:</strong> Ücretsiz</li>
</ul>

<p>Müze Gazhane'nin kültür programına aynı gün kısa bir not eklemek isteyenler için bu, akşam ajandasında yer alabilecek bir seçenek. Etkinlik başladıktan sonra güncel bilgi için organizatörün duyurusuna bakmak en sağlıklısı.</p>

<p>Kültür rotaları ve etkinlik seçkileri için <a href="/kategori/kultur">Kültür sayfamıza</a> da uğrayabilirsin.</p>

<h2>Kaynak</h2>
<p>Bilgiler, 15 Eylül 2026'da yayımlanan <a href="https://kultur.istanbul/etkinlik/sesli-karsilasmalar/" target="_blank" rel="noopener noreferrer">Kültür.İstanbul resmî etkinlik sayfasından</a> alınmıştır. Kapak görseli Ugavole için hazırlanmış temsili bir editoryal illüstrasyondur; etkinlik fotoğrafı veya sağlık hizmeti görseli değildir.</p>
    `,
  }),
  editorial({
    slug: "koltuk-senin-radar-turkiye-dijital-sira-rehberi",
    title: "Koltuk Senin: Harbiye'de Dijital Sıraya Nasıl Katılınır?",
    excerpt: "Koltuk Senin uygulamasında dijital sıra nasıl alınır? Yaş sınırı, konum doğrulaması, SMS süreci ve katılım koşulları.",
    category: "Kültür",
    published_at: "2026-09-22T16:46:00+03:00",
    cover_image: "/editorial/2026-09-22/koltuk-senin.webp",
    original_source_url: "https://kultur.istanbul/etkinlik/koltuk-senin/",
    content: `
<p>İstanbul'da düzenlenen bazı açık hava konserlerinde boş kalan koltuklar, <strong>Koltuk Senin</strong> uygulamasıyla gençlere dijital sıra üzerinden sunuluyor. Süreç, Radar Türkiye uygulaması üzerinden işliyor ve boş koltuk oluşması durumunda katılımcıya SMS ile haber veriliyor.</p>

<p>Kültür.İstanbul'un açıklamasına göre programdan <strong>18–24 yaş</strong> arasındaki kullanıcılar yararlanabiliyor. Uygulama, Harbiye Cemil Topuzlu Açık Hava Tiyatrosu'ndaki uygun konserlerde kullanılmak üzere tasarlanmış.</p>

<h2>Nasıl işliyor?</h2>
<ol>
  <li>Konser günü etkinlik alanının yaklaşık <strong>1 kilometre</strong> yakınında ol.</li>
  <li>Saat <strong>20.00'de</strong> Radar Türkiye uygulamasındaki Koltuk Senin bölümünden sıra al.</li>
  <li>Konum doğrulamasından sonra dijital sıraya eklen.</li>
  <li>Boş koltuk oluşur ve sıran gelirse SMS ile bilgilendiril.</li>
  <li>Uygulamadaki Biletlerim bölümündeki QR kodla giriş yap.</li>
</ol>

<p>Fiziksel sıra oluşturulmuyor. Her kullanıcı ayda en fazla dört etkinlik için başvurabiliyor. En önemli nokta şu: Kontenjan sınırlı ve boş koltuk durumu değişken olduğu için katılım garantisi bulunmuyor.</p>

<p>Güncel konser takvimi sık değişebileceğinden, belirli bir etkinlik adı veya tarihi için uygulama içindeki güncel bilgiyi yeniden kontrol etmek gerekir. Bu yazı, programın koşullarını açıklayan kalıcı bir rehberdir.</p>

<p>Kültür gündemindeki başka içerikler için <a href="/kategori/kultur">Kültür sayfamıza</a> göz atabilirsin.</p>

<h2>Kaynak</h2>
<p>Koşullar, 22 Eylül 2026'da kontrol edilen <a href="https://kultur.istanbul/etkinlik/koltuk-senin/" target="_blank" rel="noopener noreferrer">Kültür.İstanbul resmî program sayfasından</a> derlenmiştir. Kapak görseli Ugavole için hazırlanmış temsili bir editoryal illüstrasyondur; gerçek bir bilet, uygulama ekranı veya etkinlik fotoğrafı değildir.</p>
    `,
  }),
  editorial({
    slug: "perseverance-marsta-uc-ayri-su-etkilesimi",
    title: "Perseverance, Mars'ta En Az Üç Ayrı Su Etkileşiminin İzini Buldu",
    excerpt: "NASA'nın Perseverance aracı, Jezero Krateri kayaçlarında Mars'ın erken dönemine ait en az üç ayrı su etkileşiminin izini buldu.",
    category: "Bilim & Uzay",
    published_at: "2026-09-22T16:45:00+03:00",
    cover_image: "/editorial/2026-09-22/perseverance-mars-su.webp",
    original_source_url: "https://www.nasa.gov/solar-system/planets/mars/nasa-discovery-reveals-complex-water-systems-on-early-mars/",
    content: `
<p>NASA'nın 21 Eylül tarihli açıklamasına göre Perseverance gezgini, Jezero Krateri'nin iç kenarındaki kayaçlarda Mars'ın erken dönemine ait <strong>en az üç ayrı su etkileşiminin</strong> kimyasal izini belirledi.</p>

<p>Bulgular, kraterin eski göl kıyısını takip eden ve Margin Unit olarak adlandırılan jeolojik alandan geliyor. Araştırmacılar burada tortul kayaçlarla karşılaşmayı beklerken, büyük ölçüde magmatik kayaçlar buldu. Bu kayaçların mineral kristalleri, oluşum ve sonrasındaki değişimlere dair ayrıntılı izler tutabiliyor.</p>

<h2>Kayaçlar ne anlatıyor?</h2>
<p>NASA'nın aktardığı çalışmada, kayaçların suyla en az üç kez etkileşime girdiği görülüyor. Bu etkileşimler kayaların kimyasını ve görünümünü zaman içinde değiştirmiş.</p>

<p>Perseverance'ın direğindeki <strong>SuperCam</strong> cihazı, ışığın kayaçlardan yansımasını inceleyerek mineral yapıyı araştırıyor. Bilim ekibi bu yolla bölgede 185'ten fazla ana kaya hedefini analiz etti.</p>

<p>Karbonat ve silis gibi mineraller, geçmişte yaşanabilir koşulların araştırılması açısından önemli. Yine de bu bulgu, Mars'ta yaşam bulunduğu anlamına gelmiyor; bilim insanlarına suyun kayaçlarla hangi sırayla ve nasıl etkileştiğine dair daha ayrıntılı bir kayıt sunuyor.</p>

<p>Uzay bilimlerindeki diğer haberler için <a href="/haber/nasa-roman-uzay-teleskobu-firlatmaya-hazir">NASA'nın Roman Uzay Teleskobu içeriğimize</a> de bakabilirsin.</p>

<h2>Kaynak</h2>
<p>Bilgiler, NASA/JPL'nin 21 Eylül 2026 tarihli <a href="https://www.nasa.gov/solar-system/planets/mars/nasa-discovery-reveals-complex-water-systems-on-early-mars/" target="_blank" rel="noopener noreferrer">Complex Water Systems on Early Mars</a> açıklamasından derlenmiştir. Kapak görseli Ugavole için hazırlanmış temsili bir bilim illüstrasyonudur; NASA görüntüsü değildir.</p>
    `,
  }),
  editorial({
    slug: "nasa-aqua-uydusu-a81-d33b-buzdaglari",
    title: "NASA'nın Aqua Uydusu İki Büyük Buzdağını Aynı Karede Görüntüledi",
    excerpt: "NASA'nın Aqua uydusu, Scotia Denizi'nde sürüklenen A81 ve D33B adlı iki büyük buzdağını gerçek renkli görüntüyle kaydetti.",
    category: "Dünya",
    published_at: "2026-09-22T16:44:00+03:00",
    cover_image: "/editorial/2026-09-22/a81-d33b-buzdaglari.webp",
    original_source_url: "https://modis.gsfc.nasa.gov/gallery/individual.php?db_date=2026-09-21",
    content: `
<p>NASA'nın Aqua uydusundaki MODIS cihazı, Scotia Denizi'nde sürüklenen <strong>A81</strong> ve <strong>D33B</strong> adlı iki büyük buzdağını 12 Eylül'de gerçek renkli görüntüyle kaydetti. NASA, görüntüyü 21 Eylül'de yayımladı.</p>

<p>Öndeki A81, ABD Ulusal Buz Merkezi verisinde <strong>391,2 kare deniz mili</strong> alanla en büyük buzdağı olarak yer alıyor. Onu izleyen D33B'nin tahmini alanı ise <strong>93,49 kare deniz mili</strong>.</p>

<h2>İki buzdağının kısa geçmişi</h2>
<ul>
  <li>A81, Ocak 2023'te Brunt Buz Sahanlığı'ndan koptu.</li>
  <li>D33B, Ağustos 2023'te Borchgrevink Buz Sahanlığı'ndan kopan daha büyük D33 buzdağının bir parçası.</li>
  <li>NASA, A81'in ölçülerinin 18 Eylül itibarıyla üç yılı aşkın sürüklenmeye rağmen büyük ölçüde korunduğunu bildiriyor.</li>
</ul>

<p>Uydu görüntüleri, uzak denizlerdeki buz kütlelerinin konumunu ve ölçeğini anlamak için etkili bir araç. Ancak tek bir görüntü, iklim değişikliği ya da kıyılara yönelik riskler hakkında tek başına kesin bir sonuç vermez. Bu kare, iki buzdağının belirli bir tarihteki görünümünü gösteriyor.</p>

<p>Bilim ve çevre gündemini <a href="/haberler">Haberler sayfamızdan</a> takip edebilirsin.</p>

<h2>Kaynak</h2>
<p>Bilgiler, <a href="https://modis.gsfc.nasa.gov/gallery/individual.php?db_date=2026-09-21" target="_blank" rel="noopener noreferrer">NASA MODIS — Icebergs A81 and D33B</a> kaydından derlenmiştir (yayın: 21 Eylül 2026; görüntü tarihi: 12 Eylül 2026). Kapak görseli Ugavole için hazırlanmış temsili bir bilim illüstrasyonudur; NASA/MODIS uydu görüntüsünün kopyası değildir.</p>
    `,
  }),
  editorial({
    slug: "filo-jet-faciasi-girne-aciklarinda-ne-oldu",
    title: "Filo Jet Faciası: Girne Açıklarında Ne Oldu?",
    excerpt: "Girne–Taşucu seferindeki Filo Jet, 267 kişiyle yola çıktıktan kısa süre sonra alabora oldu. 2 Eylül 19.10 itibarıyla 239 kişiye sağ ulaşıldı, 9 kişi hayatını kaybetti, 19 kişi aranıyor; kesin neden hâlâ araştırılıyor.",
    category: "Gündem",
    published_at: "2026-09-02T19:38:00+03:00",
    cover_image: "/editorial/girne-filo-jet-faciasi/arama-kurtarma-temsili.webp",
    original_source_url: "https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14612",
    content: `
<p><strong>Editör notu:</strong> Bu dosyadaki bilanço ve arama bilgileri 2 Eylül 2026 saat 19.10, sağlık bilgileri 19.27 itibarıyladır. Soruşturma ve derin deniz incelemesi sürdüğü için yeni teyitlerle değişebilir. Kapak, Ugavole için hazırlanmış temsili bir editoryal illüstrasyondur; olay anını gösteren haber fotoğrafı değildir.</p>

<h2>Giriş: Girne'den başlayan yolculuk</h2>
<p>30 Ağustos 2026 Pazar günü Girne Limanı'ndan Mersin'in Taşucu Limanı'na doğru yola çıkan Filo Jet'te 259 yolcu ve sekiz mürettebat, toplam 267 kişi vardı. Yüksek hızlı katamaran tipi yolcu gemisi, kıyıdan uzaklaştıktan kısa süre sonra su almaya başladı; geri dönme girişiminin ardından alabora oldu ve battı.</p>

<p>Olayın ilk dakikalarına ilişkin kamuya açık kayıtlarda bazı saat ve mesafe farklılıkları bulunuyor. En somut resmî kayıtlardan biri, Larnaka Arama Kurtarma Koordinasyon Merkezi'nin tehlike sinyalini saat 12.13'te, Girne'nin yaklaşık beş deniz mili kuzeyindeki gemiden aldığını belirten açıklaması. Türkiye İçişleri Bakanlığı ise su almanın Girne Limanı'nın yaklaşık dört mil açığında başladığını bildirdi. Bu nedenle olay alanını tek ve kesin bir koordinat yerine <strong>Girne'nin yaklaşık 4–5 deniz mili kuzeyi</strong> olarak tarif etmek daha doğru.</p>

<figure>
  <img src="/editorial/girne-filo-jet-faciasi/bilanco.svg" alt="Filo Jet'teki 267 kişiden 239 kişiye sağ ulaşıldığını, 9 kişinin hayatını kaybettiğini ve 19 kişinin arandığını gösteren infografik" width="1200" height="675" loading="lazy">
  <figcaption>2 Eylül 2026 saat 19.10 itibarıyla resmî bilanço. Kaynak: KKTC Başbakanlığı ve TAK/Radyo Güven. Grafik: Ugavole.</figcaption>
</figure>

<h3>Rakamlar neden değişti?</h3>
<p>İlk saatlerde kurtarılan ve kayıp kişilere ilişkin farklı sayılar açıklandı. Başlangıçta 241 kişinin kurtarıldığı, 18 kişinin kayıp olduğu bildirilmişti. Yolcu manifestosu, kıyıya çıkarılanların kimlikleri, hastane kayıtları ve aile bildirimleri karşılaştırıldığında, kurtarılanlar arasında sayılan iki kişinin aslında kayıp listesinde olduğu anlaşıldı. Tablo önce 239 sağ ulaşılan, sekiz hayatını kaybeden ve 20 kayıp olarak düzeltildi. 2 Eylül akşamı batıktaki çalışmada bir kişinin naaşına ulaşılmasıyla bilanço 239 sağ ulaşılan, dokuz hayatını kaybeden ve 19 kayıp olarak güncellendi; bulunan kişinin kimlik tespiti sürüyor.</p>

<p>Kurtarılanlar arasında hastanelere sevk edilen 19 yaralı da bulunuyor. 1 Eylül saat 16.17'de bunlardan 13'ünün taburcu edildiği açıklandı. Sağlık Bakanlığı, 2 Eylül saat 19.27'de tüm hastanelerde yatarak tedavi gören kazazede sayısının üçe düştüğünü bildirdi. Kurtarılan sekiz aylık hamile bir yolcu ise aynı gün ailesinin talebiyle ambulans uçakla Kocaeli'ye nakledildi.</p>

<h2>Gelişme: Arama hem yüzeyde hem 500 metrenin altında</h2>
<p>Kaza ihbarının ardından KKTC Sahil Güvenlik unsurları, sağlık ekipleri, Türkiye'den gelen hava ve deniz araçları ile bölgede bulunan sivil tekneler arama-kurtarma çalışmalarına katıldı. İlk saatlerde deniz yüzeyinden çok sayıda yolcu çıkarılırken, takip eden günlerde operasyon derin sudaki gemiye ve kayıplara ulaşma hedefiyle genişledi. 2 Eylül saat 19.10 itibarıyla 19 kişi için arama sürüyor.</p>

<figure>
  <img src="/editorial/girne-filo-jet-faciasi/rota-ve-derinlik.svg" alt="Girne-Taşucu rotasını, Girne'nin 4 ila 5 deniz mili kuzeyindeki olay alanını ve 550 metre derinlikteki arama çalışmalarını gösteren şematik infografik" width="1200" height="780" loading="lazy">
  <figcaption>Rota ve derin su araması şematik olarak gösterilmiştir; harita ölçekli değildir. 2 Eylül'de gemiye ulaşıldığı, görüntüleme ve aramanın sürdüğü açıklandı. Grafik: Ugavole.</figcaption>
</figure>

<h3>550 metredeki gemiye ulaşıldı; inceleme sürüyor</h3>
<p>Türk Deniz Kuvvetleri'ne ait TCG Işın, sonar ve uzaktan kumandalı sualtı aracıyla bölgede çalışmaya başladı. 1 Eylül akşamı yaklaşık 550 metre derinlikte gemi olduğu değerlendirilen bir cisim tespit edildi; o aşamada cismin Filo Jet olduğu henüz teyit edilmemişti. Cumhurbaşkanı Tufan Erhürman, 2 Eylül saat 12.14'te gemiye ulaşıldığını ve görüntüleme ile arama çalışmalarının 24 saat esasıyla sürdüğünü açıkladı.</p>

<p>Bu derinlik, klasik insanlı dalışın çok ötesinde. Görüntüleme ve olası fiziksel inceleme; sonar, ROV ve özel kurtarma gemilerinin hassas biçimde aynı noktada çalışmasını gerektiriyor. TCG Işın'ın ardından TCG Alemdar da 2 Eylül'de operasyona katıldı. Yüzey, kıyı hattı ve deniz tabanı aramaları bu yüzden eş zamanlı yürütülüyor.</p>

<figure>
  <img src="/editorial/girne-filo-jet-faciasi/zaman-cizelgesi.svg" alt="Filo Jet faciasının 30 Ağustos'tan 2 Eylül'e kadar doğrulanmış gelişmelerini gösteren zaman çizelgesi" width="1200" height="760" loading="lazy">
  <figcaption>İlk dört günün doğrulanmış gelişmeleri. Tutukluluk kararı mahkûmiyet anlamına gelmez; teknik neden henüz açıklanmadı. Grafik: Ugavole.</figcaption>
</figure>

<h3>Kesin neden belli mi?</h3>
<p>Hayır. Mahkemedeki ilk duruşmada polis, gemi kıyıdan yaklaşık dört mil uzaklaştıktan sonra sol ön kızak uç kısmının kırıldığını ve su almanın ardından alabora olduğunu aktardı. Bu anlatım soruşturmanın ön bulgusu; batık üzerinde tamamlanmış bir adli mühendislik incelemesine dayanan nihai kaza raporu değil. Savunma da bu tespitin teknik dayanağına itiraz etti.</p>

<p>Hava koşulları konusunda dahi ilk açıklamalar aynı yönde değil. Başbakan Ünal Üstel ilk değerlendirmesinde dalgalardan söz ederken, Cumhurbaşkanı Erhürman havanın genel olarak kötü olmadığını belirtti ve spekülasyon yapılmamasını istedi. Mahkemede ise Meteoroloji Dairesi'nin sefer öncesinde uygunluk raporu verdiği aktarıldı. Dolayısıyla “gemiyi fırtına batırdı”, “tek neden yapısal kırılmaydı” ya da başka bir kesin neden yazmak için henüz yeterli kanıt yok.</p>

<p>Teknik incelemenin; gövdenin su geçirmez bütünlüğünü, stabilite ve balast durumunu, bakım ve klas kayıtlarını, yük dağılımını, makine ve alarm verilerini, AIS/GPS seyrini, VHF konuşmalarını, gemi içi görüntüleri, deniz koşullarını ve insan faktörünü birlikte değerlendirmesi gerekiyor. Fiziksel batık bulguları bu zincirin en kritik parçası olabilir.</p>

<h3>Adli süreç hangi aşamada?</h3>
<p>31 Ağustos'ta Girne Kaza Mahkemesi'ne 14 kişi çıkarıldı. Kaptan, yedi mürettebat ve bir şirket yetkilisi olmak üzere dokuz zanlı hakkında “tedbirsizlik ve dikkatsizlik sonucu ölüme sebebiyet verme” soruşturması kapsamında üçer günlük tutukluluk kararı verildi. Aralarında şirket ve liman görevlilerinin bulunduğu beş kişi hakkında da tahkikat yürütülmesine karar verildi.</p>

<p>Bu kararlar bir mahkûmiyet hükmü değil. Sefer sırasında geminin altından su geldiğinin mürettebata bildirildiğine, tahliye ve can yeleği dağıtımında sorun yaşandığına ilişkin tanık anlatımları soruşturma dosyasına girerken; savunma tarafı yeterli can salı ve ekipman bulunduğunu, mürettebatın yolculara yardım ettiğini ve sefer izinlerinin mevcut olduğunu ileri sürüyor. Hangi beyanın teknik kayıtlarla doğrulanacağı yargı ve uzman incelemesi sonunda ortaya çıkacak.</p>

<p>Yetkililer geminin seferine izin veren ilgili liman görevlilerinin görevden uzaklaştırıldığını açıkladı. Türkiye Ulaştırma ve Altyapı Bakanlığı Deniz Kazaları İnceleme Dairesi heyeti de 2 Eylül'de adaya gelerek teknik araştırma ve ön rapor çalışmasına başladı; geminin onarım ve tersane geçmişinin Türkiye'de ayrıca incelenmesi planlanıyor.</p>

<p>Başbakan Ünal Üstel, aynı gün saat 18.54'te soruşturmanın selameti gerekçesiyle Bayındırlık ve Ulaştırma Bakanı Erhan Arıklı'yı görevden aldığını duyurdu. Bu idari karar tek başına kişisel ceza sorumluluğuna ilişkin bir hüküm değil. Kamuoyunun beklediği, bütün bu çalışmaların sorumluluğu belirlemekle kalmayıp aynı hattaki deniz ulaşımının güvenlik açıklarını da somut biçimde kapatması.</p>

<h3>Adanın ortak yası</h3>
<p>Facianın ardından 31 Ağustos'tan 2 Eylül günü gün batımına kadar üç günlük ulusal yas ilan edildi. Girne Limanı'nda yakınlarından haber bekleyen ailelerin bekleyişi sürerken, olayın bilançosu bir sayı tablosundan çok daha fazlasını anlatıyor: Her rakam, bir aileye ve yarım kalan bir yolculuğa karşılık geliyor.</p>

<h2>Sonuç: Arama bitmeden, rapor çıkmadan hüküm kurulamaz</h2>
<p>Girne açıklarında bugün iki sorumluluk aynı anda taşınıyor. İlki, kayıp 19 kişiye ulaşmak ve ailelere doğrulanmış bilgi vermek. İkincisi, 267 kişilik bir yolculuğun neden kısa süre içinde ölümcül bir deniz kazasına dönüştüğünü bütün teknik ve idari boyutlarıyla ortaya çıkarmak.</p>

<p>Şu an kesin olan tablo ağır: 239 kişiye sağ ulaşıldı, dokuz kişi hayatını kaybetti ve 19 kişi aranıyor. Gemiye ulaşılmış olsa da kazanın kök nedeni ve olası ihmal zincirinin hangi halkalardan oluştuğu henüz kesin değil. Hızlı yargılar yerine açık kayıtlar, bağımsız teknik değerlendirme ve şeffaf bir nihai rapor gerekiyor. Bu yalnızca hayatını kaybedenler ve yakınları için değil, Girne–Taşucu hattını gelecekte kullanacak her yolcu için kamusal bir güvenlik meselesi.</p>

<h2>Kaynaklar ve yayın notu</h2>
<p>Bu metin özgün olarak hazırlandı; resmî ve kurumsal açıklamalar ile teknik değerlendirmeler birlikte kullanıldı. Bilanço, sağlık ve soruşturma bilgileri yayından hemen önce yeniden kontrol edilmiştir.</p>
<ul>
  <li><a href="https://basbakanlik.gov.ct.tr/BASIN-VE-HALKLA-%C4%B0L%C4%B0%C5%9EK%C4%B0LER/BASIN-A%C3%87IKLAMALARI/uunaluustelbbac%C4%B1klama" target="_blank" rel="noopener noreferrer">KKTC Başbakanlığı: Manifesto eşleştirmesi ve sayı düzeltmesi</a></li>
  <li><a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14595" target="_blank" rel="noopener noreferrer">TAK/Radyo Güven: Arama çalışmalarının dördüncü günü</a></li>
  <li><a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14599" target="_blank" rel="noopener noreferrer">TAK/Radyo Güven: Gemiye ulaşılması ve TCG Alemdar'ın katılımı</a></li>
  <li><a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14603" target="_blank" rel="noopener noreferrer">TAK/Radyo Güven: 2 Eylül öğleden sonra arama ve ailelerin bekleyişi</a></li>
  <li><a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14612" target="_blank" rel="noopener noreferrer">TAK/Radyo Güven: Batıkta bir kişinin naaşına ulaşılması ve güncel bilanço</a></li>
  <li><a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14610" target="_blank" rel="noopener noreferrer">TAK/Radyo Güven: Deniz Kazaları İnceleme Dairesi heyetinin çalışması</a></li>
  <li><a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14611" target="_blank" rel="noopener noreferrer">TAK/Radyo Güven: Bayındırlık ve Ulaştırma Bakanı'nın görevden alınması</a></li>
  <li><a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14608" target="_blank" rel="noopener noreferrer">TAK/Radyo Güven: Hamile kazazedenin Türkiye'ye nakli</a></li>
  <li><a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14613" target="_blank" rel="noopener noreferrer">TAK/Radyo Güven: Hastanelerde yatarak tedavi gören üç kazazede</a></li>
  <li><a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14590" target="_blank" rel="noopener noreferrer">TAK/Radyo Güven: 550 metredeki temas ve doğrulama uyarısı</a></li>
  <li><a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14562" target="_blank" rel="noopener noreferrer">Mahkeme ve polis tarafından aktarılan ön bulgular</a></li>
  <li><a href="https://radyoguven.gov.ct.tr/Sayfa/HaberDetay/14586" target="_blank" rel="noopener noreferrer">Yaralıların sağlık durumuna ilişkin 1 Eylül toplu güncellemesi</a></li>
  <li><a href="https://www.gov.cy/amyna/anakoinosi-tou-kentrou-syntonismou-erevnas-kai-diasosis-larnakas-anaforika-me-to-epivatigo-ploio-filio-jet/" target="_blank" rel="noopener noreferrer">Larnaka Arama Kurtarma Koordinasyon Merkezi: Tehlike sinyali kaydı</a></li>
  <li><a href="https://www.trthaber.com/haber/gundem/turkiyeden-kktcye-arama-kurtarma-destegi-955372.html" target="_blank" rel="noopener noreferrer">TRT Haber: Türkiye İçişleri Bakanlığı'nın olay yeri ve arama desteği açıklaması</a></li>
  <li><a href="https://www.mfa.gov.tr/no_-169_-kktc-nin-girne-limani-aciklarinda-meydana-gelen-gemi-kazasi-hk.tr.mfa" target="_blank" rel="noopener noreferrer">T.C. Dışişleri Bakanlığı: Arama-kurtarma desteği</a></li>
  <li><a href="https://tmmob.org.tr/icerik/gmo-girne-aciklarinda-meydana-gelen-filo-jet-deniz-kazasi-hakkinda" target="_blank" rel="noopener noreferrer">TMMOB Gemi Mühendisleri Odası: Teknik inceleme başlıkları</a></li>
</ul>
    `,
  }),
  editorial({
    slug: "nasa-roman-uzay-teleskobu-firlatmaya-hazir",
    title: "NASA'nın Roman Uzay Teleskobu Fırlatma İçin Son Onayı Aldı",
    excerpt: "Karanlık enerji, karanlık madde ve ötegezegenleri araştıracak Nancy Grace Roman Uzay Teleskobu için geri sayım başladı; hedef tarih 30 Ağustos.",
    category: "Bilim & Uzay",
    published_at: "2026-08-28T22:05:00+03:00",
    cover_image: "https://assets.science.nasa.gov/dynamicimage/assets/science/astro/universe/2023/09/Roman-1.png",
    original_source_url: "https://science.nasa.gov/blogs/roman/2026/08/28/nasas-roman-space-telescope-go-for-launch/",
    content: `
<p>NASA, Nancy Grace Roman Uzay Teleskobu'nun fırlatma hazırlık incelemesini tamamladığını ve görevin geri sayıma geçmeye hazır olduğunu 28 Ağustos'ta açıkladı. Son değerlendirmede teleskop, SpaceX Falcon Heavy roketi, hava koşulları ve görev ekiplerinin durumu birlikte incelendi.</p>

<h2>Hedef 30 Ağustos</h2>
<p>Fırlatma, Florida'daki Kennedy Uzay Merkezi'nin 39A rampasından 30 Ağustos Pazar günü ABD doğu saatiyle 07.26'da planlanıyor. Bu saat Kıbrıs'ta 14.26'ya denk geliyor. ABD Uzay Kuvvetleri meteorologları, şu an için uygun hava ihtimalini yüzde 60 olarak hesaplıyor; program hava ve teknik koşullara bağlı olarak değişebilir.</p>

<h2>Roman neyi araştıracak?</h2>
<p>Roman'ın geniş ve derin gökyüzü taramaları; karanlık enerji ile karanlık maddenin doğasını araştırmaya, milyarlarca galaksiyi haritalamaya ve Güneş Sistemi dışındaki gezegenleri bulup incelemeye yardımcı olacak. Teleskobun Geniş Alan Aracı, Hubble'ın kızılötesi kamerasından en az 100 kat daha geniş bir görüş alanına sahip olacak.</p>

<p>Görev aynı zamanda yıldız ışığını bastırarak ötegezegenleri doğrudan görüntülemeyi hedefleyen koronagraf teknolojisini de sınayacak. İşlenen Roman verilerinin bilim insanları ve kamuoyu için açık biçimde paylaşılması planlanıyor.</p>

<p><strong>Kaynak notu:</strong> Bilgiler NASA'nın 28 Ağustos 2026 tarihli görev güncellemesine dayanıyor. Kapak görseli NASA'ya aittir.</p>
    `,
  }),
  editorial({
    slug: "google-site-itibari-politikasi-avrupa-degisiklik",
    title: "Google, Avrupa'da 'Site İtibarı' Yaptırımını Değiştiriyor",
    excerpt: "30 Ağustos'tan itibaren AEA'daki arama sonuçlarında manuel cezaların etkisi değişecek; üçüncü taraf bölümler ana siteden bağımsız değerlendirilebilecek.",
    category: "Teknoloji",
    published_at: "2026-08-28T22:04:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    original_source_url: "https://developers.google.com/search/blog/2026/08/update-site-reputation-policy",
    content: `
<p>Google, güvenilir bir alan adının sıralama gücünden yararlanmak amacıyla o sitede yayımlanan üçüncü taraf içeriklere karşı uyguladığı “site itibarı kötüye kullanımı” politikasını Avrupa Ekonomik Alanı'nda farklı biçimde uygulayacağını duyurdu. Değişiklik 30 Ağustos'ta başlayacak.</p>

<h2>AEA içinde ve dışında farklı sonuç</h2>
<p>Avrupa Ekonomik Alanı dışındaki kullanıcılarda, bu politika kapsamında verilen manuel işlem ilgili site bölümünün arama sonuçlarını doğrudan etkilemeye devam edecek. AEA içindeki aramalarda ise manuel işlemin bu doğrudan etkisi uygulanmayacak.</p>

<p>Bu, politikanın Avrupa'da kaldırıldığı anlamına gelmiyor. Google, sorunlu görülen bölümün zaman içinde ana sitenin sıralama sinyallerinden ayrılarak kendi itibarıyla değerlendirilmesini sağlayabileceğini söylüyor. Böylece güçlü bir yayıncı alan adı altında yer alan bağımsız kupon, inceleme veya ortaklık içeriği otomatik olarak ana sitenin otoritesinden yararlanamayabilir.</p>

<h2>Yayıncılar için ne değişiyor?</h2>
<p>Site sahipleri manuel işlemler hakkında Search Console üzerinden bildirim almaya devam edecek. Hatalı karar verildiğini düşünenler yeniden değerlendirme isteyebilecek; uygun siteler için arabuluculuk yolu da açık olacak.</p>

<p>Google, değişikliğin Avrupa Komisyonu ile yapılan görüşmelerin ardından hazırlandığını belirtiyor. Yayıncılar açısından en güvenli yaklaşım ise üçüncü taraf içeriğin kim tarafından üretildiğini, neden aynı alan adında bulunduğunu ve kullanıcıya gerçek bir editoryal değer sunup sunmadığını açık tutmak.</p>

<p><strong>Kaynak notu:</strong> Haber, Google Search Quality ekibinin 28 Ağustos 2026 tarihli resmî duyurusundan özgün biçimde hazırlanmıştır. Kapak görseli temsilidir.</p>
    `,
  }),
  editorial({
    slug: "fed-warsh-enflasyon-faiz-mesaji-jackson-hole",
    title: "Fed Başkanı Warsh Enflasyonda Temkinli: 'Bir Karara Değil, Disipline Bağlıyım'",
    excerpt: "Jackson Hole'daki ilk başkanlık konuşmasında yüzde 2 hedefini yineleyen Warsh, enflasyon yeterince hızlı gerilemezse Fed'in harekete geçmesi gerektiğini söyledi.",
    category: "Ekonomi",
    published_at: "2026-08-28T22:03:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
    original_source_url: "https://www.federalreserve.gov/newsevents/speech/warsh20260828a.htm",
    content: `
<p>ABD Merkez Bankası Başkanı Kevin Warsh, göreve gelişinin 100. gününde yaptığı Jackson Hole konuşmasında enflasyon konusunda gevşemeye hazır olmadığı mesajını verdi. Warsh, Fed'in yüzde 2'lik kişisel tüketim harcamaları enflasyonu hedefinin “sabit ve kesin” olduğunu vurguladı.</p>

<h2>Faiz kararı için kapı açık</h2>
<p>Warsh belirli bir faiz kararına söz vermedi. Ancak temel enflasyonun hedefe açık biçimde ve yeterli hızda ilerlediğinden emin olunamaması hâlinde Fed'in “yapacak işi” bulunduğunu söyledi. Kısa vadeli faizleri çift hedefe ulaşmak için temel araç olarak tanımlaması, piyasalarda gelecek toplantılarda faiz artışı ihtimalinin yeniden değerlendirilmesine yol açtı.</p>

<p>Başkan aynı zamanda sürekli ileri yönlendirmenin normal dönemlerde sınırlı kullanılması gerektiğini savundu. Ona göre merkez bankasının gelecekteki kararlara fazla erken bağlanması hem piyasalara yanlış güven verebilir hem de yeni veriler geldiğinde Fed'in hareket alanını daraltabilir.</p>

<h2>Ekonomi güçlü, fiyat baskısı sürüyor</h2>
<p>Warsh, ABD ekonomisinin şoklara karşı dirençli kaldığını ve şirket yatırımlarının hızlandığını söyledi. Yapay zekâ altyapısının bu yılki sermaye harcaması büyümesinin yarıdan fazlasını oluşturabileceğini belirtti. Buna karşın güçlü büyümenin enflasyon riskini kendiliğinden ortadan kaldırmadığına dikkat çekti.</p>

<p>Konuşmanın ana mesajı kesin bir faiz tahmini değil, veriye göre hareket etme sözüydü: Warsh'ın ifadesiyle Fed “bir karara değil, bir disipline” bağlı kalacak.</p>

<p><strong>Kaynak notu:</strong> Haber, ABD Merkez Bankası'nın 28 Ağustos 2026 tarihli resmî konuşma metnine dayanıyor. Kapak görseli temsilidir.</p>
    `,
  }),
  editorial({
    slug: "nepal-cin-sinir-seli-arama-kurtarma-suruyor",
    title: "Nepal-Çin Sınırındaki Selde Bilanço Ağırlaşıyor, Binlerce Kişi Aranıyor",
    excerpt: "Buzul çökmesinin tetiklediği düşünülen sel ve enkaz akışının ardından kurtarma ekipleri çamur içinde çalışıyor; yeni taşkın riski de izleniyor.",
    category: "Dünya",
    published_at: "2026-08-28T22:02:00+03:00",
    cover_image: "https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/media/images/nepal5.png",
    original_source_url: "https://apnews.com/article/1f3d0ccf432eed879020e18efcab3146",
    content: `
<p>Nepal ile Çin'in Tibet bölgesi arasındaki Himalaya sınırında meydana gelen yıkıcı selin ardından arama kurtarma çalışmaları 28 Ağustos'ta da sürdü. Ekipler, yerleşimlerin ve yolların çamur ile moloz altında kaldığı bölgelerde kayıplara ulaşmaya çalışıyor.</p>

<h2>Rakamlar hızla değişiyor</h2>
<p>Associated Press'in 28 Ağustos güncellemesinde Nepal Ulusal Afet Riskini Azaltma ve Yönetim Kurumu, ülkedeki can kaybını 579; kayıp sayısını 1.924 olarak bildirdi. Nepal'de 3.700'den fazla kişi kurtarıldı. Çin devlet yayıncısı CCTV ise Tibet tarafında beş kişinin öldüğünü, 558 kişinin kayıp olduğunu aktardı.</p>

<p>Bu sayılar sahadaki yeni bildirimlerle değişebileceği için anlık bir tablo olarak değerlendirilmeli. Kayıplar arasında farklı ülkelerden ziyaretçiler ve bölge sakinleri bulunuyor.</p>

<h2>Yaklaşık 100 kilometrelik yıkım hattı</h2>
<p>ABD Jeoloji Araştırmaları Kurumu'nun ön incelemesine göre felaket, Langtang Ulusal Parkı yakınındaki buzullu bir dağ yamacında meydana gelen büyük çöküşle başladı. Eriyen buz, su, kaya ve toprak nehir yataklarında hız kazanarak yaklaşık 100 kilometre ilerledi. İlk olayın ürettiği sismik enerji 5,2 büyüklüğünde bir depreme eşdeğer ölçüldü.</p>

<p>Yetkililer, yukarı havzada oluşan doğal set gölünü ve yeni taşkın ihtimalini izliyor. Çin makamları göl seviyesinin zirveden yaklaşık 10 metre gerilediğini bildirse de riskli bölgelerdeki halka daha güvenli alanlara geçme çağrısı yapıldı.</p>

<p><strong>Kaynak notu:</strong> Bilanço AP'nin 28 Ağustos 2026 tarihli canlı güncellemesine, olayın bilimsel açıklaması USGS'nin 27 Ağustos ön incelemesine dayanıyor. Kapak haritası USGS tarafından kamu malı olarak yayımlanmıştır.</p>
    `,
  }),
  editorial({
    slug: "norvec-krali-harald-v-hayatini-kaybetti",
    title: "Norveç Kralı Harald V Hayatını Kaybetti, Haakon VIII Dönemi Başladı",
    excerpt: "35 yıldır tahtta bulunan Harald V, Oslo'da 89 yaşında yaşamını yitirdi; oğlu Haakon anayasa gereği otomatik olarak kral oldu.",
    category: "Dünya",
    published_at: "2026-08-28T22:01:00+03:00",
    cover_image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/King_Harald_V_may_2026_%28cropped%29.jpg",
    original_source_url: "https://www.kongehuset.no/nyheter/kong-harald-v-er-dod",
    content: `
<p>Norveç Kraliyet Sarayı, Kral Harald V'in 28 Ağustos Cuma sabahı Oslo'daki Rikshospitalet'te 06.35'te hayatını kaybettiğini açıkladı. Avrupa'nın en yaşlı hükümdarı olan Harald 89 yaşındaydı.</p>

<h2>Taht otomatik olarak Haakon'a geçti</h2>
<p>Norveç anayasası uyarınca veliaht prens Haakon, babasının ölümüyle birlikte Haakon VIII adıyla kral oldu. Norveç'te monarşi büyük ölçüde sembolik bir role sahip; siyasi yetki seçilmiş parlamento ve hükümet tarafından kullanılıyor.</p>

<p>Harald V, babası Olav V'in ölümünün ardından Ocak 1991'de tahta çıkmış ve 35 yıl boyunca ülkenin devlet başkanı olarak görev yapmıştı. Başbakan Jonas Gahr Støre, Norveç'in yas içinde olduğunu belirterek kralın ülkeye uzun yıllar hizmet ettiğini söyledi.</p>

<h2>Savaş yıllarından modern monarşiye</h2>
<p>1937'de doğan Harald, Nazi işgali sırasında henüz üç yaşındayken annesi ve kız kardeşleriyle önce İsveç'e, ardından Amerika Birleşik Devletleri'ne götürüldü. Aile 1945'te Norveç'e döndü. Harald daha sonra askerî eğitim aldı, Oxford Üniversitesi'nde okudu ve ülkesini yelkende üç Olimpiyat Oyunları'nda temsil etti.</p>

<p>1968'de, uzun süren bekleyişin ardından Sonja Haraldsen ile evlenmesi Norveç monarşisinin daha modern ve halka yakın bir çizgiye yönelmesinin önemli simgelerinden biri oldu.</p>

<p><strong>Kaynak notu:</strong> Ölüm saati ve resmî duyuru Norveç Kraliyet Sarayı'ndan; tarihsel bilgiler Associated Press'in 28 Ağustos 2026 tarihli haberinden doğrulandı. Görsel: Prime Minister's Office, Government of India / GODL-India.</p>
    `,
  }),
  editorial({
    slug: "lefkosada-bir-gun-surlarici-rotasi",
    title: "Lefkoşa Surlariçi'nde Bir Gün: Acele Etmeden İzlenecek Rota",
    excerpt: "Büyük Han'dan Arabahmet'e, dar sokaklardan avlulu kahvelere uzanan; haritaya değil şehrin ritmine göre hazırlanmış bir Lefkoşa yürüyüşü.",
    category: "Gezi",
    published_at: "2026-08-25T09:00:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1684438269027-52d616164157",
    content: `
<p>Lefkoşa'yı tanımanın en iyi yolu, Surlariçi'ne bir yapılacaklar listesiyle saldırmak değil; kapılardan, avlulardan ve gölgeli sokaklardan yavaşça geçmektir. Bu rota bir günde çok yer işaretlemek yerine kentin dokusunu okumak için hazırlandı.</p>

<h2>Sabah: Büyük Han ve çevresi</h2>
<p>Güne erken başlayın. Büyük Han'ın avlusu kalabalıklaşmadan taş kemerleri, dükkânları ve üst kattaki galeriyi görmek daha keyiflidir. Kahvenizi içerken yalnız binaya değil, avluya girip çıkan insanlara da bakın; Surlariçi'nin temposu burada kendini belli eder.</p>
<p>Handan çıktıktan sonra Arasta boyunca yürüyün. Ana akıştan birkaç kez sapıp yan sokaklara girin. Bakırcılar, kumaşçılar ve küçük atölyeler şehrin yalnız turistik vitrinlerden ibaret olmadığını hatırlatır.</p>

<h2>Öğle: Bandabuliya ve lokanta molası</h2>
<p>Belediye Pazarı çevresi, mevsim ürünlerini ve gündelik alışveriş kültürünü gözlemlemek için doğru duraktır. Öğle yemeğinde menüsü gereğinden uzun olmayan, yerel müşterisi bulunan küçük bir lokanta seçin. Günün yemeğini sormak çoğu zaman tabeladaki en popüler seçeneği söylemekten daha iyi sonuç verir.</p>

<h2>Öğleden sonra: Arabahmet'in sessiz sokakları</h2>
<p>Arabahmet bölgesine ilerledikçe sokaklar sakinleşir. Cumbalı evler, farklı dönemlerden ibadethaneler ve restore edilmiş yapılar yan yana görünür. Fotoğraf çekerken evlerin hâlâ yaşam alanı olduğunu unutmayın; kapılara ve özel avlulara saygılı mesafede kalın.</p>

<h2>Rotanın sonu: Gün ışığı yumuşarken</h2>
<p>Akşamüstünü surlara yakın bir noktada veya avlulu bir kafede tamamlayın. Lefkoşa'nın güzelliği tek bir anıtta değil; farklı dönemlerin aynı sokakta üst üste bıraktığı izlerdedir.</p>
<blockquote><p>İyi bir Surlariçi gezisi kilometreyle değil, kaç kez durup etrafa baktığınızla ölçülür.</p></blockquote>

<h2>Kısa kontrol listesi</h2>
<ul><li>Rahat ayakkabı ve yeniden doldurulabilir su şişesi alın.</li><li>Öğle sıcağında gölgeli avluları tercih edin.</li><li>İbadethanelerin ziyaret saatlerini aynı gün kontrol edin.</li><li>Esnafı ve evleri fotoğraflamadan önce izin isteyin.</li></ul>
    `,
  }),
  editorial({
    slug: "kibris-agzinda-gunluk-hayati-kurtaran-15-ifade",
    title: "Kıbrıs Ağzında Günlük Hayatı Kurtaran 15 İfade",
    excerpt: "'Napan?', 'bullim' ve 'haniysi?' yalnız kelime değil; adanın samimiyetini ve mizahını taşıyan küçük kültür anahtarları.",
    category: "Kültür",
    published_at: "2026-08-24T11:30:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    content: `
<p>Kıbrıs ağzı, standart Türkçenin üzerine eklenmiş birkaç komik kelimeden ibaret değildir. Söyleyiş, vurgu ve cümlenin ritmi; adanın tarihinden, komşuluk kültüründen ve iki dilliliğinden izler taşır. Aşağıdaki ifadeler günlük konuşmayı anlamak için iyi bir başlangıçtır.</p>

<h2>Selamlaşırken ve hâl hatır sorarken</h2>
<ol><li><strong>Napan?</strong> “Ne yapıyorsun?” sorusunun en gündelik hâli.</li><li><strong>Nasılsın be?</strong> Buradaki “be” sertlik değil, çoğu zaman yakınlık taşır.</li><li><strong>İyi bullim.</strong> “İyiyim” anlamında, konuşanın tavrına göre sakin ya da neşeli duyulabilir.</li><li><strong>Geliyok.</strong> “Geliyoruz” veya bağlama göre “geliyoruz işte” anlamında kullanılır.</li><li><strong>Giderik.</strong> “Gideriz” demenin ada usulü, çoğu zaman kesin saat vermeyen hâli.</li></ol>

<h2>Bir şeyi ararken</h2>
<ol start="6"><li><strong>Haniysi?</strong> “Hangisi?” anlamında.</li><li><strong>Nereyi?</strong> “Nereye?” sorusunun konuşmadaki kısa biçimi.</li><li><strong>Oracıkta.</strong> Çok uzak olmayan ama tarif edilmesi de gerekmeyen yer.</li><li><strong>Bu yanda.</strong> Yakın çevredeki yönü tarif eder.</li><li><strong>Öte yanı.</strong> Sokağın, mahallenin veya nesnenin diğer tarafı.</li></ol>

<h2>Muhabbetin akışında</h2>
<ol start="11"><li><strong>Napacayık?</strong> “Ne yapacağız?” Bazen gerçek soru, bazen hayat yorumu.</li><li><strong>Yavaş yavaş.</strong> İşlerin aceleye gelmemesi gerektiğini anlatan ada felsefesi.</li><li><strong>İş o iş.</strong> Konunun kapandığını veya çözümün belli olduğunu söyler.</li><li><strong>Ma?</strong> Şaşkınlık, itiraz veya vurgu; anlamı ses tonunda gizlidir.</li><li><strong>Hade.</strong> “Haydi”den daha çok iş yapar: vedalaşma, cesaret verme ve sohbeti bitirme.</li></ol>

<p>Bu ifadeleri hemen taklit etmek yerine önce dinlemek daha iyidir. Ağız, yalnız kelimelerle değil; tonlama ve bağlamla yaşar. Yanlış söylemek sorun değildir, fakat insanları konuşma biçimleri üzerinden karikatürleştirmemek önemlidir.</p>
    `,
  }),
  editorial({
    slug: "kibris-kahvaltisi-sofrasinda-ne-var",
    title: "Kıbrıs Kahvaltısı: Sofrada Ne Var, Ne Nasıl Yenir?",
    excerpt: "Hellimden çakıstese, zeytinden macuna; iyi bir Kıbrıs kahvaltısını ürün listesinden çıkarıp gerçek bir sofra ritüeline dönüştüren ayrıntılar.",
    category: "Yemek",
    published_at: "2026-08-23T09:15:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666",
    content: `
<p>Kıbrıs kahvaltısı tek tabakta servis edilen bir öğün değil, sofraya parça parça yerleşen bir paylaşma biçimidir. İyi bir masada peynir, zeytin ve ekmek kadar mevsim, ev yapımı reçeller ve sohbetin süresi de önemlidir.</p>

<h2>Sofranın omurgası: hellim ve zeytin</h2>
<p>Hellim çiğ, tavada veya ızgarada gelebilir. Taze hellim daha yumuşak ve sütlü; olgun hellim daha tuzlu ve sıkıdır. Yanındaki zeytin bazen sade, bazen kişniş tohumu ve limonla ezilmiş “çakıstes” biçimindedir. Çakıstesi çekirdeğiyle yemek ve tabağa küçük parçalar hâlinde almak sofranın doğal ritmidir.</p>

<h2>Ekmek, yumurta ve yeşillik</h2>
<p>Köy ekmeği, kızarmış ekmek veya pide; hellimin tuzunu dengeler. Yumurta sade gelebileceği gibi hellimle ya da taze otlarla da pişirilebilir. Domates, salatalık, nane ve zahter gibi yeşillikler yaz sofrasını hafifletir.</p>

<h2>Tatlı köşe: macun ve reçeller</h2>
<p>Ceviz, turunç, bergamot veya karpuz kabuğu macunu küçük porsiyonlarla sunulur. Macun reçel gibi ekmeğe bolca sürülmekten çok, suyla birlikte birkaç lokmada tadılır. Ev yapımı olduğu söylendiğinde tarifini sormak çoğu zaman uzun ve güzel bir sohbet başlatır.</p>

<h2>Çay mı kahve mi?</h2>
<p>Kahvaltı boyunca çay, sonunda Kıbrıs kahvesi içmek yaygındır. Kahveyi sade, orta veya şekerli istediğinizi baştan söyleyin. Yanındaki su kahveden önce damağı temizlemek için kullanılabilir.</p>

<h2>İyi kahvaltının ölçüsü</h2>
<p>Çeşit sayısı değil, ürünlerin mevsiminde ve özenli olması belirleyicidir. Yerel üretici kullanan, hellimin nereden geldiğini söyleyebilen ve masayı gereksiz paketli ürünlerle doldurmayan mekânlar genellikle daha iyi bir deneyim sunar.</p>
    `,
  }),
  editorial({
    slug: "girnede-kalabaliktan-uzak-bir-gun",
    title: "Girne'de Kalabalıktan Uzak Bir Gün Nasıl Geçirilir?",
    excerpt: "Liman kalabalığına sıkışmadan denizi, dağ eteklerini ve sakin mahalleleri bir güne sığdıran dengeli Girne planı.",
    category: "Gezi",
    published_at: "2026-08-22T10:00:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1677023484291-005b9840132f",
    content: `
<p>Girne'nin en bilinen yerleri aynı zamanda en yoğun noktalarıdır. Oysa doğru saatleri seçerek ve merkezden birkaç kilometre uzaklaşarak şehrin denizle dağ arasındaki sakin karakterini görmek mümkündür.</p>

<h2>Güne erken başlayın</h2>
<p>Sabahın ilk saatlerinde kıyı yürüyüşü yapın. Güneş yükselmeden hava serin, deniz yüzeyi daha sakindir. Limanı görmek istiyorsanız bunu kahvaltıdan önce yapın; servis araçları ve günübirlik ziyaretçiler gelmeden mimariyi daha rahat okuyabilirsiniz.</p>

<h2>Kahvaltı için ara sokağa sapın</h2>
<p>Manzaralı ilk sıradaki masalar yerine, merkezden biraz içeride yerel müşterisi olan küçük işletmelere bakın. Kısa menü, günlük hazırlanan ürün ve sakin servis; fotoğraftan daha iyi bir kalite işaretidir.</p>

<h2>Öğle sıcağında dağ eteği</h2>
<p>Öğlen saatlerini açık plajda geçirmek yerine Bellapais çevresindeki gölgeli sokaklara veya batıdaki köylere ayırın. Taş duvarlar ve ağaçlıklı avlular kıyıya göre daha serin bir mola sağlar. İbadethane ve tarihî yapılarda güncel ziyaret saatlerini kontrol edin.</p>

<h2>Deniz için geç saat</h2>
<p>Plaja 17.00 sonrasında gitmek hem sıcak hem kalabalık açısından avantajlıdır. Şezlong hizmeti yerine doğal kıyıyı tercih ediyorsanız su, gölge ve atık poşeti götürün. Rüzgâr yükselmişse kıyı koşullarını yerinde değerlendirin.</p>

<h2>Akşamı mahallede bitirin</h2>
<p>Günü limanın en yoğun restoranlarında değil, mahalle meyhanesinde veya küçük bir avluda tamamlayın. Rezervasyon yaparken canlı müzik ve masa düzenini sormak, aradığınız sakinliğin gerçekten olup olmadığını anlamanıza yardım eder.</p>
    `,
  }),
  editorial({
    slug: "magusa-surlaricini-yuruyerek-kesfetme-rehberi",
    title: "Mağusa Surlariçi'ni Yürüyerek Keşfetme Rehberi",
    excerpt: "Taşın, gölgenin ve farklı dönemlerin iç içe geçtiği Mağusa'da; kapıdan meydana uzanan sade ve saygılı bir yürüyüş planı.",
    category: "Gezi",
    published_at: "2026-08-21T12:00:00+03:00",
    cover_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Fortress_of_Famagusta_%28Cyprus%29.jpg/1920px-Fortress_of_Famagusta_%28Cyprus%29.jpg",
    content: `
<p>Mağusa Surlariçi kompakt görünür ama hızlı geçildiğinde ayrıntılarını saklar. Kentin gücü tek tek yapılardan çok, dar sokaklarda değişen ışıkta ve farklı dönemlerin yan yana duruşundadır.</p>

<h2>Girişte yönünüzü belirleyin</h2>
<p>Surların içine girdikten sonra önce ana meydanı referans alın. Telefon haritasına sürekli bakmak yerine kuleleri, meydanı ve deniz yönünü zihninizde konumlandırın. Böylece ara sokaklara saparken kaybolma hissi rahatsız edici değil, keşfin parçası olur.</p>

<h2>Meydanı yalnız fotoğraflamayın</h2>
<p>Meydan çevresindeki yapıların cephelerine, taş işçiliğine ve sonradan eklenen katmanlara dikkat edin. Bir yapıyı tek kimliğe indirgemek yerine farklı dönemlerde nasıl kullanıldığını okuyun. İç mekânlarda ibadet ve ziyaret kurallarına uyun.</p>

<h2>Ara sokaklarda gündelik hayat</h2>
<p>Ana güzergâhtan ayrıldığınızda küçük atölyeler, avlular ve konutlarla karşılaşırsınız. Bu bölge açık hava dekoru değil, yaşayan bir mahalledir. Özel mülkleri fotoğraflamamak ve yüksek sesle grup hâlinde ilerlememek basit ama önemli bir saygı göstergesidir.</p>

<h2>Öğle molasını doğru kurun</h2>
<p>Yazın taş yüzeyler ısıyı artırır. Öğlen saatlerinde gölgeli bir avluda mola verin; su tüketimini yürüyüş sonuna bırakmayın. Sonbahar ve ilkbahar daha uzun rota kurmak için idealdir.</p>

<h2>Gün batımına doğru surlar</h2>
<p>Işık yumuşadığında surların rengi değişir. Güvenli ve ziyarete açık bölümlerde yürüyerek kentin ölçeğini yukarıdan okumak etkileyicidir. Kapanış saatleri mevsime göre değişebileceği için aynı gün teyit edin.</p>
    `,
  }),
  editorial({
    slug: "karpaz-yolculugu-yola-cikmadan-bilmeniz-gerekenler",
    title: "Karpaz Yolculuğu: Yola Çıkmadan Bilmeniz Gereken 12 Şey",
    excerpt: "Uzun yollar, küçük köyler, hassas doğal alanlar ve beklenmedik molalar: Karpaz'ı tüketmeden deneyimlemek için pratik rehber.",
    category: "Gezi",
    published_at: "2026-08-20T08:30:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1643856555536-2b66caa1de1f",
    content: `
<p>Karpaz'a gitmek haritada bir noktaya ulaşmak değil, yolun temposunu kabul etmektir. Mesafeler kısa görünse de köy geçişleri, manzara molaları ve dar yollar planı uzatır. Bu nedenle günü “kaç yer görürüz?” hesabıyla değil, güvenli ve sakin bir akışla kurun.</p>

<ol><li><strong>Depoyu erkenden doldurun.</strong> Yakıt istasyonları seyrekleşebilir.</li><li><strong>Çevrimdışı harita indirin.</strong> Bazı kesimlerde bağlantı zayıflayabilir.</li><li><strong>Su ve hafif yiyecek taşıyın.</strong> Her durakta açık işletme bulacağınızı varsaymayın.</li><li><strong>Gün ışığını hesaplayın.</strong> Dönüşü karanlığa bırakmamak sürüşü kolaylaştırır.</li><li><strong>Yol üstü hayvanlara dikkat edin.</strong> Hızı düşürün; araç içinden beslemeyin.</li><li><strong>Kumlu yollara temkinli girin.</strong> Aracın ve sigortanın koşullarını bilin.</li></ol>

<h2>Doğal alanlarda ziyaretçi olmak</h2>
<ol start="7"><li><strong>İşaretli yollarda kalın.</strong> Bitki örtüsünü ve yuvalama alanlarını ezmeyin.</li><li><strong>Çöpünüzü geri götürün.</strong> Küçük kutuların dolu olabileceğini hesaba katın.</li><li><strong>Yüksek sesli müziği bırakın.</strong> Karpaz'ın deneyimi sessizlikle güçlenir.</li><li><strong>İbadethanelerde kuralları sorun.</strong> Kıyafet ve fotoğraf konusunda yerel yönlendirmeyi izleyin.</li></ol>

<h2>Planı esnek bırakın</h2>
<ol start="11"><li><strong>Köy molalarına zaman ayırın.</strong> Yolculuğun hafızada kalan kısmı çoğu zaman plansız çay molasıdır.</li><li><strong>Hava ve yol koşullarını aynı gün kontrol edin.</strong> Rüzgâr, yağış ve bakım çalışmaları rotayı etkileyebilir.</li></ol>

<p>Karpaz'da iyi gezi, bölgeyi arka fon gibi kullanmak yerine onun kırılganlığına uyum sağlamaktır. Daha az durak, daha fazla dikkat çoğu zaman daha zengin bir gün bırakır.</p>
    `,
  }),
  editorial({
    slug: "kibris-mezesi-nasil-yenir",
    title: "Kıbrıs Mezesi Nasıl Yenir? Masaya Oturmadan Önce Bilmeniz Gerekenler",
    excerpt: "Birbirini izleyen tabakları yarışa çevirmeden, sıcakları kaçırmadan ve yerel sofranın paylaşma kültürünü anlayarak meze yemenin incelikleri.",
    category: "Yemek",
    published_at: "2026-08-19T19:00:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1547592180-85f173990554",
    content: `
<p>Kıbrıs mezesi, masaya aynı anda dizilen küçük tabaklardan ibaret değildir. Soğuklarla başlayıp sıcaklara ilerleyen, ritmi mutfakla masa arasında kurulan uzun bir öğündür. En yaygın hata, ilk gelenleri ana yemek sanıp gereğinden hızlı doymaktır.</p>

<h2>İlk tur: iştah açan küçük tabaklar</h2>
<p>Zeytin, çakıstes, cacık, tahin, humus, salata ve turşular masayı açar. Ekmek tüketimini baştan kontrol etmek önemlidir. Her tabaktan az almak, sonraki sıcaklara yer bırakır.</p>

<h2>Ara sıcaklar ve mevsim</h2>
<p>Hellim, börek, mantar, kabak veya çiçek dolması gibi tabaklar mevsime ve işletmeye göre değişir. İyi bir meze menüsü her gün aynı sayıyı tamamlamaya çalışmaz; mutfağın o gün iyi hazırladığı ürünleri öne çıkarır.</p>

<h2>Ana sıcaklar geldiğinde</h2>
<p>Izgara etler, şeftali kebabı veya deniz ürünleri sona doğru servis edilir. Masada yer açmak için biten tabakları toplatın. Her sıcak tabağı bekletmeden tadın; özellikle hellim ve ızgara ürünler soğuduğunda karakterini hızla kaybeder.</p>

<h2>Sipariş verirken sorulacak üç soru</h2>
<ul><li>Meze kişi başı mı, masa için mi fiyatlanıyor?</li><li>Sıcaklarda hangi ürünler var ve porsiyon sayısı nasıl?</li><li>Vejetaryen veya alerjen ihtiyacına göre uyarlama yapılabiliyor mu?</li></ul>

<p>Meze masasının amacı tabak sayısını tamamlamak değil, sohbeti uzatmaktır. Yavaş yiyin, paylaşın ve mutfağın ritmine izin verin. İyi bir meze deneyiminin sonunda en çok hatırlanan şey çoğu zaman tek bir tabak değil, masanın kendisidir.</p>
    `,
  }),
  editorial({
    slug: "molohiya-yemegi-ve-adanin-hafizasi",
    title: "Molohiya: Bir Tencere Yemeğinin Taşıdığı Ada Hafızası",
    excerpt: "Kurutulan yapraktan sabırla pişen tencereye; molohiyanın Kıbrıs mutfağındaki yerini, tadını ve sofradaki anlamını anlatan rehber.",
    category: "Yemek",
    published_at: "2026-08-18T13:00:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1574484284002-952d92456975",
    content: `
<p>Molohiya ilk kez gören için sade bir yaprak yemeği gibi durabilir. Kıbrıs'ta ise yazın toplanan ürünün kurutulması, saklanması ve serin aylarda tencereye girmesiyle mevsimleri birbirine bağlayan bir ev yemeğidir.</p>

<h2>Molohiya nedir?</h2>
<p>Molohiya, yaprakları kullanılan bir bitkidir. Kıbrıs usulünde yapraklar çoğunlukla kurutulur; et veya tavuk, domates, soğan, sarımsak ve limonla uzun süre pişirilir. Tarif evden eve değişir. Bazı aileler ekşiliği artırır, bazıları suyu daha koyu bırakır.</p>

<h2>Lezzetin anahtarı: sabır</h2>
<p>Kuru yaprakların doğru biçimde ayıklanması ve yemeğin aceleye getirilmemesi önemlidir. Fazla karıştırmak yapıyı bozabilir; az pişirmek ise yaprağın sert kalmasına neden olur. İyi molohiya, taneli dokusunu korurken sosla bütünleşir.</p>

<h2>Nasıl servis edilir?</h2>
<p>Pirinç pilavı, yoğurt veya turşuyla servis edilebilir. Limon, yemeğin bitkisel ve etli karakterini dengeler. İlk kez deniyorsanız küçük porsiyonla başlayın; molohiyanın aroması tanıdık yemeklerden farklı olabilir.</p>

<h2>Neden kültürel olarak önemli?</h2>
<p>Molohiya yalnız restoran yemeği değildir. Kurutma hazırlığı, aile içi tarif farkları ve “kimin yaptığı daha iyi?” tartışması onu gündelik hafızanın parçası yapar. Bir tarifi öğrenirken ölçüler kadar, yemeği yapan kişinin hangi aşamayı neden öyle yaptığını dinlemek gerekir.</p>

<p>Ugavole'nin notu: İyi yerel mutfak yazısı yalnız malzemeyi saymaz; o yemeğin hangi mevsimde, kimlerle ve hangi emekle sofraya geldiğini de anlatır.</p>
    `,
  }),
  editorial({
    slug: "seftali-kebabi-adi-nereden-geliyor",
    title: "Şeftali Kebabının Şeftaliyle İlgisi Var mı?",
    excerpt: "Kıbrıs'ın en çok yanlış anlaşılan lezzetlerinden birinin adını, hazırlanışını ve iyi porsiyonu ayırt etmenin yollarını açıklıyoruz.",
    category: "Yemek",
    published_at: "2026-08-17T18:15:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd",
    content: `
<p>Şeftali kebabını ilk kez duyanların çoğu tarifte meyve arar. Oysa bu Kıbrıs klasiğinin şeftaliyle ilgisi yoktur. Yaygın anlatı, adın yemeği hazırlayan “Şef Ali”nin zamanla değişen söylenişinden geldiği yönündedir; ancak sözlü kültürde farklı anlatımlar da bulunur.</p>

<h2>Nasıl hazırlanır?</h2>
<p>Kıyma; soğan, maydanoz ve baharatlarla yoğrulur. Harç küçük rulolar hâline getirilip gömlek yağına sarılır ve ızgarada pişirilir. Gömlek yağı doğru ısıda eriyerek iç harcı nemli tutar, dış yüzeyde ise ince bir kızarıklık oluşturur.</p>

<h2>İyi şeftali kebabı nasıl anlaşılır?</h2>
<ul><li>Dışı yanık değil, dengeli kızarmış olmalıdır.</li><li>İç harç kuru veya aşırı yağlı kalmamalıdır.</li><li>Soğan ve maydanoz eti bastırmak yerine tamamlamalıdır.</li><li>Piştikten sonra uzun süre bekletilmeden servis edilmelidir.</li></ul>

<h2>Yanına ne gelir?</h2>
<p>Pide, soğan-maydanoz karışımı, domates, yoğurt veya meze çeşitleriyle servis edilebilir. Büyük bir meze masasının son sıcaklarından biri olarak geldiğinde porsiyonu paylaşmak daha dengeli olur.</p>

<h2>Sipariş verirken</h2>
<p>Porsiyondaki adet ve yanında gelenleri sorun. Her işletmenin ölçüsü farklıdır. Alerjen veya beslenme hassasiyetiniz varsa içeriği teyit edin; gömlek yağı tarifin temel parçasıdır.</p>

<p>Şeftali kebabını özel yapan şey şaşırtıcı adı değil, basit malzemeyi doğru ısı ve oranla güçlü bir lezzete dönüştürmesidir.</p>
    `,
  }),
  editorial({
    slug: "kibrista-pazar-alisverisinin-yazilmamis-kurallari",
    title: "Kıbrıs'ta Pazar Alışverişinin Yazılmamış Kuralları",
    excerpt: "Mevsimi takip etmekten ürüne dokunmadan önce sormaya; yerel pazarda daha iyi alışveriş yapmanın incelikleri.",
    category: "Yaşam",
    published_at: "2026-08-16T10:30:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9",
    content: `
<p>Semt ve belediye pazarları, adanın mevsimini en hızlı okuyabileceğiniz yerlerdir. Aynı tezgâhta sebze, ot, ev yapımı ürün ve uzun bir sohbet bulabilirsiniz. İyi alışveriş, yalnız en düşük fiyatı aramakla değil, ürünün hikâyesini anlamakla başlar.</p>

<h2>Erken gitmek her zaman daha iyi mi?</h2>
<p>Sabah saatlerinde seçenek fazladır ve sıcak ürünleri daha az yorar. Kapanışa doğru bazı fiyatlar düşebilir, ancak aradığınız ürün tükenmiş olabilir. Fotoğraf ve sakin keşif için ilk saatler; esnek bütçe için gün sonu avantajlıdır.</p>

<h2>Ürüne dokunmadan önce sorun</h2>
<p>Bazı tezgâhlarda seçimi müşteri yapar, bazılarında satıcı. “Seçebilir miyim?” demek küçük ama yerinde bir nezakettir. Ezilen ürünler ve açılan paketler satıcı için doğrudan kayıptır.</p>

<h2>Mevsimi takip edin</h2>
<p>Her ürünü yıl boyunca aramak yerine o hafta neyin iyi olduğunu sorun. Yerel otlar, turunçgiller, enginar, karpuz veya üzüm gibi ürünlerin en iyi dönemi kısa olabilir. Tezgâh sahibinin önerisi çoğu zaman internet listesinden daha günceldir.</p>

<h2>Ev yapımı ürünlerde üç soru</h2>
<ul><li>Ne zaman hazırlandı?</li><li>Nasıl saklanmalı?</li><li>Açıldıktan sonra ne kadar sürede tüketilmeli?</li></ul>

<h2>Yanınızda bulundurun</h2>
<p>Bez çanta, küçük bozuk para ve yazın su taşıyın. Sıcak havada süt ürünü veya et alacaksanız pazarı son durağa bırakın ve ürünü kısa sürede soğuk ortama ulaştırın.</p>

<p>Pazarın en değerli yanı yalnız alışveriş değildir. Düzenli gittiğinizde üreticiyi tanır, mevsim değişimini fark eder ve adanın gündelik hayatına daha yakından bakarsınız.</p>
    `,
  }),
  editorial({
    slug: "adada-ogrenci-olmanin-12-kisa-yolu",
    title: "Adada Öğrenci Olmanın 12 Kısa Yolu: İlk Ay Rehberi",
    excerpt: "Hat, ulaşım, bütçe, ev arkadaşlığı ve sosyal çevre: Kuzey Kıbrıs'a yeni gelen öğrencilerin ilk ayını kolaylaştıracak gerçekçi öneriler.",
    category: "Yaşam",
    published_at: "2026-08-15T15:00:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
    content: `
<p>Kuzey Kıbrıs'ta öğrenciliğin ilk haftaları tatil hissiyle başlayıp ulaşım, ev ve bütçe gerçekleriyle hızla değişebilir. İyi başlangıç, her şeyi ilk günde çözmek değil; kritik işleri doğru sıraya koymaktır.</p>

<ol><li><strong>İlk gün yerel telefon hattını araştırın.</strong> Kampüs ve ev çevresindeki kapsama durumunu arkadaşlarınıza sorun.</li><li><strong>Ulaşım saatlerini ekran görüntüsü olarak saklayın.</strong> Son seferler günün planını belirler.</li><li><strong>Ev-kampüs mesafesini yürüyerek test edin.</strong> Haritadaki kısa rota sıcak, yokuş veya kaldırım eksikliği nedeniyle zor olabilir.</li><li><strong>İlk ay bütçesini haftalara bölün.</strong> Depozito ve başlangıç alışverişi günlük harcama hissini yanıltır.</li><li><strong>Marketleri tek fiyatla değerlendirmeyin.</strong> Temel ürün, taze ürün ve kampanya dengesi mağazaya göre değişir.</li><li><strong>Ev arkadaşlığı kurallarını yazın.</strong> Fatura, temizlik, misafir ve ortak alışverişi baştan konuşun.</li></ol>

<h2>Gündelik hayatı kolaylaştıranlar</h2>
<ol start="7"><li><strong>Yeniden doldurulabilir su şişesi taşıyın.</strong></li><li><strong>Resmî işlemler için belge kopyası hazırlayın.</strong> Güncel gereklilikleri üniversitenizden teyit edin.</li><li><strong>Kampüs kulüplerine ilk ay bakın.</strong> Sosyal çevreyi yalnız sınıfa bırakmayın.</li><li><strong>Acil numaraları ve en yakın sağlık noktasını kaydedin.</strong></li><li><strong>İkinci el gruplarında ürünü görmeden ödeme yapmayın.</strong></li><li><strong>Adayı yavaş keşfedin.</strong> Her hafta tek bir yeni mahalle veya rota seçmek bütçeyi de enerjiyi de korur.</li></ol>

<p>En önemli kural: Bir arkadaşın deneyimini resmî kural sanmayın. İkamet, kayıt, çalışma ve sigorta gibi konularda üniversitenizin güncel birimlerinden bilgi alın.</p>
    `,
  }),
  editorial({
    slug: "kuzey-kibrista-ev-kiralarken-kontrol-listesi",
    title: "Kuzey Kıbrıs'ta Ev Kiralarken 18 Maddelik Kontrol Listesi",
    excerpt: "Manzaraya kapılmadan önce rutubet, su basıncı, klima, depozito ve envanteri kontrol etmek için oda oda uygulanabilir rehber.",
    category: "Yaşam",
    published_at: "2026-08-14T12:30:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
    content: `
<p>Ev ilanındaki geniş açı fotoğraf ve deniz manzarası, günlük yaşam kalitesini belirleyen ayrıntıları gizleyebilir. Evi mümkünse gündüz görün; sözlü vaatleri değil, mevcut durumu ve imzalanacak metni esas alın.</p>

<h2>Binaya ve çevreye bakın</h2>
<ol><li>Akşam ulaşımı ve sokak aydınlatmasını kontrol edin.</li><li>Telefon çekimi ve internet seçeneklerini sorun.</li><li>Otoparkın daireye tahsisli olup olmadığını öğrenin.</li><li>Ortak alan aidatının neleri kapsadığını yazılı görün.</li><li>Çöp toplama, jeneratör ve su deposu düzenini sorun.</li></ol>

<h2>Evin içinde deneyin</h2>
<ol start="6"><li>Tüm muslukları açıp su basıncına bakın.</li><li>Tavan, dolap arkası ve pencere çevresinde rutubet izi arayın.</li><li>Klimaları hem soğuk hem sıcak modda çalıştırın.</li><li>Priz, ocak, fırın ve sıcak su sistemini deneyin.</li><li>Pencerelerin kapanmasını ve sineklikleri kontrol edin.</li><li>Mobilyalı evde her parçanın fotoğraflı envanterini çıkarın.</li></ol>

<h2>Sözleşmeden önce</h2>
<ol start="12"><li>Kira para birimi ve ödeme gününü netleştirin.</li><li>Depozitonun iade koşullarını yazdırın.</li><li>Bakım ve arıza sorumluluğunu maddeler hâlinde görün.</li><li>Erken çıkış, yenileme ve artış koşullarını okuyun.</li><li>Aboneliklerin kimin adına olduğunu kontrol edin.</li><li>Ödeme karşılığında belge veya makbuz alın.</li><li>Anlamadığınız maddeler için bağımsız uzman görüşü alın.</li></ol>

<p>Bu liste hukuki danışmanlık değildir; amacı görüşmede unutulan pratik noktaları görünür kılmaktır. İmza atmadan önce sözleşmenin güncel yerel kurallara uygunluğunu yetkin bir uzmana kontrol ettirin.</p>
    `,
  }),
  editorial({
    slug: "kibrista-araba-kullanmanin-yazilmamis-kurallari",
    title: "Kıbrıs'ta Araba Kullanmanın Yazılmamış Kuralları",
    excerpt: "Soldan trafik, dar köy yolları, kavşaklar ve yaz sıcağı: direksiyona geçmeden önce bilmeniz gereken sakin sürüş rehberi.",
    category: "Yaşam",
    published_at: "2026-08-13T08:45:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d",
    content: `
<p>Kıbrıs'ta araç kullanmak, soldan trafiğe alıştıktan sonra kolay görünür. Asıl fark; kavşaklarda, dar köy yollarında ve yaz sıcaklarında ortaya çıkar. Güvenli sürüş, yerel alışkanlıklara körü körüne uymak değil, beklenmeyeni hesaba katmaktır.</p>

<h2>İlk gün için üç temel alışkanlık</h2>
<ul><li>Dönüşlerde “sol şerit” kontrolünü sesli tekrar edin.</li><li>Kavşağa yaklaşırken yalnız sağa değil iki yöne de bakın.</li><li>Sinyal ve silecek kollarının aracınıza göre yerini hareket etmeden deneyin.</li></ul>

<h2>Döner kavşaklarda acele etmeyin</h2>
<p>Şerit işaretlerini kavşağa girmeden okuyun. Çıkışı kaçırdıysanız ani şerit değişimi yapmak yerine bir tur daha dönün. Motosiklet ve bisikletleri aynada kısa süreli kaybetmenin mümkün olduğunu unutmayın.</p>

<h2>Köy ve dağ yolları</h2>
<p>Dar yolda karşılaşınca geçiş üstünlüğünü varsaymayın; güvenli genişlikte durup iletişim kurun. Kör virajlarda hız azaltın. Yol kenarındaki hayvanlar, bisikletliler ve yürüyenler için kaçış alanı bırakın.</p>

<h2>Yaz sıcağında araç</h2>
<p>Lastik basıncı, soğutma sistemi ve klima uzun yol öncesi kontrol edilmelidir. Çocuk, hayvan veya elektronik eşyayı park hâlindeki araçta bırakmayın. Direksiyon ve metal yüzeyler kısa sürede tehlikeli derecede ısınabilir.</p>

<h2>Kiralık araçta</h2>
<p>Aracı teslim alırken mevcut hasarı video ile kaydedin; yakıt, kilometre, yol yardımı ve sigorta kapsamını okuyun. Toprak veya kumlu yollara ilişkin sınırlamalar sözleşmede ayrıca bulunabilir.</p>

<p>En iyi ada sürücülüğü hızlı olmak değil, yolu başkalarıyla paylaşacak kadar öngörülü olmaktır.</p>
    `,
  }),
  editorial({
    slug: "kibrista-gun-batimi-izlemek-icin-7-sakin-nokta",
    title: "Kıbrıs'ta Gün Batımını İzlemek İçin 7 Sakin Nokta Türü",
    excerpt: "Kalabalık mekân listesi yerine batıya açık kıyı, dağ eteği ve köy meydanı gibi doğru manzarayı kendiniz bulmanızı sağlayan rehber.",
    category: "Gezi",
    published_at: "2026-08-12T17:30:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    content: `
<p>İyi gün batımı noktası her zaman en çok paylaşılan konum değildir. Ufkun açıklığı, dönüş yolunun güvenliği ve mevsimsel güneş açısı fotoğraftan daha önemlidir. Aşağıdaki yedi nokta türü, kendi sakin yerinizi bulmanıza yardım eder.</p>

<ol><li><strong>Batıya açık kıyı yürüyüşleri:</strong> Ufku bina kesmediğinde günün son ışığı uzun sürer.</li><li><strong>Alçak kayalık burunlar:</strong> Deniz ve kara çizgisini birlikte görürsünüz; dalga koşullarında kenardan uzak durun.</li><li><strong>Zeytinlik kenarları:</strong> Ağaç silüetleri fotoğrafa derinlik katar. Özel mülke girmeyin.</li><li><strong>Dağ eteğindeki seyir cepleri:</strong> Kıyıyı yukarıdan izlemek için güvenli park alanı bulunan noktaları seçin.</li><li><strong>Köy meydanları:</strong> Manzara kadar gündelik hayatı da görürsünüz; çevreyi kapatmadan oturun.</li><li><strong>Sakin balıkçı barınakları:</strong> Tekne silüetleri güçlüdür, ancak çalışma alanlarını ve geçişleri açık bırakın.</li><li><strong>Kış kıyıları:</strong> Hava daha değişken olsa da bulutlar ve düşük açıdaki ışık dramatik görüntüler yaratır.</li></ol>

<h2>Gitmeden önce</h2>
<p>Gün batımı saatini ve bulut durumunu kontrol edin. Konuma en az 30 dakika önce varın. Dönüş karanlığa kalacaksa aydınlatma ve yol durumunu hesaba katın.</p>

<h2>Fotoğraf için küçük not</h2>
<p>Güneşi doğrudan merkeze koymak zorunda değilsiniz. Ön planda taş, ağaç veya insan silüeti kullanın; birkaç kareden sonra telefonu indirip manzarayı çıplak gözle izleyin.</p>

<p>Doğal alanda iz bırakmayın. Sessizlik, karanlık ve temiz ufuk bu deneyimin asıl parçasıdır.</p>
    `,
  }),
  editorial({
    slug: "kibris-kedileri-adanin-gorunmez-ev-sahipleri",
    title: "Kıbrıs Kedileri: Adanın Görünmez Ev Sahipleri",
    excerpt: "Avlulardan limanlara her yerde karşımıza çıkan kedilere romantik bir ada dekoru olarak değil, sorumluluk isteyen kent sakinleri olarak bakmak.",
    category: "Kültür",
    published_at: "2026-08-11T14:00:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    content: `
<p>Kıbrıs'ta bir kafeye oturup birkaç dakika içinde masanın yanında kedi görmemek neredeyse şaşırtıcıdır. Kediler limanlarda, üniversite kampüslerinde, köy meydanlarında ve apartman avlularında gündelik hayatın parçasıdır. Fakat onları yalnız fotojenik ada karakterleri olarak görmek eksik kalır.</p>

<h2>Neden bu kadar görünürler?</h2>
<p>Ilıman iklim, açık yaşam alanları ve insanlar tarafından düzenli beslenmeleri kedilerin kent içinde görünürlüğünü artırır. Bazıları belirli işletmeler veya mahalle sakinleri tarafından takip edilir; bazıları ise sağlık ve beslenme desteğine erişemez.</p>

<h2>Beslemek istiyorsanız</h2>
<ul><li>Yol ve araç geçişinden uzak, sabit bir nokta seçin.</li><li>Bozulabilecek yiyecekleri sıcak havada bırakmayın.</li><li>Temiz suyu geniş ve devrilmeyecek bir kapta sunun.</li><li>Kap ve ambalajları çevrede bırakmayın.</li><li>İşletme veya apartman sakinleriyle ortak bir düzen kurun.</li></ul>

<h2>Yavru kedi gördüğünüzde</h2>
<p>Yavruyu hemen annesinden ayrılmış varsaymayın. Güvenli mesafeden bir süre gözlemleyin. Yaralı, ciddi biçimde halsiz veya tehlikeli noktadaysa yerel veteriner ve hayvan gönüllüleriyle iletişime geçin.</p>

<h2>Kalıcı çözüm</h2>
<p>Düzenli besleme kadar kısırlaştırma, aşılama ve sağlık takibi önemlidir. Tek başına yiyecek bırakmak nüfus ve hastalık sorununu çözmez. Mahalle temelli, veteriner destekli programlar daha sürdürülebilir sonuç verir.</p>

<p>Kediler adanın dekoru değil, şehir yaşamının paydaşlarıdır. İyi niyeti düzenli bakım ve sorumlu davranışla birleştirmek gerekir.</p>
    `,
  }),
  editorial({
    slug: "yagmurlu-bir-kibris-gununde-yapilacak-9-sey",
    title: "Yağmurlu Bir Kıbrıs Gününde Yapılacak 9 Şey",
    excerpt: "Plaj planı iptal olduğunda günü kayıp saymamak için kahveden müzeye, çarşıdan ev mutfağına uzanan ada programı.",
    category: "Eğlence",
    published_at: "2026-08-10T10:00:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0",
    content: `
<p>Kıbrıs denince akla güneş gelir; bu yüzden yağmur başladığında plan tamamen bozulmuş gibi hissedilebilir. Oysa kısa kış günleri ve beklenmedik sağanaklar, adanın kapalı mekân kültürünü keşfetmek için iyi bir bahanedir.</p>

<ol><li><strong>Uzun bir kahvaltı kurun.</strong> Hızlı servis yerine avlusu kapalı veya içerisi sakin bir yer seçin.</li><li><strong>Kıbrıs kahvesi tadımı yapın.</strong> Sade, orta ve farklı kavrumları karşılaştırın.</li><li><strong>Yerel müze veya sergiye gidin.</strong> Açılış saatlerini çıkmadan önce kontrol edin.</li><li><strong>Bandabuliya ve kapalı çarşıları gezin.</strong> Islak sokaklarda koşmak yerine tek bölgede yavaşlayın.</li><li><strong>Bir sahaf veya kitapçı bulun.</strong> Ada tarihi, yemek kültürü ya da yerel yazarlar bölümüne bakın.</li><li><strong>Evde hellimli tarif deneyin.</strong> Fırın, tava veya tostla kısa bir ada mutfağı atölyesi kurun.</li><li><strong>Kıbrıslıca mini sözlük hazırlayın.</strong> O gün duyduğunuz ifadeleri not edip anlamlarını sorun.</li><li><strong>Yağmur sonrası fotoğraf yürüyüşü yapın.</strong> Zemin yansımaları ve yumuşak ışık Surlariçi'nde farklı bir atmosfer yaratır.</li><li><strong>Akşamı masa oyununa ayırın.</strong> Tavla, iskambil veya kalabalık bir quiz gecesi planlayın.</li></ol>

<h2>Güvenlik notu</h2>
<p>Şiddetli yağışta su biriken alt geçit ve yollara girmeyin. Sürüşte takip mesafesini artırın; taş sokakların ve kaldırım yüzeylerinin kayganlaşabileceğini unutmayın.</p>

<p>Yağmurlu günün avantajı, normalde hızlı geçtiğiniz yerlerde daha uzun kalmaya izin vermesidir. Planı küçültün, günü değil.</p>
    `,
  }),
  editorial({
    slug: "ada-zamanina-alistiginizi-gosteren-11-isaret",
    title: "Ada Zamanına Alıştığınızı Gösteren 11 İşaret",
    excerpt: "Mesafeyi kilometreyle değil virajla ölçüyor, kahve molasını toplantının parçası sayıyorsanız ada ritmi size de bulaşmış olabilir.",
    category: "Eğlence",
    published_at: "2026-08-09T16:00:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1501139083538-0139583c060f",
    content: `
<p>Ada zamanı, hiçbir işin vaktinde yapılmaması demek değildir. Daha çok mesafeyi, sohbeti ve günü anakaradaki hızdan farklı ölçmektir. Aşağıdaki belirtilerin çoğu tanıdık geliyorsa artık yalnız Kıbrıs'ta yaşamıyor, Kıbrıs ritmiyle yaşıyor olabilirsiniz.</p>

<ol><li>Bir yere olan mesafeyi kilometreyle değil, “iki kavşak sonrası” diye anlatıyorsunuz.</li><li>Kahve molasını program dışı değil, programın kendisi sayıyorsunuz.</li><li>Güneşli hava tahminini haber değeri taşımayan varsayılan durum olarak görüyorsunuz.</li><li>Deniz görmeden geçen birkaç gün size uzun geliyor.</li><li>“Hade” kelimesini hem başlarken hem vedalaşırken kullanıyorsunuz.</li><li>Bir tanıdığa rastlama ihtimalini hesaba katmadan çarşı planı yapmıyorsunuz.</li><li>En iyi hellimin nereden alınacağı konusunda güçlü ve tartışmaya kapalı bir fikriniz var.</li><li>On dakikalık yol için su şişesi, güneş gözlüğü ve klima planı yapıyorsunuz.</li><li>Bir adresi dükkân adı, eski bina veya artık var olmayan tabela üzerinden tarif ediyorsunuz.</li><li>Gün batımının saatini farkında olmadan takip ediyorsunuz.</li><li>“Uzak” kelimesini kilometreden çok o günkü trafiğe göre kullanıyorsunuz.</li></ol>

<h2>İnce çizgi</h2>
<p>Ada ritmini sevmek, başkasının zamanına saygısızlık etmek değildir. Resmî iş, randevu ve ulaşım planlarında dakik olmak hâlâ önemlidir. Asıl mesele, günün her boşluğunu verimlilik kaygısıyla doldurmamayı öğrenmektir.</p>

<p>Bu listeyi okurken aklınıza bir arkadaşınız geldiyse ona gönderin. Büyük ihtimalle “ma, ben zaten böyleydim” diyecektir.</p>
    `,
  }),
  editorial({
    slug: "koy-panayirina-ilk-kez-gidecekler-icin-rehber",
    title: "Köy Panayırına İlk Kez Gidecekler İçin Rehber",
    excerpt: "Tezgâhlar, müzik, kalabalık ve ev yapımı lezzetler arasında kaybolmadan; yerel etkinliğe ziyaretçi değil misafir gibi katılmanın yolları.",
    category: "Kültür",
    published_at: "2026-08-08T12:00:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1506157786151-b8491531f063",
    content: `
<p>Köy panayırları, ürün satılan açık hava etkinliklerinden fazlasıdır. Köy dernekleri, üreticiler, müzisyenler ve uzun süredir birbirini görmeyen aileler aynı alanda buluşur. İlk kez gidiyorsanız küçük ayrıntılar deneyimi daha rahat ve saygılı hâle getirir.</p>

<h2>Gitmeden önce programı doğrulayın</h2>
<p>Saat, park düzeni ve etkinlik programı değişebilir. Sosyal medya duyurusunun tarihine bakın ve mümkünse organizatörün güncel paylaşımını kontrol edin. Ana gösteriden kısa süre önce varmak yerine alan açılırken gitmek tezgâhları daha sakin görmenizi sağlar.</p>

<h2>Nakit ve küçük çanta</h2>
<p>Her tezgahta kart geçmeyebilir. Küçük banknotlar alışverişi kolaylaştırır. Bez çanta, su ve sıcak akşamlar için hafif giysi taşıyın. Tek kullanımlık ambalajı azaltmak üreticinin de işini kolaylaştırır.</p>

<h2>Ürünün hikâyesini sorun</h2>
<p>Macun, reçel, ekmek, el işi veya bitkisel ürün alırken nasıl hazırlandığını ve nasıl saklanacağını sorun. Pazarlık yapmadan önce üretimin küçük ölçekli ve emek yoğun olabileceğini hesaba katın.</p>

<h2>Gösteriler sırasında</h2>
<p>Dans ve müzik alanında geçişleri kapatmayın. Çocukları ve izleyicileri yakından fotoğraflamadan önce izin isteyin. Sahne önündeki birkaç iyi kare için başkalarının bütün gösterisini engellemeyin.</p>

<h2>Köyü de görün</h2>
<p>Panayır alanından ayrılmadan önce köy meydanında kısa bir yürüyüş yapın; ancak özel avlu ve evlere girmeyin. Etkinliğin kurulduğu yer, çoğu zaman program kadar çok şey anlatır.</p>

<p>İyi panayır ziyaretçisi yalnız alışveriş yapmaz; üreticiyle konuşur, etkinliğin ritmine uyar ve geride yalnız ayak izi bırakır.</p>
    `,
  }),
  editorial({
    slug: "kibris-el-isleri-lefkara-sepet-ve-oruculuk",
    title: "Kıbrıs El İşlerini Tanıma Rehberi: Lefkara İşi, Sepet ve Örücülük",
    excerpt: "Turistik raftaki üründen gerçek el emeğini ayırmak; malzemeyi, tekniği ve ustanın zamanını doğru okumak için başlangıç rehberi.",
    category: "Kültür",
    published_at: "2026-08-07T11:00:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b",
    content: `
<p>Kıbrıs'ın el işleri, yalnız geçmişi temsil eden süs eşyaları değildir. Ev tekstilinden sepetlere, dantel ve örücülükten ahşap işlerine kadar birçok üretim gündelik ihtiyaçtan doğmuş, zamanla estetik bir dile dönüşmüştür.</p>

<h2>Lefkara işi</h2>
<p>Geometrik desenler, sayılı iplik ve iki yüzü de temiz görünen işçilik bu geleneğin ayırt edici yönlerindendir. Büyük bir parçanın tamamlanması uzun zaman alabilir. Dikişlerin düzeni, kumaşın niteliği ve arka yüzün temizliği ürünü değerlendirirken bakılacak noktalardır.</p>

<h2>Sepet örücülüğü</h2>
<p>Kamış, saz veya bölgesel bitkiler kullanılarak üretilen sepetler taşıma ve saklama ihtiyacından doğar. Sapın gövdeye nasıl bağlandığı, tabanın dengesi ve uçların temiz bitirilmesi dayanıklılık hakkında fikir verir.</p>

<h2>Örgü ve dantel</h2>
<p>Masa örtüsü, yatak kenarı, başörtüsü veya dekoratif parçalarda farklı teknikler görülür. “El yapımı” etiketini yeterli saymayın; tekniği, malzemeyi ve üretim süresini sorun. Gerçek üretici bu soruları genellikle memnuniyetle anlatır.</p>

<h2>Satın alırken etik yaklaşım</h2>
<ul><li>Ucuz seri üretim ile el emeğinin aynı fiyatlanmasını beklemeyin.</li><li>Ustanın adını ve ürünün nerede yapıldığını öğrenin.</li><li>Fotoğraf çekmeden önce izin isteyin.</li><li>Bakım ve yıkama talimatını not edin.</li><li>Kullanacağınız veya uzun süre saklayacağınız ürünü seçin.</li></ul>

<p>Bir el işinin değeri yalnız deseninde değil, taşıdığı bilgi ve harcanan zamandadır. En iyi hatıra, hikâyesini kimin yaptığını bilerek eve götürdüğünüz parçadır.</p>
    `,
  }),
  editorial({
    slug: "adada-suyu-korumak-icin-10-pratik-aliskanlik",
    title: "Ada Yaşamında Suyu Korumak İçin 10 Pratik Alışkanlık",
    excerpt: "Büyük vaatler yerine mutfakta, banyoda, balkonda ve bahçede hemen uygulanabilecek; tüketimi görünür kılan ada dostu öneriler.",
    category: "Yaşam",
    published_at: "2026-08-06T09:00:00+03:00",
    cover_image: "https://images.unsplash.com/photo-1538300342682-cf57afb97285",
    content: `
<p>Adada su, musluktan geldiği için sınırsız değildir. Uzun kurak dönemler, yaz nüfusu ve altyapı üzerindeki baskı; gündelik tüketimi önemli hâle getirir. Tasarruf, konfordan tamamen vazgeçmek değil, boşa akan suyu sistemli biçimde azaltmaktır.</p>

<ol><li><strong>Kaçağı görünür kılın.</strong> Gece tüm musluklar kapalıyken sayaç hareketini kontrol edin.</li><li><strong>Duş süresini ölçün.</strong> Bir şarkılık kısalma ay sonunda ciddi fark yaratır.</li><li><strong>Musluğu sürekli açık bırakmayın.</strong> Diş fırçalama ve tıraş sırasında kapatın.</li><li><strong>Makineyi tam dolu çalıştırın.</strong> Bulaşık ve çamaşırda uygun ekonomi programını seçin.</li><li><strong>Sebze yıkama suyunu değerlendirin.</strong> Tuz veya deterjan içermiyorsa bitkilere kullanın.</li><li><strong>Sabah erken sulayın.</strong> Buharlaşmayı azaltır; bitkinin ihtiyacını toprağı kontrol ederek belirleyin.</li><li><strong>Yerel ve dayanıklı bitki seçin.</strong> Sürekli yoğun sulama isteyen peyzajdan kaçının.</li><li><strong>Aracı hortumla uzun süre yıkamayın.</strong> Kova veya kontrollü basınç kullanın.</li><li><strong>Rezervuar ve perlatörleri kontrol edin.</strong> Küçük ekipman değişiklikleri sürekli tüketimi azaltabilir.</li><li><strong>Aylık tüketimi kaydedin.</strong> Tasarruf ancak ölçüldüğünde kalıcı alışkanlığa dönüşür.</li></ol>

<h2>Ortak alanlarda</h2>
<p>Apartman deposu, bahçe sulaması ve havuz bakımı bireysel tüketimden daha büyük olabilir. Yönetimden sayaç takibi ve bakım kaydı isteyin. Görülen kaçağı “birisi bildirir” diye ertelemeyin.</p>

<p>En etkili yöntem tek bir mükemmel hareket değil, her gün tekrarlanan küçük önlemlerdir. Su tasarrufu aynı zamanda enerji ve işletme maliyetini de azaltır.</p>
    `,
  }),
];
