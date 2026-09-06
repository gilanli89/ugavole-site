# Çukur Rallisi — Dağ yolu sezonu

30 oyun kilometresi, Girne → Boğaz → dağdan iniş → Gönyeli → Lefkoşa. Kullanıcının yol fotoğrafları ve rota ekran görüntüsü referans alındı. Girne tarafında kireçtaşı yamaçları/yeşil bitki örtüsü, Boğaz'da virajlar, güneyde kuru arazi ve binalar. Soldan trafik: iki gidiş şeridi, solda kullanılabilir dar emniyet şeridi, sağda metal bariyerle ayrılan iki karşı şerit. Yol mesafesi/süre ve olaylar oyunlaştırılmıştır; trafik eğitimi simülatörü değildir.

## Oynanış

- Gaz basılı tutulur; bırakılınca süzülme, frenle sıfıra kadar durma. Aynı anda gaz/fren tutulursa fren önceliklidir. Klavye, iki parmakla dokunmatik ve ekran okuyucu etkinleştirmesi desteklenir. Blur/visibility/pause pedalları bırakır.
- Emniyet şeridi kısa kaçış sağlar; %30 düşük hız sınırı ve 7 saniye sonrası saniyede 4 sağlamlık kaybı sürekli kullanımını caydırır.
- Statik çukur/bariyerler, yeşil tamir pickup'ı, bağımsız hızda NPC trafik. Rakipler şerit değiştirmeden 1,2 saniye sinyal verir. Güvenli geçiş ve yakın geçiş bonusu vardır.
- 12 / 25,1 km civarında iki kurgusal TR plakalı ters yön aracı. Olayların çevresinde rastgele engel yoğunluğu azaltılır. Espri yanlış sürüşe yöneliktir; gerçek plaka/fotoğraf yayımlanmaz.
- 7,8 / 20,2 km kontrollerinden 2,2 km önce karşı araç selektörü; 1 km önce DUR uyarısı. Tüm şeritler aynı kontrolü uygular. Durduktan sonra oyuncu Evrakları göster'e basar; 2,6 saniyelik inceleme sonrasında +250 puan ve yeniden gaz. Bariyere 45 km/sa üzeri gelmek 20 sağlamlık kaybettirir. Bariyer geçişi otomatik fiziksel duruşla engellenir.
- 30 km, iki tamamlanmış kontrol ve sağlam araç: kazanma ekranı. Hız/yoğunluk mesafe ile artar. Gerçek oyun ve sunucu aynı 60 Hz, seed'li simülasyonu kullanır.

## Garaj

| Araç | Hız km/sa | İvme km/sa/sn | Sağlamlık | Toplam puan |
|---|---:|---:|---:|---:|
| Ada Mini | 144 | 42 | 100 | Açık |
| Aile Vagonu | 134 | 34 | 145 | Açık |
| Geçit GT | 172 | 57 | 110 | 1.800 |
| Mesarya 4×4 | 155 | 45 | 190 | 5.000 |

Puan harcanmaz; eşik geçildiğinde araç kalıcı olarak aynı tarayıcının garajında açılır. Kimlik HttpOnly, SameSite=Lax, HTTPS'te Secure cookie içindeki rastgele UUID'dir; takma ad kimlik doğrulaması değildir. Sunucu seçilen aracın kilidini denetler, doğruladığı skorları transaction/row lock ile yalnızca bir kez ekler. Arayüz yerel skor iddiası göndermez. RLS, service_role dışındaki tablo/fonksiyon erişimlerini kapatır. Önceki v2 sürüm devam eden turları `legacy-game.ts`/`legacy-replay.ts` ile bitirebilir. Önceki skorlar silinmez; yeni liderlik tablosu v3 sezonudur.

## Görsel kaynaklar

- Nethouse Networks: https://www.nethouse.net/assets/img/logo.png (resmi site https://www.nethouse.net/tr/)
- Zorlu Digital Plaza: https://www.zorluplus.com/logo-original.png (resmi site https://www.zorluplus.com/)
- Ugavole: mevcut `public/adsense-logo.svg`.
- Panoların rotadaki oyun konumları: 3,8 / 15,8 / 27,2 km. Gerçek reklam anlaşması/sponsorluk iddiası yoktur.
- `public/oyunlar/cukur-rallisi/besparmak-v3.webp`: yerleşik imagegen ile kullanıcının IMG_8881, IMG_8884, IMG_8886 fotoğrafları coğrafi referans alınarak üretildi. JPEG referansları repo dışındadır. Yalnızca arka plan manzarası üretildi; araçlar/yol/tabelalar canvas, mini harita özgün SVG'dir.

Görsel üretim promptu: “Ultrawide panoramic background for a premium browser driving game on the Girne–Boğaz–Lefkoşa route in northern Cyprus. Reference photos guide pale horizontally layered limestone ridges, rounded steep pine/cypress/scrub slopes and warm September Mediterranean daylight. Mountains left/right, hazy saddle at center. Refined realistically painted texture and atmospheric perspective. Blue sky top 45%, distant horizon about 85%. No road, cars, poles, wires, rails, buildings, people, text, logos, windshield, dashboard or borders.” Built-in image_gen used; original kept in generated_images, project asset converted to WebP.

## Verification

Focused tests cover motion direction, two lanes/shoulder bounds, braking, pause, shoulder wear, all four vehicle stats, unlock thresholds, advance headlight warning, full stop/documents on every lane, opposing traffic isolation, NPC signal delay, two wrong-way encounters, twenty seeded complete journeys, replay equivalence and malformed inputs. Build/lint plus live API, mobile portrait/landscape screenshots and audio meter checks accompany deployment.
