import Link from "next/link";
import { ConsentSettingsButton } from "@/components/privacy/ConsentProvider";

export default function Footer() {
  return (
    <footer className="mt-20 border-t-[3px] border-ugavole-yellow bg-[#11110F] text-gray-400">
      <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marka */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-3 flex items-center gap-1 font-editorial text-3xl font-bold tracking-tight">
              <span className="text-white">uga</span>
              <span className="text-[#F5C518]">vole</span>
            </Link>
            <p className="mb-4 max-w-[220px] text-sm leading-relaxed text-gray-500">
              Adanın merak uyandıran hikâyeleri, keşifleri ve yerel gündemi.
            </p>
            <Link href="/sosyal-medya" className="text-sm font-bold text-[#F5C518] hover:underline">
              Doğrulanmış sosyal hesaplar →
            </Link>
          </div>

          {/* Keşfet */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Keşfet</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/haberler" className="hover:text-ugavole-yellow transition-colors">Haberler</Link></li>
              <li><Link href="/sozluk" className="hover:text-ugavole-yellow transition-colors">Kıbrıslıca Sözlük</Link></li>
              <li><Link href="/quiz" className="hover:text-ugavole-yellow transition-colors">Quiz</Link></li>
              <li><Link href="/gun-batimi" className="hover:text-ugavole-yellow transition-colors">Gün Batımı</Link></li>
              <li><Link href="/harita" className="hover:text-ugavole-yellow transition-colors">Anlık Harita</Link></li>
              <li><Link href="/haber-yukle" className="hover:text-ugavole-yellow transition-colors">Haber Paylaş</Link></li>
              <li><Link href="/sosyal-medya" className="hover:text-ugavole-yellow transition-colors">Sosyal Medya</Link></li>
            </ul>
          </div>

          {/* Hizmetler */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Hizmetler</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/guncel/hava-durumu" className="hover:text-ugavole-yellow transition-colors">Hava Durumu</Link></li>
              <li><Link href="/guncel/doviz" className="hover:text-ugavole-yellow transition-colors">Döviz Kurları</Link></li>
              <li><Link href="/guncel/eczaneler" className="hover:text-ugavole-yellow transition-colors">Nöbetçi Eczaneler</Link></li>
              <li><Link href="/guncel/burclar" className="hover:text-ugavole-yellow transition-colors">Burçlar</Link></li>
              <li><Link href="/spor" className="hover:text-ugavole-yellow transition-colors">Spor</Link></li>
              <li><Link href="/kategori/kultur" className="hover:text-ugavole-yellow transition-colors">Kültür</Link></li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Kurumsal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hakkimizda" className="hover:text-ugavole-yellow transition-colors">Hakkımızda</Link></li>
              <li><Link href="/iletisim" className="hover:text-ugavole-yellow transition-colors">İletişim</Link></li>
              <li><Link href="/gizlilik" className="hover:text-ugavole-yellow transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="/kullanim-kosullari" className="hover:text-ugavole-yellow transition-colors">Kullanım Koşulları</Link></li>
              <li><Link href="/cerez-politikasi" className="hover:text-ugavole-yellow transition-colors">Çerez Politikası</Link></li>
              <li><ConsentSettingsButton /></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} ugavole. Tüm hakları saklıdır.</p>
          <p className="text-gray-700">Kıbrıs&apos;ın en eğlenceli köşesi</p>
        </div>
      </div>
    </footer>
  );
}
