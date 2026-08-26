import type { Article } from "./news";

type EditorialArticle = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: "Gezi" | "Kültür" | "Yemek" | "Yaşam" | "Eğlence";
  published_at: string;
};

function editorial(input: EditorialArticle): Article {
  return {
    id: `editorial-${input.slug}`,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content.trim(),
    cover_image: `${input.cover_image}?auto=format&fit=crop&w=1400&q=82`,
    source_url: `https://ugavole.com/haber/${input.slug}`,
    source_name: "ugavole",
    category: input.category,
    published_at: input.published_at,
    is_ugc: false,
    author: "Ugavole Editörleri",
  };
}

export const EDITORIAL_ARTICLES: Article[] = [
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
