import type { Metadata } from "next";
import UGCForm from "@/components/news/UGCForm";
import { PenLine, Shield, Eye, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Haber Yükle",
  description: "Haberi sen yaz, toplulukla paylaş.",
};

const STEPS = [
  { icon: PenLine, title: "Haberi Yaz", desc: "Başlık, içerik ve kategori seç" },
  { icon: Eye, title: "Editör İncelemesi", desc: "Ekibimiz haberi kontrol eder" },
  { icon: Shield, title: "Yayınlanır", desc: "Onaylanan haber sitede görünür" },
];

export default function HaberYuklePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Başlık */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <PenLine className="w-4 h-4" />
          Haber Yükle
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Kuzey Kıbrıs&apos;ın Sesine Ses Ol
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Çevrende olan gelişmeleri, önemli haberleri ve toplumu ilgilendiren konuları
          ugavole topluluğuyla paylaş.
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
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <UGCForm />
      </div>
    </div>
  );
}
