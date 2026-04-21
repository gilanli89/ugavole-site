"use client";

import { useEffect, useState } from "react";
import { Phone, MapPin, Clock, Pill, ExternalLink } from "lucide-react";

type Pharmacy = {
  id: number;
  name: string;
  address: string;
  phone: string;
  district: string;
  open_hours: string;
  detail_url?: string;
};

const SEHIRLER = ["Tümü", "Lefkoşa", "Gazimağusa", "Girne", "Güzelyurt", "İskele", "Lefke"];

function detectDistrict(address: string, district: string): string {
  if (district && district !== "Bilinmiyor") return district;
  const lower = address.toLowerCase();
  if (lower.includes("gazimağusa") || lower.includes("mağusa") || lower.includes("famagusta")) return "Gazimağusa";
  if (lower.includes("girne") || lower.includes("kyrenia")) return "Girne";
  if (lower.includes("güzelyurt") || lower.includes("morphou")) return "Güzelyurt";
  if (lower.includes("iskele") || lower.includes("trikomo")) return "İskele";
  if (lower.includes("lefke")) return "Lefke";
  if (lower.includes("lefkoşa") || lower.includes("nicosia")) return "Lefkoşa";
  return district;
}

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + " Kuzey Kıbrıs")}`;
}

export default function EczanelerPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [aktifSehir, setAktifSehir] = useState("Tümü");

  useEffect(() => {
    fetch("/api/eczane")
      .then((r) => r.json())
      .then((d) => {
        const list: Pharmacy[] = (d.pharmacies ?? []).map((ph: Pharmacy) => ({
          ...ph,
          district: detectDistrict(ph.address, ph.district),
        }));
        setPharmacies(list);
      })
      .catch(() => setPharmacies([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    aktifSehir === "Tümü"
      ? pharmacies
      : pharmacies.filter((ph) =>
          ph.district.toLowerCase() === aktifSehir.toLowerCase()
        );

  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Mevcut şehir sayıları
  const counts = SEHIRLER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "Tümü"
      ? pharmacies.length
      : pharmacies.filter((ph) => ph.district.toLowerCase() === s.toLowerCase()).length;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
          <Pill className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">Nöbetçi Eczaneler</h1>
          <p className="text-sm text-gray-500">{today}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        ⚠️ Acil durumlarda lütfen önce arayarak nöbet durumunu teyit ediniz.
      </p>

      {/* Şehir filtreleri */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {SEHIRLER.map((sehir) => {
          const count = counts[sehir] ?? 0;
          if (sehir !== "Tümü" && count === 0) return null;
          return (
            <button
              key={sehir}
              onClick={() => setAktifSehir(sehir)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                aktifSehir === sehir
                  ? "bg-ugavole-yellow text-black shadow-sm"
                  : "bg-white text-gray-600 hover:bg-[#F5F5F0] border border-[#E8E8E0]"
              }`}
            >
              {sehir}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${
                  aktifSehir === sehir ? "bg-black/15 text-black" : "bg-gray-100 text-gray-500"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* İçerik */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <Pill className="w-8 h-8 mx-auto mb-3 opacity-40 animate-spin" />
          <p className="text-sm">Eczaneler yükleniyor...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Pill className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">
            {aktifSehir === "Tümü"
              ? "Bugün için nöbetçi eczane bilgisi bulunamadı."
              : `${aktifSehir} için nöbetçi eczane bulunamadı.`}
          </p>
          {aktifSehir !== "Tümü" && (
            <button onClick={() => setAktifSehir("Tümü")} className="mt-3 text-sm text-ugavole-yellow-dark hover:underline font-bold">
              Tüm şehirleri göster
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {aktifSehir === "Tümü" ? "Tüm şehirler" : aktifSehir} — <span className="font-bold text-[#1A1A1A]">{filtered.length} nöbetçi eczane</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((ph) => (
              <div
                key={ph.id}
                className="bg-white rounded-2xl border border-[#E8E8E0] p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h2 className="font-black text-[#1A1A1A] leading-snug">{ph.name}</h2>
                  <span className="flex-shrink-0 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {ph.district}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {ph.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                      <span>{ph.address}</span>
                    </div>
                  )}
                  {ph.open_hours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      <span>{ph.open_hours}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {ph.phone && (
                    <a
                      href={`tel:${ph.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Telefonu Ara
                    </a>
                  )}
                  {ph.address && (
                    <a
                      href={mapsUrl(ph.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-[#F5F5F0] hover:bg-[#E8E8E0] text-gray-600 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors border border-[#E8E8E0]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Harita
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
