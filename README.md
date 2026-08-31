# Ugavole

WordPress'siz Kuzey Kıbrıs içerik ve topluluk platformu. Next.js 16, Supabase Auth/Postgres ve editör kontrollü bir UGC yayın hattı kullanır.

## Güvenli yayın akışı

1. Katkıcı `/haber-yukle` formundan hikâye, liste, quiz, oylama fikri veya ihbar gönderir.
2. Sunucu isteğin Origin, boyut, Cloudflare Turnstile, idempotency ve hız sınırı kontrollerini yapıp içeriği `pending` olarak kaydeder.
3. TOTP ikinci faktörünü tamamlayan editör `/admin` içinde kaydı inceleme, onay veya ret durumuna geçirir.
4. Yalnız açık editör kararıyla `published + ad_eligible + social_ready` olabilir.
5. Sosyal outbox her hedef için değişmez bir içerik sürümü kuyruğa alır. Worker Facebook/Instagram/X adaptörlerine idempotent ve fail-closed biçimde teslim eder.

Onaysız UGC kamuya açılmaz, sitemap'e girmez, reklam yüklemez ve sosyal medyada paylaşılmaz.

## Yerel kurulum

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Gerçek sırları yalnız `.env.local` veya hosting secret manager içinde tutun. `NEXT_PUBLIC_` önekli değerlerin tarayıcı paketine gömüldüğünü unutmayın.

Yerelde `APP_ORIGIN=http://localhost:3000`; üretimde `APP_ORIGIN=https://ugavole.com` olmalıdır. UGC, hem sunucu hem tarayıcı bayrağı açık ve Turnstile anahtarları eksiksiz olmadıkça kapalı kalır. Cloudflare IP başlığına yalnız origin doğrudan Cloudflare dışından erişilemiyorsa güvenin.

## Veritabanı

Migration'ları sırayla uygulayın:

```text
supabase/migrations/001_content_kernel.sql
supabase/migrations/002_social_outbox.sql
supabase/migrations/003_publish_workflow.sql
supabase/migrations/004_legacy_surface_lockdown.sql
supabase/migrations/005_dictionary_entries.sql
```

`004`, eski geri bildirim PII'sini yalnız AAL2 personele açar; gün batımı galerisinde yalnız onaylı satırları kamuda bırakır ve `sunset-photos` bucket'ını private yapar. Onaylı eski görseller `/api/media/sunset/:id` üzerinden kontrol edilerek servis edilir. Tarayıcıdan doğrudan Storage yazma/okuma yetkisi verilmez; yeni bir upload akışı ancak karantina + sunucu doğrulamasıyla eklenmelidir. Migration, `storage.objects` üzerindeki anon/authenticated yetkilerini genel olarak geri aldığı için canlı projede başka tarayıcı-storage akışı varsa önce bucket envanteri çıkarıp ona özel dar politika tanımlayın.

`005`, ziyaretçi sözlük önerilerini haber hattından ayrı tutar. Öneriler `pending` başlar; yalnız AAL2 editörün atomik onayıyla `published` olur. Ana kelime ve alternatif yazılış çakışmaları, idempotency, rate-limit, private abuse metadata ve published-only public view bu migration içinde kurulur. Uygulama kodu deploy edilmeden önce migration uygulanmalıdır.

İlk editör hesabını Supabase Auth'ta oluşturduktan sonra rolü SQL Editor üzerinden kontrollü biçimde verin:

```sql
update public.profiles
set role = 'admin', updated_at = now()
where id = '<AUTH_USER_UUID>';
```

Staff erişiminde MFA zorunludur. İlk parola girişinde `/mfa` TOTP kurulumuna yönlendirir; `aal2` olmayan oturum hem uygulama katmanında hem doğrudan Supabase RPC/RLS yüzeyinde reddedilir. Bu kontrol üretim ortamı değişkeniyle kapatılamaz.

## Sosyal otomasyon

Adaptörler varsayılan olarak kapalıdır. Platform kimliği, token, API sürümü ve hedef hesap eksikse hedef etkinleşmez. X ayrıca aylık gönderi kotası ve maliyet notu olmadan açılmaz. Gerçek ilk gönderiden önce staging/dry-run ve kullanıcı onayı gerekir.

Facebook, Instagram ve X için varsayılan metinler aynı kopyayı çoğaltmaz: Facebook kısa özet ve okuma çağrısı, Instagram kaydet/paylaş çağrısı ile yerel hashtag seti, X ise kısa başlık ve iki hashtag üretir. Editör isterse onay anında hedef bazında metni değiştirebilir; teslim edilen metin ve görsel hash'i outbox içinde değişmez biçimde saklanır.

Kod içinde hazır bulunan 20 editöryal yazıyı güvenli yayın hattına hazırlamak için önce admin/editör UUID'sini ve onay ibaresini `.env.local` içine koyup tek seferlik aktarımı çalıştırın:

```bash
EDITORIAL_IMPORT_CONFIRM=PREPARE_20_EDITORIAL_ITEMS
UGAVOLE_EDITOR_ACTOR_ID=<AUTH_USER_UUID>
npm run import:editorial
```

Aktarım görselleri `editorial-media` public bucket'ına 1200×630 JPEG olarak yükler ve içerikleri yalnız `approved` durumuna getirir; yayın, reklam ve sosyal paylaşım yine AAL2 editör kararını bekler.

Cron çağrıları zaman damgalı HMAC kullanır; aynı imza ikinci kez kullanılamaz. `POST /api/cron/editorial` en fazla bir RSS maddesinden özel editör taslağı oluşturur, asla doğrudan yayın yapmaz. PII ve kötüye kullanım kayıtlarının süreli temizliği için `POST /api/cron/maintenance` günlük çalıştırılmalıdır; her işin sırrı ayrıdır.

Hostinger zamanlayıcısı imzayı kendisi üretmek için `npm run cron:editorial` (başlangıçta 4 saatte bir), `npm run cron:social` (dakikada bir) ve `npm run cron:maintenance` (günde bir) komutlarını çalıştırabilir. Sırlar yalnız hosting ortamında tutulur.

## Reklam ve gizlilik

AdSense varsayılan olarak kapalıdır. Reklam için aynı anda şunlar gerekir:

- editörün içerik bazında `ad_eligible` kararı;
- ziyaretçinin izin tercihi;
- `NEXT_PUBLIC_GOOGLE_CERTIFIED_CMP_READY=true`;
- geçerli AdSense client/slot ayarları.

Google-certified CMP hesabı, IAB TCF sinyali ve AdSense ile uyumlu istek-bazlı nonce CSP doğrulanmadan bu bayrağı açmayın. Bayrak tek başına CMP veya politika uyumluluğu sağlamaz; yeni CSP'yi önce Report-Only olarak ölçün.

Kök dizindeki `ads.txt` ve `google-adsense-account` meta etiketi yayıncı `pub-7117498587512923` için hazırlanmıştır. Reklam script'i yalnız certified CMP bayrağı açıldıktan sonra yüklenir; içerik içi slotlar ayrıca veritabanındaki açık `ad_eligible` kararını ister.

## Üretim kapıları

- Supabase migration/RLS smoke testleri ve ilk admin TOTP kurulumu
- Turnstile widget + hostname doğrulaması
- İzlenen gizlilik/telif ihlal kanalı ve günlük maintenance cron doğrulaması
- Canlı Supabase bucket envanteri; `004` ile çakışan başka tarayıcı-storage akışı olmadığının doğrulanması
- Google-certified CMP, IAB TCF, nonce CSP ve AdSense site onayı
- Facebook/Instagram hesap sahipliği, uygulama izinleri ve uzun ömürlü token bağlama
- X maliyet limiti ve ilk gerçek gönderi için açık operasyon onayı
- Hostinger staging sağlık kontrolü, sonra Cloudflare origin/DNS kesimi

Bu hesap ve dış hizmet adımları tamamlanana kadar ilgili özellikler fail-closed kalır.

## Doğrulama

```bash
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run build
npm audit --audit-level=high
```

WordPress kodu çalışma zamanında kullanılmaz. `scripts/wp-migrate.ts` yalnız eski içeriğin bir defalık aktarımı için tutulan legacy araçtır.
