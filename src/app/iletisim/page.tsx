import { MessageSquare, ShieldCheck } from "lucide-react";

export default function IletisimPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-black text-ugavole-text">İletişim</h1>
      <p className="mb-8 text-ugavole-muted">
        Görüş, öneri ve işbirliği talepleri için güvenli iletişim kanalımızı hazırlıyoruz.
      </p>

      <div className="rounded-2xl border border-ugavole-border bg-ugavole-surface p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-ugavole-yellow/10 p-3 text-ugavole-yellow">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-black text-ugavole-text">Güvenli form hazırlanıyor</h2>
            <p className="mt-2 text-sm leading-relaxed text-ugavole-muted">
              Kişisel bilgileri doğrudan tarayıcıdan veri tabanına gönderen eski form kapatıldı. Doğrulama ve kötüye kullanım koruması tamamlandığında iletişim formu yeniden açılacak.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 text-sm text-ugavole-muted">
          <MessageSquare className="h-4 w-4 shrink-0" />
          Şu anda bu sayfadan mesaj veya e-posta bilgisi alınmıyor.
        </div>
      </div>
    </div>
  );
}
