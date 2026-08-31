"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  LayoutGrid,
  Link2,
  List as ListIcon,
  Plus,
  RotateCcw,
  Search,
  XCircle,
} from "lucide-react";
import SozlukSubmissionForm from "@/components/sozluk/SozlukSubmissionForm";
import { kategoriler, type SozlukEntry } from "@/lib/sozluk-data";
import {
  compareSozlukEntries,
  matchesSozlukQuery,
  rankSozlukEntry,
  sozlukEntrySlug,
  sozlukInitial,
  TURKISH_ALPHABET,
} from "@/lib/sozluk-search";

type ViewMode = "dictionary" | "cards";

const ZORLUK_COLORS = {
  kolay: "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/60",
  orta: "text-amber-800 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/60",
  zor: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950/60",
};

function FlipCard({ entry }: { entry: SozlukEntry }) {
  const [flipped, setFlipped] = useState(false);
  const [quizState, setQuizState] = useState<"idle" | "known" | "unknown">("idle");
  const hasFlipped = useRef(false);
  const frontButton = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const slug = sozlukEntrySlug(entry);

  function flip() {
    hasFlipped.current = true;
    setFlipped((value) => !value);
  }

  useEffect(() => {
    if (!hasFlipped.current) return;
    (flipped ? backButton : frontButton).current?.focus();
  }, [flipped]);

  return (
    <article id={`kelime-${slug}`} className="perspective-1000 scroll-mt-28">
      <div
        className="relative h-56 rounded-2xl transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.5s ease",
        }}
      >
        <button
          ref={frontButton}
          type="button"
          aria-label={`${entry.kibrisca} kelimesinin anlamını göster`}
          aria-hidden={flipped}
          tabIndex={flipped ? -1 : 0}
          className="absolute inset-0 flex cursor-pointer flex-col justify-between rounded-2xl border border-ugavole-yellow/30 bg-ugavole-surface p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ugavole-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ugavole-bg"
          style={{
            backfaceVisibility: "hidden",
            pointerEvents: flipped ? "none" : "auto",
          }}
          onClick={flip}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full bg-ugavole-surface-2 px-2.5 py-1 text-xs font-black capitalize text-ugavole-body">
              {entry.kategori}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-black ${ZORLUK_COLORS[entry.zorluk]}`}>
              {entry.zorluk}
            </span>
          </div>

          <div className="text-center">
            <div className="mb-2 text-4xl" aria-hidden="true">{entry.emoji}</div>
            <h3 className="text-2xl font-black leading-tight text-ugavole-yellow-dark dark:text-ugavole-yellow">
              {entry.kibrisca}
            </h3>
            {(entry.aliases?.length ?? 0) > 0 && (
              <p className="mt-1 text-xs text-ugavole-muted">Diğer: {entry.aliases?.join(", ")}</p>
            )}
          </div>

          <p className="text-center text-xs font-bold text-ugavole-muted">Anlamı için çevir →</p>
        </button>

        <div
          aria-hidden={!flipped}
          className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-ugavole-yellow/50 bg-ugavole-surface-2 p-5"
          style={{
            backfaceVisibility: "hidden",
            pointerEvents: flipped ? "auto" : "none",
            transform: "rotateY(180deg)",
          }}
        >
          <button
            ref={backButton}
            type="button"
            onClick={flip}
            aria-label={`${entry.kibrisca} kelime yüzünü göster`}
            tabIndex={flipped ? 0 : -1}
            className="absolute right-3 top-3 rounded-full p-2 text-ugavole-muted transition-colors hover:bg-ugavole-surface hover:text-ugavole-text"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <div>
            <p className="pr-8 text-lg font-black leading-snug text-ugavole-text">{entry.anlam}</p>
            {entry.cumle && (
              <p className="mt-2 text-sm italic leading-5 text-ugavole-muted">&quot;{entry.cumle}&quot;</p>
            )}
          </div>

          {quizState === "idle" ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setQuizState("known")}
                tabIndex={flipped ? 0 : -1}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-emerald-600/30 bg-emerald-600/10 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-600/20 dark:text-emerald-300"
              >
                <CheckCircle className="h-4 w-4" /> Biliyorum
              </button>
              <button
                type="button"
                onClick={() => setQuizState("unknown")}
                tabIndex={flipped ? 0 : -1}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-red-600/30 bg-red-600/10 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-600/20 dark:text-red-300"
              >
                <XCircle className="h-4 w-4" /> Bilmiyorum
              </button>
            </div>
          ) : (
            <div className={`rounded-xl py-2 text-center text-sm font-bold ${quizState === "known" ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300" : "bg-red-600/10 text-red-700 dark:text-red-300"}`}>
              {quizState === "known" ? "✅ Harika!" : "📚 Bir dahaki sefere!"}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function DictionaryList({ entries }: { entries: SozlukEntry[] }) {
  const groups = useMemo(() => {
    const result = new Map<string, SozlukEntry[]>();
    for (const entry of entries) {
      const initial = sozlukInitial(entry);
      result.set(initial, [...(result.get(initial) ?? []), entry]);
    }
    return [...result.entries()];
  }, [entries]);

  return (
    <div className="space-y-6">
      {groups.map(([initial, group]) => (
        <section key={initial} id={`harf-${initial.toLocaleLowerCase("tr-TR")}`} className="scroll-mt-28" aria-labelledby={`harf-baslik-${initial}`}>
          <div className="mb-2 flex items-center gap-3">
            <h2 id={`harf-baslik-${initial}`} className="flex h-11 w-11 items-center justify-center rounded-xl bg-ugavole-yellow text-xl font-black text-black">
              {initial}
            </h2>
            <span className="text-sm font-bold text-ugavole-muted">{group.length} madde</span>
            <span className="h-px flex-1 bg-ugavole-border" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-ugavole-border bg-ugavole-surface">
            {group.map((entry) => {
              const slug = sozlukEntrySlug(entry);
              return (
                <article
                  key={String(entry.id)}
                  id={`kelime-${slug}`}
                  className="scroll-mt-28 border-b border-ugavole-border p-4 last:border-b-0 sm:p-5"
                >
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] sm:gap-6">
                    <div>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-2xl" aria-hidden="true">{entry.emoji}</span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-editorial text-xl font-bold text-ugavole-text sm:text-2xl">{entry.kibrisca}</h3>
                            <a
                              href={`#kelime-${slug}`}
                              aria-label={`${entry.kibrisca} maddesine bağlantı`}
                              className="rounded-md p-1 text-ugavole-muted transition-colors hover:bg-ugavole-surface-2 hover:text-ugavole-text"
                            >
                              <Link2 className="h-3.5 w-3.5" />
                            </a>
                          </div>
                          {(entry.aliases?.length ?? 0) > 0 && (
                            <p className="mt-1 text-xs text-ugavole-muted">Diğer yazılışlar: {entry.aliases?.join(", ")}</p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-ugavole-yellow/15 px-2.5 py-1 text-[11px] font-black capitalize text-ugavole-yellow-dark dark:text-ugavole-yellow">
                              {entry.kategori}
                            </span>
                            {entry.source === "community" && (
                              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-black text-sky-800 dark:bg-sky-950 dark:text-sky-200">
                                Topluluk katkısı
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold leading-6 text-ugavole-text">{entry.anlam}</p>
                      {entry.cumle && (
                        <p className="mt-2 border-l-2 border-ugavole-yellow pl-3 text-sm italic leading-6 text-ugavole-muted">
                          &quot;{entry.cumle}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function SozlukExplorer({ entries }: { entries: SozlukEntry[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("tümü");
  const [activeLetter, setActiveLetter] = useState<string>("tümü");
  const [view, setView] = useState<ViewMode>("dictionary");
  const [showSubmission, setShowSubmission] = useState(false);

  const featured = entries.find((entry) => entry.id === 5) ?? entries[0];
  const letterCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      const initial = sozlukInitial(entry);
      counts.set(initial, (counts.get(initial) ?? 0) + 1);
    }
    return counts;
  }, [entries]);

  const filtered = useMemo(() => {
    return entries
      .filter((entry) => {
        const matchesCategory = activeCategory === "tümü" || entry.kategori === activeCategory;
        const matchesLetter = activeLetter === "tümü" || sozlukInitial(entry) === activeLetter;
        return matchesCategory && matchesLetter && matchesSozlukQuery(entry, search);
      })
      .sort((a, b) => {
        const rankDifference = rankSozlukEntry(a, search) - rankSozlukEntry(b, search);
        return rankDifference || compareSozlukEntries(a, b);
      });
  }, [activeCategory, activeLetter, entries, search]);

  const hasFilters = Boolean(search) || activeCategory !== "tümü" || activeLetter !== "tümü";

  function resetFilters() {
    setSearch("");
    setActiveCategory("tümü");
    setActiveLetter("tümü");
  }

  function openSubmission() {
    setShowSubmission(true);
    window.setTimeout(() => {
      document.getElementById("kelime-ekle")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-ugavole-yellow-dark dark:text-ugavole-yellow">Adanın yaşayan dili</p>
            <h1 className="font-editorial text-4xl font-bold tracking-tight text-ugavole-text sm:text-5xl">Kıbrıslıca Sözlük</h1>
            <p className="mt-3 max-w-2xl leading-7 text-ugavole-muted">
              Kıbrıs Türkçesi kelimelerini, deyimlerini ve gündelik ifadelerini anlamları ve örnekleriyle bul.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/quiz/kibrislica"
              className="inline-flex items-center rounded-full border border-ugavole-yellow/50 px-4 py-2.5 text-sm font-black text-ugavole-yellow-dark transition-colors hover:bg-ugavole-yellow hover:text-black dark:text-ugavole-yellow"
            >
              Bilgini quizde dene →
            </Link>
            <button
              type="button"
              onClick={openSubmission}
              className="inline-flex items-center gap-1.5 rounded-full bg-ugavole-text px-4 py-2.5 text-sm font-black text-ugavole-bg transition-opacity hover:opacity-85"
            >
              <Plus className="h-4 w-4" /> Eksik kelime ekle
            </button>
          </div>
        </div>
      </header>

      {featured && (
        <section className="mb-8 overflow-hidden rounded-3xl border border-ugavole-yellow/40 bg-ugavole-surface" aria-labelledby="featured-word">
          <div className="grid md:grid-cols-[0.72fr_1.28fr]">
            <div className="flex items-center justify-center bg-ugavole-yellow/10 p-7 text-7xl" aria-hidden="true">{featured.emoji}</div>
            <div className="p-6 sm:p-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-ugavole-yellow/15 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-ugavole-yellow-dark dark:text-ugavole-yellow">
                <BookOpen className="h-3.5 w-3.5" /> Öne çıkan kelime
              </div>
              <h2 id="featured-word" className="font-editorial text-4xl font-bold text-ugavole-text sm:text-5xl">{featured.kibrisca}</h2>
              <p className="mt-3 text-lg font-semibold text-ugavole-body">{featured.anlam}</p>
              {featured.cumle && <p className="mt-2 italic text-ugavole-muted">&quot;{featured.cumle}&quot;</p>}
            </div>
          </div>
        </section>
      )}

      {showSubmission && (
        <section id="kelime-ekle" className="mb-9 scroll-mt-24 rounded-3xl border border-ugavole-yellow/40 bg-ugavole-surface p-5 shadow-sm sm:p-7" aria-labelledby="kelime-ekle-baslik">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-ugavole-yellow-dark dark:text-ugavole-yellow">Topluluk katkısı</p>
              <h2 id="kelime-ekle-baslik" className="mt-1 text-2xl font-black text-ugavole-text">Sözlükte olmayan bir kelime mi var?</h2>
              <p className="mt-1 text-sm leading-6 text-ugavole-muted">İki dakikada öner; önce taslağa düşsün, editör onaylarsa yayınlansın.</p>
            </div>
            <button type="button" onClick={() => setShowSubmission(false)} className="shrink-0 rounded-full px-3 py-1.5 text-sm font-bold text-ugavole-muted hover:bg-ugavole-surface-2 hover:text-ugavole-text">
              Kapat
            </button>
          </div>
          <SozlukSubmissionForm />
        </section>
      )}

      <section aria-label="Sözlük arama ve filtreleri" className="mb-7 rounded-3xl border border-ugavole-border bg-ugavole-surface p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ugavole-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Kelime, alternatif yazılış, anlam veya örnek ara…"
              aria-label="Sözlükte ara"
              className="w-full rounded-xl border border-ugavole-border bg-ugavole-bg py-3.5 pl-12 pr-4 text-sm text-ugavole-text outline-none transition-colors placeholder:text-ugavole-muted focus:border-ugavole-yellow"
            />
          </div>

          <div className="inline-flex rounded-xl border border-ugavole-border bg-ugavole-bg p-1" role="group" aria-label="Sözlük görünümü">
            <button
              type="button"
              aria-pressed={view === "dictionary"}
              onClick={() => setView("dictionary")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black transition-colors ${view === "dictionary" ? "bg-ugavole-yellow text-black" : "text-ugavole-muted hover:text-ugavole-text"}`}
            >
              <ListIcon className="h-4 w-4" /> Klasik sözlük
            </button>
            <button
              type="button"
              aria-pressed={view === "cards"}
              onClick={() => setView("cards")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black transition-colors ${view === "cards" ? "bg-ugavole-yellow text-black" : "text-ugavole-muted hover:text-ugavole-text"}`}
            >
              <LayoutGrid className="h-4 w-4" /> Kartlar
            </button>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-ugavole-border px-4 py-2.5 text-sm font-bold text-ugavole-muted transition-colors hover:text-ugavole-text"
            >
              <RotateCcw className="h-4 w-4" /> Temizle
            </button>
          )}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide" aria-label="Kategori filtreleri">
          {["tümü", ...kategoriler].map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-black capitalize transition-colors ${activeCategory === category ? "bg-ugavole-text text-ugavole-bg" : "border border-ugavole-border bg-ugavole-bg text-ugavole-muted hover:text-ugavole-text"}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-1.5 overflow-x-auto border-t border-ugavole-border pt-4 scrollbar-hide" aria-label="Harf filtreleri">
          <button
            type="button"
            aria-pressed={activeLetter === "tümü"}
            onClick={() => setActiveLetter("tümü")}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-black ${activeLetter === "tümü" ? "bg-ugavole-yellow text-black" : "bg-ugavole-bg text-ugavole-muted"}`}
          >
            Tümü
          </button>
          {TURKISH_ALPHABET.map((letter) => {
            const count = letterCounts.get(letter) ?? 0;
            return (
              <button
                key={letter}
                type="button"
                disabled={count === 0}
                aria-label={`${letter} harfi, ${count} kelime`}
                aria-pressed={activeLetter === letter}
                onClick={() => setActiveLetter(letter)}
                className={`h-9 min-w-9 shrink-0 rounded-lg text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-25 ${activeLetter === letter ? "bg-ugavole-yellow text-black" : "bg-ugavole-bg text-ugavole-muted hover:text-ugavole-text"}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ugavole-muted" aria-live="polite"><strong className="text-ugavole-text">{filtered.length}</strong> kelime bulundu</p>
        <p className="text-xs text-ugavole-muted">Arama; alternatif yazılışları ve Türkçe karakter varyantlarını da bulur.</p>
      </div>

      {filtered.length > 0 ? (
        view === "dictionary" ? (
          <DictionaryList entries={filtered} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => <FlipCard key={String(entry.id)} entry={entry} />)}
          </div>
        )
      ) : (
        <div className="rounded-3xl border border-dashed border-ugavole-border py-16 text-center">
          <p className="text-4xl" aria-hidden="true">🔍</p>
          <h2 className="mt-3 text-xl font-black text-ugavole-text">Bu aramada kelime bulunamadı</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ugavole-muted">Filtreleri temizleyebilir veya eksik kelimeyi editörlere önerebilirsin.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={resetFilters} className="rounded-full border border-ugavole-border px-4 py-2 text-sm font-black text-ugavole-text">Filtreleri temizle</button>
            <button type="button" onClick={openSubmission} className="rounded-full bg-ugavole-yellow px-4 py-2 text-sm font-black text-black">Kelime öner</button>
          </div>
        </div>
      )}
    </div>
  );
}
