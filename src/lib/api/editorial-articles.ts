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
