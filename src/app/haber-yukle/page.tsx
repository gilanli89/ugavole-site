import type { Metadata } from "next";
import UGCForm from "@/components/news/UGCForm";
import { PenLine, Shield, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "İçerik Gönder",
  description: "Kıbrıs hikâyeni, liste veya quiz fikrini Ugavole editörlerine gönder.",
  alternates: { canonical: "/haber-yukle" },
};

const STEPS = [
  { icon: PenLine, title: "Fikrini Anlat", desc: "Hikâye, liste, quiz veya ihbar seç" },
  { icon: Eye, title: "Editör İnceler", desc: "Kaynak, haklar ve güvenlik kontrol edilir" },
  { icon: Shield, title: "Onayla Yayınlanır", desc: "Yalnız onaylanan içerik dağıtılır" },
];

export default function HaberYuklePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Başlık */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <PenLine className="w-4 h-4" />
          İçerik Gönder
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Kıbrıs&apos;ta yaşananları sen anlat
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Yerel bir gözlem, hikâye, liste, quiz fikri veya doğrulanması gereken
          bir ihbar gönder. Ugavole editörleri onu güvenli ve paylaşılabilir hale getirsin.
        </p>
      </div>

      {/* Nasıl çalışır */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {STEPS.map((step, i) => (
          <div key={i} className="text-center">
            <div className="w-10 h-10 bg-red-100 text-red-700 rounded-xl flex items-center justify-center mx-auto mb-2">
              <step.icon className="w-5 h-5" />
            </div>
            <p className="font-semibold text-sm text-gray-900">{step.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-ugavole-surface rounded-2xl border border-ugavole-border p-6 shadow-sm">
        <UGCForm />
      </div>
    </div>
  );
}
