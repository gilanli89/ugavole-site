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
    `relative px-3 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
      active
        ? "text-[#F5C518]"
        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
    }`;

  return (
    <header className="bg-white dark:bg-[#111111] sticky top-0 z-50 border-b border-gray-200 dark:border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-4">
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
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
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
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-44 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] rounded-2xl shadow-xl py-1.5 z-50"
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
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
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
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <Link
              href="/haber-yukle"
              className="hidden sm:flex items-center gap-1.5 bg-[#F5C518] hover:bg-[#D4A017] text-black px-4 py-2 rounded-full text-sm font-bold transition-colors"
            >
              <PenLine className="w-3.5 h-3.5" />
              Paylaş
            </Link>
            <button
              className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Haber, konu veya etiket ara..."
                autoFocus
                className="w-full bg-gray-100 dark:bg-white/5 border-2 border-gray-200 dark:border-[#2A2A2A] focus:border-[#F5C518] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Mobil menü */}
        {menuOpen && (
          <nav className="lg:hidden pb-4 pt-2 border-t border-gray-200 dark:border-[#2A2A2A]">
            <div className="space-y-0.5 mb-3">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                    isActive(item.href)
                      ? "bg-[#F5C518]/10 text-[#F5C518]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
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
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  Keşfet
                  <ChevronDown className={`w-4 h-4 transition-transform ${kesfetOpen ? "rotate-180" : ""}`} />
                </button>
                {kesfetOpen && (
                  <div className="ml-3 mt-0.5 border-l-2 border-gray-200 dark:border-[#2A2A2A] pl-3 space-y-0.5">
                    {KESFET_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => { setMenuOpen(false); setKesfetOpen(false); }}
                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors ${
                          isActive(item.href)
                            ? "text-[#F5C518] font-semibold"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
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

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-[#2A2A2A]">
              <Link
                href="/haber-yukle"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 bg-[#F5C518] text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#D4A017] transition-colors"
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
