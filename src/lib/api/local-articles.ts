/**
 * Editöryal içerikler — WordPress'e gerek kalmadan doğrudan sitede yayınlanır.
 * Yeni yazı eklemek için bu diziye bir nesne ekle ve deploy et.
 */

import type { Article } from "./news";

export const LOCAL_ARTICLES: Article[] = [
  {
    id: "local-kibris-kahvesi-kulturu",
    title: "Kıbrıs Kahvesi: Bir Fincanın İçinde Saklı Kültür",
    excerpt:
      "Sabah uyandığında ilk içtiğin şey, gün içinde girdiğin her kafede önüne gelen fincan, bir arkadaşla saatlerce oturduğun köy kahvesi… Kıbrıs'ta kahve sadece bir içecek değil, bir yaşam biçimi.",
    content: `
<p>Kıbrıs'ta kahve içmek, günün belli saatlerine ait bir ritüel değil. Sabah kahvaltısında, öğle aralarında, akşamüstü sohbetlerinde ve ziyaretlerde — her anın ortasında bir fincan kahve mutlaka vardır.</p>

<h2>Kıbrıs Kahvesi Nedir?</h2>
<p>Kıbrıs kahvesi, Türk kahvesiyle kardeş ama kendine özgü bir karakter taşır. İnce çekilmiş kahve, uzun saplı bir cezveye (bakır veya çelik) konur, soğuk suyla karıştırılır ve yavaş ateşte pişirilir. Köpüğü bol olmalıdır — köpük kalitesinin göstergesidir.</p>
<p>Sade, az şekerli veya orta şekerli olarak sipariş edilir. Yanında mutlaka bir bardak soğuk su gelir; kahveyi içmeden önce ağzı temizlemek içindir bu su.</p>

<h2>Köy Kahvesi Kültürü</h2>
<p>Kuzey Kıbrıs'ın küçük köylerinde kahvehane, sadece bir mekan değildir. Erkeklerin toplanıp tavla oynadığı, haberlerin konuşulduğu, anlaşmazlıkların çözüldüğü sosyal bir kurumdur. Lefkoşa sokaklarında ya da Girne limanı çevresinde kurulan küçük masalarda saatlerce oturup izlemek bile başlı başına bir deneyimdir.</p>

<h2>Kahveyle Gelen Gelenekler</h2>
<p>Kıbrıs'ta misafire kahve ikram etmek, saygının ve sıcaklığın en basit ifadesidir. Evlere gittiğinizde önce kahve gelir, sonra muhabbet başlar. Fal bakma geleneği de hâlâ yaşatılmaktadır — fincanı ters çevirip beklettikten sonra çizgilere bakılır, hikayeler uydurulur, gülünür.</p>

<h2>Nerede İçilir?</h2>
<p><strong>Girne Limanı:</strong> Deniz manzarası eşliğinde tarihi mekânlarda.<br>
<strong>Lefkoşa Arasta Bölgesi:</strong> Kapalı Maraş'a yakın, geleneksel kahvehanelerde.<br>
<strong>Lapta ve Alsancak köyleri:</strong> Sakin bir köy sabahı için en doğru adres.</p>

<p>Bir sonraki Kıbrıs ziyaretinizde acelesi yok — bir kahve ısmarlayın, etrafınıza bakın, dinleyin. Kıbrıs size kendini böyle anlatır.</p>
    `.trim(),
    cover_image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
    source_url: "https://ugavole.com/haber/kibris-kahvesi-kulturu",
    source_name: "ugavole",
    category: "Kültür",
    published_at: "2026-04-03T10:00:00",
    is_ugc: false,
    author: "ugavole",
  },
  {
    id: "local-girne-sakli-koyleri",
    title: "Girne'nin Gözden Kaçan 5 Saklı Köyü",
    excerpt:
      "Herkes Girne limanını, Bellapais Manastırı'nı ve St. Hilarion Kalesi'ni bilir. Ama dağların arasına gizlenmiş, zaman durmuş gibi sessiz köyler var ki oraya ulaşmak başlı başına bir macera.",
    content: `
<p>Girne'ye gelenlerin büyük çoğunluğu liman çevresini, market ve restoranları görür, bir-iki gün sonra ayrılır. Oysa Beşparmak Dağları'nın yamaçlarına, dereler boyunca uzanan eski Rum köylerine ve kireç taşı evlerin gölgesine girenler farklı bir Kıbrıs'la tanışır.</p>

<h2>1. Karaman (Karmi)</h2>
<p>Girne'nin 10 km güneyinde, dağ yamacına yapışmış bu köy 1970'lerde neredeyse tamamen terk edilmişti. Sonradan restore edilerek yabancı sanatçılara ve emeklilere kiralandı. Bugün taş evleri, dar sokakları ve sessizliğiyle adeta açık hava müzesi gibi. Cumartesi pazarı küçük ama şirin.</p>

<h2>2. Zeytinlik (Templos)</h2>
<p>Adı zeytin bahçelerinden gelir ve hak ediyor. Yüzyıllık zeytin ağaçlarının arasında yürüyüş yapmak, köy meydanındaki çınarın altında oturmak… Buraya turist otobüsü gelmiyor, o yüzden hâlâ gerçek.</p>

<h2>3. Esentepe (Trikomo)</h2>
<p>Doğuya doğru kıyı boyunca giderken rüzgâr sörfçülerinin toplandığı koy yakınında. Köyün içi sakin, etrafı meyve bahçeleriyle çevrili. Denize 5 dakika, gürültüden uzak.</p>

<h2>4. Kaplıca (Davlos)</h2>
<p>Kıbrıs'ın kuzeydoğu ucuna yakın bu köy, adını eski bir kaplıcadan alır. Balık lokantaları ve küçük plajıyla yaz aylarında yerli halkın sığındığı bir yer — yabancı turistlerden habersiz.</p>

<h2>5. Güngör (Krini)</h2>
<p>Bellapais'ten daha yukarıya çıkın, virajlı yolda ilerleyin. Orman içinde küçük bir yerleşim yeri. Sabah sis, öğlen serin hava, akşam Girne şehrinin ışıklarının yukarıdan görünümü.</p>

<p>Bu köyleri gezmek için ideal zaman: ilkbahar veya sonbahar. Yazın biraz sıcak, kışın bazı yollar çamurlu olabilir. Bir araç kiralayın, GPS'i açın ama acele etmeyin.</p>
    `.trim(),
    cover_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    source_url: "https://ugavole.com/haber/girne-sakli-koyleri",
    source_name: "ugavole",
    category: "Gezi",
    published_at: "2026-04-02T11:00:00",
    is_ugc: false,
    author: "ugavole",
  },
  {
    id: "local-hellim-rehberi",
    title: "Hellim Rehberi: Sadece Peynir Değil, Bir Kimlik",
    excerpt:
      "Kıbrıs'ı ziyaret edenler için hellim bazen yeni bir keşif, Kıbrıslılar için ise çocukluktan gelen bir tat. Bu peynirin hikayesi, adanın kendisi kadar karmaşık ve bir o kadar lezzetli.",
    content: `
<p>Hellim (ya da uluslararası adıyla halloumi), Kıbrıs'ın dünyaya verdiği en büyük gastronomi hediyelerinden biri. 2021'de AB'nin Korumalı Menşe Adı (PDO) statüsünü kazandı — artık gerçek hellim yalnızca Kıbrıs'ta üretilebilir.</p>

<h2>Hellim Nedir, Nasıl Yapılır?</h2>
<p>Geleneksel hellim koyun ve keçi sütünden yapılır, bazen inek sütü de eklenir. Peynir ısıtılarak şekillendirilir, salamura edilir ve içine taze nane yaprakları konur. Bu nane kokusu, hellimin imzasıdır.</p>
<p>Pişirildiğinde erimez — bu onu ızgaraya, tavaya ve mangala uygun kılar. Dışı çıtır çıtır, içi yumuşak ve hafif elastik.</p>

<h2>Nasıl Yenir?</h2>
<ul>
  <li><strong>Izgara hellim:</strong> Kahvaltıda zeytinle, ya da bir parça ekmekle. En klasik hali.</li>
  <li><strong>Karpuzla:</strong> Tuzlu-tatlı kombinasyon. Yaz sıcağında nefis.</li>
  <li><strong>Köfte ile:</strong> Şeftali kebabının yanında tabağa konur.</li>
  <li><strong>Hellimli sandviç:</strong> Özellikle Lefkoşa'daki lokantalarda popüler.</li>
</ul>

<h2>Nereden Alınır?</h2>
<p>Marketten alınan hellim ile köy üreticisinden alınan hellim arasında dağlar kadar fark var. Girne pazar bölgesinde, Lefkoşa'nın Bandabuliya (Belediye Pazarı) çarşısında ya da Güzelyurt çevresindeki küçük mandıralarda taze hellim bulabilirsiniz.</p>

<h2>Hellim Festivali</h2>
<p>Her yıl Mayıs ayında Lefkoşa'da düzenlenen Hellim Festivali, adanın en renkli etkinliklerinden biri. Üreticiler, şefler ve meraklılar bir araya gelir. Eğer tarih tutarsa kaçırmayın.</p>

<p>Kıbrıs'tan hellim almadan dönmeyin — bavulunuza birkaç paket sığdırabilirsiniz. Korumalı atmosfer paketleri uzun süre dayanır.</p>
    `.trim(),
    cover_image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1200&q=80",
    source_url: "https://ugavole.com/haber/hellim-rehberi",
    source_name: "ugavole",
    category: "Yemek",
    published_at: "2026-04-01T09:30:00",
    is_ugc: false,
    author: "ugavole",
  },
  {
    id: "local-kibris-muzik-kulturu",
    title: "Kıbrıs'ın Sesi: Adaya Özgü Müzik Geleneği",
    excerpt:
      "Kıbrıs türküleri, Rum zeybekleri, karışık düğün müzikleri ve bugün gençlerin yeniden keşfettiği geleneksel enstrümanlar. Ada'nın sesi, tarihinin kadar renkli.",
    content: `
<p>Kıbrıs'ta müzik, toplumsal belleğin en güçlü taşıyıcılarından biri. Yüzyıllarca farklı kültürlerin bir arada yaşadığı bu adada, müzik de bu çok sesli mirası yansıtır.</p>

<h2>Geleneksel Kıbrıs Türküleri</h2>
<p>Kıbrıslı Türklerin halk müziği, Anadolu geleneğiyle ortaktır ancak kendine has bir yerel renk taşır. "Mani" adı verilen kısa, doğaçlama şiirler söylenirdi — özellikle düğünlerde ve toplantılarda. Ney, bağlama, def ve zil bu müziğin temel enstrümanlarıdır.</p>

<h2>Kıbrıs Sivas'ı: Kaşıklı Oyunlar</h2>
<p>Adanın en tanınan halk danslarından biri kaşık oyunudur. İki kaşık ritim tutmak için kullanılır, ayaklar hızlı adımlar atar. Köy düğünlerinde hâlâ görülebilir bu gelenek, özellikle Güzelyurt ve Lefke bölgelerinde.</p>

<h2>Karışık Miras: Kıbrıs Rumlarıyla Ortak Ezgiler</h2>
<p>Adanın tarihine bakıldığında, Kıbrıslı Türkler ve Kıbrıslı Rumların yüzyıllarca aynı köylerde yaşadığı görülür. Bu birliktelik müziğe de yansımıştır. Bazı türküler iki toplumda da yaşar, farklı dillerde ama aynı melodiyle.</p>

<h2>Bugün Neler Dinleniyor?</h2>
<p>Girne'nin bar ve cafe sahnelerinde canlı müzik oldukça aktif. Türkiye'den ve yerel sanatçılardan oluşan karma programlar sık sık düzenlenir. Lefkoşa'daki bazı küçük mekanlar ise geleneksel müziği canlandıran genç grupların sahne aldığı yerlere dönüşmüş.</p>

<p>Bir konser veya festival programı için yaz aylarını kollamak iyi fikir — hem kültürpark etkinlikleri hem de açık hava sahneleri bu dönemde dolup taşar.</p>
    `.trim(),
    cover_image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80",
    source_url: "https://ugavole.com/haber/kibris-muzik-kulturu",
    source_name: "ugavole",
    category: "Kültür",
    published_at: "2026-03-31T14:00:00",
    is_ugc: false,
    author: "ugavole",
  },
  {
    id: "local-kktc-plajlari-rehberi",
    title: "KKTC'nin En İyi Plajları: Bilinen ve Gizli Kalan",
    excerpt:
      "Mavi bayraklılardan keşfedilmemiş koyculara, şezlongsuz doğal kumlardan KKTC'nin su sporları merkezlerine — ada turizminin kalbine doğru bir rehber.",
    content: `
<p>Kuzey Kıbrıs'ın kıyı şeridi, güneşli günlerin büyük çoğunluğunda turkuaz renkli, temiz ve sakin bir deniz sunar. Ama her plaj aynı değil — kalabalıktan uzak durmak isteyenler için seçenekler var.</p>

<h2>Popüler ve Köklü Plajlar</h2>

<h3>Alagadi (Turtle Beach)</h3>
<p>Girne'nin doğusunda, deniz kaplumbağalarının yuvalama alanı. Gece turları düzenlenir, yuvadan çıkan yavruları görmek mümkün (yaz aylarında). Gündüz sakin ve temiz, ücretsiz giriş.</p>

<h3>Escape Beach (Gemikonağı Yakını)</h3>
<p>Batı kıyısında, açık denize bakan geniş bir kumsal. Rüzgâr sörfü ve dalgıçlık için popüler. Yanında küçük lokantalar var.</p>

<h3>Acapulco Beach (Girne)</h3>
<p>Şehre en yakın büyük plaj. Sezonunda kalabalık, her türlü su sporunu burada bulabilirsiniz.</p>

<h2>Gizli Kalan Koylar</h2>

<h3>Koruçam Burnu Etekleri</h3>
<p>Kıbrıs'ın kuzeybatı ucuna doğru uzanan yolda, işaretlenmemiş patikalarla inen küçük koylar. Arabanızı yolun kenarına çekin, 10 dakika yürüyün — kimse yok.</p>

<h3>Kaplıca Köyü Sahili</h3>
<p>Kuzeydoğu ucunda, sakin bir balıkçı köyünün önündeki küçük kumsal. Öğleden sonra gölgeli, akşamüstü renk değiştiren deniz.</p>

<h2>Pratik Bilgiler</h2>
<ul>
  <li>Kıbrıs denizi Haziran–Ekim arasında 26–29°C'ye ulaşır.</li>
  <li>Yüksek sezon Temmuz–Ağustos: kalabalık ve pahalı.</li>
  <li>Mayıs ve Eylül ideal — sıcak deniz, az insan.</li>
  <li>Plajların büyük kısmı ücretsiz; şezlong kiralama isteğe bağlı.</li>
</ul>

<p>Hangi plajı seçerseniz seçin, sabah erken saatlerde ya da öğleden sonra 17:00'dan itibaren gidin — hem serin hem sakin olur.</p>
    `.trim(),
    cover_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    source_url: "https://ugavole.com/haber/kktc-plajlari-rehberi",
    source_name: "ugavole",
    category: "Gezi",
    published_at: "2026-03-30T08:00:00",
    is_ugc: false,
    author: "ugavole",
  },
];
