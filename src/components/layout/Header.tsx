"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { Menu, X, Search, PenLine, ChevronDown } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { label: "Haberler", href: "/haberler" },
  { label: "Magazin",  href: "/kategori/magazin" },
  { label: "Spor",     href: "/spor" },
  { label: "Kültür",   href: "/kategori/kultur" },
  { label: "Oyunlar",  href: "/oyunlar" },
  { label: "Quiz",     href: "/quiz" },
];

const KESFET_ITEMS = [
  { emoji: "🗺️", label: "Harita",     href: "/harita" },
  { emoji: "🌅", label: "Gün Batımı", href: "/gun-batimi" },
  { emoji: "🗣️", label: "Sözlük",     href: "/sozluk" },
  { emoji: "💊", label: "Eczaneler",  href: "/eczaneler" },
  { emoji: "💱", label: "Döviz",      href: "/doviz" },
];

export default function Header() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [kesfetOpen, setKesfetOpen]   = useState(false); // mobile accordion
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery]             = useState("");
  const pathname                      = usePathname();
  const dropdownTimer                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isKesfetActive = KESFET_ITEMS.some((i) => pathname.startsWith(i.href));

  // Hover ile dropdown — kısa gecikme sayesinde imleci taşırken kapanmaz
  const openDropdown  = () => { if (dropdownTimer.current) clearTimeout(dropdownTimer.current); setDropdownOpen(true); };
  const closeDropdown = () => { dropdownTimer.current = setTimeout(() => setDropdownOpen(false), 120); };

  const linkCls = (active: boolean) =>
    `relative px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] rounded-lg transition-colors whitespace-nowrap ${
      active
        ? "text-ugavole-yellow-dark dark:text-ugavole-yellow"
        : "text-ugavole-muted hover:text-ugavole-text hover:bg-ugavole-surface-2"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-t-[3px] border-b-ugavole-border border-t-ugavole-yellow bg-ugavole-surface/95 shadow-[0_5px_24px_rgba(32,29,21,0.04)] backdrop-blur-xl">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo size="md" />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={linkCls(isActive(item.href))}>
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#F5C518] rounded-full" />
                )}
              </Link>
            ))}

            {/* Keşfet dropdown */}
            <div
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isKesfetActive
                    ? "text-[#F5C518]"
                    : "text-ugavole-muted hover:bg-ugavole-surface-2 hover:text-ugavole-text"
                }`}
              >
                Keşfet
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                {isKesfetActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#F5C518] rounded-full" />
                )}
              </button>

              {dropdownOpen && (
                <div
                className="absolute left-1/2 top-full z-50 mt-1.5 w-48 -translate-x-1/2 rounded-2xl border border-ugavole-border bg-ugavole-surface py-1.5 shadow-2xl"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >
                  {KESFET_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        isActive(item.href)
                          ? "text-[#F5C518] font-semibold bg-[#F5C518]/5"
                          : "text-ugavole-muted hover:bg-ugavole-surface-2 hover:text-ugavole-text"
                      }`}
                    >
                      <span className="text-base leading-none">{item.emoji}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Sağ */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-xl p-2 text-ugavole-muted transition-colors hover:bg-ugavole-surface-2 hover:text-ugavole-text"
              aria-label="Aramayı aç"
            >
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <Link
              href="/haber-yukle"
              className="hidden items-center gap-1.5 rounded-xl bg-ugavole-yellow px-4 py-2.5 text-xs font-extrabold text-black transition-all hover:-translate-y-0.5 hover:bg-[#DCAE12] sm:flex"
            >
              <PenLine className="w-3.5 h-3.5" />
              Yazını gönder
            </Link>
            <button
              className="rounded-xl p-2 text-ugavole-muted transition-colors hover:bg-ugavole-surface-2 lg:hidden"
              aria-label="Menüyü aç"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Arama */}
        {searchOpen && (
          <div className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ugavole-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Haber, konu veya etiket ara..."
                autoFocus
                className="w-full rounded-xl border border-ugavole-border bg-ugavole-surface-2 py-2.5 pl-10 pr-4 text-sm text-ugavole-text outline-none transition-colors focus:border-ugavole-yellow"
              />
            </div>
          </div>
        )}

        {/* Mobil menü */}
        {menuOpen && (
          <nav className="border-t border-ugavole-border pb-4 pt-2 lg:hidden">
            <div className="space-y-0.5 mb-3">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                    isActive(item.href)
                      ? "bg-[#F5C518]/10 text-[#F5C518]"
                      : "text-ugavole-muted hover:bg-ugavole-surface-2 hover:text-ugavole-text"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Keşfet accordion */}
              <div>
                <button
                  onClick={() => setKesfetOpen(!kesfetOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                    isKesfetActive
                      ? "bg-[#F5C518]/10 text-[#F5C518]"
                      : "text-ugavole-muted hover:bg-ugavole-surface-2 hover:text-ugavole-text"
                  }`}
                >
                  Keşfet
                  <ChevronDown className={`w-4 h-4 transition-transform ${kesfetOpen ? "rotate-180" : ""}`} />
                </button>
                {kesfetOpen && (
                  <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-ugavole-border pl-3">
                    {KESFET_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => { setMenuOpen(false); setKesfetOpen(false); }}
                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors ${
                          isActive(item.href)
                            ? "text-[#F5C518] font-semibold"
                            : "text-ugavole-muted hover:bg-ugavole-surface-2 hover:text-ugavole-text"
                        }`}
                      >
                        <span>{item.emoji}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-ugavole-border pt-3">
              <Link
                href="/haber-yukle"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-ugavole-yellow px-5 py-2.5 text-sm font-extrabold text-black transition-colors hover:bg-[#DCAE12]"
              >
                <PenLine className="w-4 h-4" />
                Haber Paylaş
              </Link>
              <ThemeToggle />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
