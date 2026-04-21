"use client";

import { useState, useMemo, useCallback } from "react";
import { sozlukData } from "@/lib/sozluk-data";
import ShareButtons from "@/components/ShareButtons";
import { RotateCcw, Trophy } from "lucide-react";

const TOTAL = 15;

type Option = { text: string; correct: boolean };
type Question = { kibrisca: string; emoji: string; options: Option[] };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(): Question[] {
  const pool = shuffle(sozlukData).slice(0, TOTAL);
  return pool.map((entry) => {
    const wrong = shuffle(sozlukData.filter((e) => e.id !== entry.id))
      .slice(0, 3)
      .map((e) => ({ text: e.anlam, correct: false }));
    const options = shuffle([{ text: entry.anlam, correct: true }, ...wrong]);
    return { kibrisca: entry.kibrisca, emoji: entry.emoji, options };
  });
}

const RESULT_MESSAGES = [
  { min: 0,  max: 5,  msg: "Gavur musun sen? 😅 Kıbrıs'a biraz daha gel!", color: "text-red-400" },
  { min: 6,  max: 9,  msg: "Fena değil! Ama hellim yemeyi öğrenmen lazım 🧀", color: "text-orange-400" },
  { min: 10, max: 12, msg: "İyi Kıbrıslı adayısın! Palabre yapmasını öğrendin mi? 💬", color: "text-yellow-400" },
  { min: 13, max: 14, msg: "Tam Kıbrıslı ruhlusun! Muhtar seni tanıyor mu? 🏛️", color: "text-green-400" },
  { min: 15, max: 15, msg: "VALLAHİ KOCAMAN KKTC'Lİ SEN! Muhtarlık seni bekliyor 🎉", color: "text-ugavole-yellow" },
];

const LABELS = ["A", "B", "C", "D"];

export default function KibrislicaQuiz() {
  const [questions] = useState<Question[]>(() => buildQuestions());
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [done, setDone] = useState(false);

  const q = questions[current];
  const result = useMemo(
    () => RESULT_MESSAGES.find((r) => score >= r.min && score <= r.max)!,
    [score]
  );

  const pick = useCallback((idx: number) => {
    if (selected !== null || transitioning) return;
    setSelected(idx);
    if (q.options[idx].correct) setScore((s) => s + 1);
    setTransitioning(true);
    setTimeout(() => {
      setTransitioning(false);
      setSelected(null);
      if (current + 1 >= TOTAL) {
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
      }
    }, 1000);
  }, [selected, transitioning, q, current]);

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setTransitioning(false);
    setDone(false);
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="bg-ugavole-surface border-2 border-ugavole-yellow/40 rounded-3xl p-8">
          <Trophy className="w-12 h-12 text-ugavole-yellow mx-auto mb-4" />
          <div className="text-6xl font-black text-ugavole-yellow mb-1">{score}<span className="text-2xl text-ugavole-muted">/{TOTAL}</span></div>
          <p className={`font-black text-xl mt-4 mb-6 ${result.color}`}>{result.msg}</p>

          {/* Puan çubuğu */}
          <div className="w-full bg-ugavole-surface-2 rounded-full h-3 mb-8">
            <div
              className="bg-ugavole-yellow h-3 rounded-full transition-all duration-700"
              style={{ width: `${(score / TOTAL) * 100}%` }}
            />
          </div>

          <div className="mb-6">
            <p className="text-ugavole-muted text-sm mb-3 font-bold uppercase tracking-wider">Sonucu paylaş</p>
            <ShareButtons
              text={`Ne Kadar Kıbrıslısın testinde ${score}/${TOTAL} aldım! ${result.msg} #KKTC #ugavole`}
              url="https://ugavole.com/quiz/kibrislica"
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
        <span className="text-ugavole-muted text-sm font-bold">{current + 1} / {TOTAL}</span>
        <span className="text-ugavole-yellow font-black text-sm">✅ {score} doğru</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-ugavole-surface-2 rounded-full h-2 mb-8">
        <div
          className="bg-ugavole-yellow h-2 rounded-full transition-all duration-300"
          style={{ width: `${((current) / TOTAL) * 100}%` }}
        />
      </div>

      {/* Soru kartı */}
      <div className="bg-ugavole-surface border-2 border-ugavole-yellow/30 rounded-3xl p-8 mb-6 text-center">
        <div className="text-5xl mb-4">{q.emoji}</div>
        <p className="text-ugavole-muted text-sm font-bold uppercase tracking-wider mb-2">Bu kelime ne anlama gelir?</p>
        <h2 className="text-ugavole-yellow font-black text-4xl">{q.kibrisca}</h2>
      </div>

      {/* Şıklar */}
      <div className="grid grid-cols-1 gap-3">
        {q.options.map((opt, idx) => {
          let cls = "bg-ugavole-surface border-ugavole-border text-ugavole-text hover:border-ugavole-yellow hover:bg-ugavole-surface-2";
          if (selected !== null) {
            if (opt.correct) cls = "bg-green-600/20 border-green-500 text-green-400";
            else if (idx === selected && !opt.correct) cls = "bg-red-600/20 border-red-500 text-red-400";
            else cls = "bg-ugavole-surface border-ugavole-border text-ugavole-muted opacity-50";
          }
          return (
            <button
              key={idx}
              onClick={() => pick(idx)}
              disabled={selected !== null}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 font-bold text-left transition-all ${cls}`}
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-black">
                {LABELS[idx]}
              </span>
              <span className="text-sm leading-snug">{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
