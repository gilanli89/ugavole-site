import Link from "next/link";
import { ArrowRight, BookOpen, MapPin } from "lucide-react";

const QUIZZES = [
  {
    href: "/quiz/kibrislica",
    emoji: "🗣️",
    title: "Ne Kadar Kıbrıslısın?",
    desc: "15 Kıbrıslıca kelime, 4 şık, sınırsız eğlence. Şivenizi ölçün bakalım!",
    meta: "15 soru · ~3 dakika",
    bg: "bg-ugavole-yellow",
    textColor: "text-black",
    ctaBg: "bg-black text-white hover:bg-gray-800",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    href: "/quiz/sehir",
    emoji: "🗺️",
    title: "Hangi Şehirlisin?",
    desc: "Lefkoşa mı, Girne mi, Mağusa mı? 10 soruyla hangi KKTC şehrine ait olduğunu bul.",
    meta: "10 soru · ~2 dakika",
    bg: "bg-ugavole-text",
    textColor: "text-ugavole-bg",
    ctaBg: "bg-ugavole-yellow text-black hover:bg-ugavole-yellow-dark",
    icon: <MapPin className="w-5 h-5" />,
  },
];

export default function QuizHubPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-ugavole-yellow/20 text-ugavole-yellow-dark text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
          🎯 Kıbrıs Quizleri
        </div>
        <h1 className="font-black text-ugavole-text text-4xl md:text-5xl mb-3">Ne kadar biliyorsun?</h1>
        <p className="text-ugavole-muted text-lg">Kıbrıs'ı ne kadar iyi tanıdığını test et.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {QUIZZES.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className={`group rounded-3xl p-7 flex flex-col justify-between min-h-[260px] transition-transform hover:-translate-y-1 hover:shadow-xl ${q.bg}`}
          >
            <div>
              <div className="text-5xl mb-4">{q.emoji}</div>
              <h2 className={`font-black text-xl mb-2 ${q.textColor}`}>{q.title}</h2>
              <p className={`text-sm leading-relaxed opacity-70 mb-1 ${q.textColor}`}>{q.desc}</p>
              <p className={`text-xs font-bold opacity-50 ${q.textColor}`}>{q.meta}</p>
            </div>
            <div className="mt-5">
              <span className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-black transition-colors ${q.ctaBg}`}>
                {q.icon}
                Başla
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
