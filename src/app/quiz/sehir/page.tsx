"use client";

import { useState } from "react";
import ShareButtons from "@/components/ShareButtons";
import { RotateCcw } from "lucide-react";

type Sehir = "lefkosa" | "girne" | "gazimağusa" | "guzelyurt" | "iskele";
type Puanlar = Record<Sehir, number>;

interface Secenek {
  metin: string;
  puan: Partial<Puanlar>;
}

interface Soru {
  soru: string;
  secenekler: Secenek[];
}

const sorular: Soru[] = [
  {
    soru: "Sabah kahvaltısında ne yemek istersin?",
    secenekler: [
      { metin: "Hellim + kömbeli, başka bir şey istemem", puan: { lefkosa: 3, gazimağusa: 2 } },
      { metin: "Deniz kenarında balık söyle", puan: { girne: 3, iskele: 2 } },
      { metin: "Hızlı bir şey, işim var", puan: { lefkosa: 2, guzelyurt: 1 } },
      { metin: "Portakal sıkayım taze taze", puan: { guzelyurt: 4 } },
    ],
  },
  {
    soru: "Trafikte önünü biri keserse ne yaparsın?",
    secenekler: [
      { metin: "Kornaya basarım, 3 dakika bırakmam", puan: { lefkosa: 4 } },
      { metin: "Eh, ne yapayım, geçer", puan: { iskele: 3, guzelyurt: 2 } },
      { metin: "Camı açıp bir şeyler söylerim", puan: { gazimağusa: 3, girne: 2 } },
      { metin: "Gülüp geçerim, bu Kıbrıs", puan: { girne: 3 } },
    ],
  },
  {
    soru: "Hafta sonu planın ne?",
    secenekler: [
      { metin: "Çarşıya çıkıp palavre yaparım", puan: { lefkosa: 3, gazimağusa: 2 } },
      { metin: "Denize giderim, şort giyerim", puan: { girne: 4 } },
      { metin: "Bahçede iş var, portakal bahçesi bekliyor", puan: { guzelyurt: 4 } },
      { metin: "Sahilde balık tutarım saatlerce", puan: { iskele: 4, gazimağusa: 2 } },
    ],
  },
  {
    soru: "Arkadaşın 'nerede buluşalım' dese?",
    secenekler: [
      { metin: "Surlariçi'nde bir kafe", puan: { lefkosa: 4 } },
      { metin: "Bellapais'te çay içelim", puan: { girne: 4 } },
      { metin: "Mağusa surlarının dibinde", puan: { gazimağusa: 4 } },
      { metin: "Bizim köyde, gel buraya sen", puan: { guzelyurt: 3, iskele: 3 } },
    ],
  },
  {
    soru: "Kıbrıs'ın en güzel yeri desen?",
    secenekler: [
      { metin: "Karpaz, tartışılmaz", puan: { iskele: 4 } },
      { metin: "Girne limanı gece", puan: { girne: 4 } },
      { metin: "Mağusa surları", puan: { gazimağusa: 4 } },
      { metin: "Lefkoşa Surlariçi, tarih kokar", puan: { lefkosa: 4 } },
    ],
  },
  {
    soru: "Yabancı biri Kıbrıs'a gelirse ilk nereye götürürsün?",
    secenekler: [
      { metin: "Kapalı Maraş, tarih dersi veririm", puan: { gazimağusa: 4 } },
      { metin: "Karpaz'a, eşekleri görsün", puan: { iskele: 4 } },
      { metin: "Girne kalesi + liman, klasik", puan: { girne: 3 } },
      { metin: "Portakal bahçeme, hediye veririm", puan: { guzelyurt: 4 } },
    ],
  },
  {
    soru: "En sinir bozucu şey nedir?",
    secenekler: [
      { metin: "Lefkoşa trafiği, her gün aynı", puan: { lefkosa: 3 } },
      { metin: "Turistler Girne'yi işgal etti", puan: { girne: 3 } },
      { metin: "Kimse Mağusa'ya gelmiyor", puan: { gazimağusa: 3 } },
      { metin: "İnsanlar portakalın kıymetini bilmiyor", puan: { guzelyurt: 4 } },
    ],
  },
  {
    soru: "Kıbrıs mutfağından bir yemek seçmek zorunda kalsaydın?",
    secenekler: [
      { metin: "Molehiya, annemin tarifi", puan: { lefkosa: 3, gazimağusa: 2 } },
      { metin: "Taze balık, bugün tuttuğum", puan: { girne: 3, iskele: 3 } },
      { metin: "Portakallı bir şey mutlaka", puan: { guzelyurt: 4 } },
      { metin: "Kömbeli, başka bir şey düşünemiyorum", puan: { gazimağusa: 3, lefkosa: 2 } },
    ],
  },
  {
    soru: "Kıbrıs'ta yaşamak nasıl bir şey?",
    secenekler: [
      { metin: "Her şey yakın ama trafik var", puan: { lefkosa: 3 } },
      { metin: "Deniz var, ne gerek var başka şeye", puan: { girne: 3 } },
      { metin: "Sakin, herkes herkesi tanır", puan: { guzelyurt: 3, iskele: 3 } },
      { metin: "Tarihin içinde yaşıyorum", puan: { gazimağusa: 3 } },
    ],
  },
  {
    soru: "Son olarak: Kıbrıs eşeği hakkında ne düşünürsün?",
    secenekler: [
      { metin: "Karpaz eşeği milli hazine!", puan: { iskele: 5 } },
      { metin: "Sevimli ama yolda önüme çıkmasın", puan: { girne: 2, lefkosa: 2 } },
      { metin: "Bahçeme girerse sorun olur", puan: { guzelyurt: 3 } },
      { metin: "Ugavole logosuna benziyormuş", puan: { lefkosa: 2, gazimağusa: 2, girne: 2 } },
    ],
  },
];

const sonuclar: Record<Sehir, { baslik: string; aciklama: string; emoji: string }> = {
  lefkosa: {
    baslik: "Tam bir Lefkoşalısın! 🏛️",
    aciklama: "Trafik şikayeti yaparsın ama yine de Lefkoşa'yı bırakamazsın. Surlariçi'nde çay içmeden günün geçmez. Muhtemelen herkesi tanıyorsun.",
    emoji: "🏛️",
  },
  girne: {
    baslik: "Girne seni çekiyor! ⚓",
    aciklama: "Deniz olmadan yaşayamazsın. Liman kenarında oturup saatlerce palavre yapabilirsin. Turistlerden şikayet edersin ama gizlice memnunsun.",
    emoji: "⚓",
  },
  gazimağusa: {
    baslik: "Mağusalısın be! 🏰",
    aciklama: "Tarihin içinde yaşıyorsun. Kapalı Maraş seni üzer ama Mağusa surlarına bakınca her şeyi unutursun. Kimse Mağusa'nın güzelliğini anlamıyor diye içerlersin.",
    emoji: "🏰",
  },
  guzelyurt: {
    baslik: "Güzelyurtlusun, portakal kokar üstünden! 🍊",
    aciklama: "Portakal bahçesi olmayan hayatı anlamlandıramazsın. Sakin, huzurlu, 'ama neden buraya gelmiyorlar' diye sorarsın. Güzelyurt'u bilenler sever, bilmeyenler kaybeder.",
    emoji: "🍊",
  },
  iskele: {
    baslik: "Karpaz ruhu sende! 🐴",
    aciklama: "Karpaz eşeği kadar özgürsün. Sakin hayatı, denizi, doğayı seviyorsun. 'Neden herkes şehirde yaşıyor ki?' diye sorarsın. Haklısın da.",
    emoji: "🐴",
  },
};

export default function SehirQuiz() {
  const [current, setCurrent] = useState(0);
  const [puanlar, setPuanlar] = useState<Puanlar>({ lefkosa: 0, girne: 0, gazimağusa: 0, guzelyurt: 0, iskele: 0 });
  const [selected, setSelected] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [done, setDone] = useState(false);

  const q = sorular[current];

  const kazanan: Sehir = (Object.entries(puanlar) as [Sehir, number][]).reduce(
    (a, b) => (b[1] > a[1] ? b : a)
  )[0];

  const pick = (idx: number) => {
    if (selected !== null || transitioning) return;
    setSelected(idx);
    const secilen = q.secenekler[idx];
    setPuanlar((prev) => {
      const next = { ...prev };
      (Object.entries(secilen.puan) as [Sehir, number][]).forEach(([sehir, puan]) => {
        next[sehir] = (next[sehir] ?? 0) + puan;
      });
      return next;
    });
    setTransitioning(true);
    setTimeout(() => {
      setTransitioning(false);
      setSelected(null);
      if (current + 1 >= sorular.length) {
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
      }
    }, 800);
  };

  const restart = () => {
    setCurrent(0);
    setPuanlar({ lefkosa: 0, girne: 0, gazimağusa: 0, guzelyurt: 0, iskele: 0 });
    setSelected(null);
    setTransitioning(false);
    setDone(false);
  };

  if (done) {
    const s = sonuclar[kazanan];
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="bg-ugavole-surface border-2 border-ugavole-yellow/40 rounded-3xl p-8">
          <div className="text-7xl mb-4">{s.emoji}</div>
          <h2 className="font-black text-ugavole-text text-2xl mb-3">{s.baslik}</h2>
          <p className="text-ugavole-body text-base leading-relaxed mb-8">{s.aciklama}</p>

          <div className="mb-6">
            <p className="text-ugavole-muted text-sm mb-3 font-bold uppercase tracking-wider">Sonucu paylaş</p>
            <ShareButtons
              text={`Hangi Şehirlisin testine göre ${s.baslik} ${s.emoji} #KKTC #ugavole`}
              url="https://ugavole.com/quiz/sehir"
            />
          </div>

          <button
            onClick={restart}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-ugavole-surface-2 text-ugavole-text rounded-full font-bold text-sm hover:bg-ugavole-border transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Tekrar dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-ugavole-muted text-sm font-bold">{current + 1} / {sorular.length}</span>
        <span className="text-ugavole-muted text-xs font-bold uppercase tracking-wider">Hangi Şehirlisin?</span>
      </div>

      {/* Progress */}
      <div className="w-full bg-ugavole-surface-2 rounded-full h-2 mb-8">
        <div
          className="bg-ugavole-yellow h-2 rounded-full transition-all duration-300"
          style={{ width: `${(current / sorular.length) * 100}%` }}
        />
      </div>

      {/* Soru */}
      <div className="bg-ugavole-surface border-2 border-ugavole-border rounded-3xl p-8 mb-6 text-center">
        <h2 className="text-ugavole-text font-black text-xl leading-snug">{q.soru}</h2>
      </div>

      {/* Şıklar */}
      <div className="grid grid-cols-1 gap-3">
        {q.secenekler.map((sec, idx) => {
          const isSelected = selected === idx;
          return (
            <button
              key={idx}
              onClick={() => pick(idx)}
              disabled={selected !== null}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 font-bold text-left transition-all text-sm
                ${isSelected
                  ? "bg-ugavole-yellow/20 border-ugavole-yellow text-ugavole-text scale-[1.02]"
                  : selected !== null
                    ? "bg-ugavole-surface border-ugavole-border text-ugavole-muted opacity-50"
                    : "bg-ugavole-surface border-ugavole-border text-ugavole-text hover:border-ugavole-yellow hover:bg-ugavole-surface-2"
                }`}
            >
              {sec.metin}
            </button>
          );
        })}
      </div>
    </div>
  );
}
