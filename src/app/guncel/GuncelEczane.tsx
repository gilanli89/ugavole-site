"use client";

import { useState } from "react";
import { Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import type { Pharmacy } from "@/lib/api/pharmacy";

const SEHIRLER = ["Tümü", "Lefkoşa", "Gazimağusa", "Girne", "Güzelyurt", "İskele", "Lefke"];

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + " Kuzey Kıbrıs")}`;
}

export default function GuncelEczane({ pharmacies }: { pharmacies: Pharmacy[] }) {
  const [aktif, setAktif] = useState("Tümü");

  const counts = SEHIRLER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "Tümü"
      ? pharmacies.length
      : pharmacies.filter((p) => p.district.toLowerCase() === s.toLowerCase()).length;
    return acc;
  }, {});

  const filtered = aktif === "Tümü"
    ? pharmacies
    : pharmacies.filter((p) => p.district.toLowerCase() === aktif.toLowerCase());

  return (
    <div>
      {/* Şehir filtresi */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide -mx-1 px-1">
        {SEHIRLER.map((s) => {
          const c = counts[s] ?? 0;
          if (s !== "Tümü" && c === 0) return null;
          return (
            <button key={s} onClick={() => setAktif(s)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                aktif === s
                  ? "bg-ugavole-yellow text-black shadow-sm"
                  : "bg-ugavole-surface text-ugavole-muted hover:bg-ugavole-surface-2 border border-ugavole-border"
              }`}>
              {s}
              {c > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${
                  aktif === s ? "bg-black/15" : "bg-ugavole-surface-2 text-ugavole-muted"
                }`}>{c}</span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-ugavole-muted text-sm text-center py-8">Bu şehir için bugün nöbetçi eczane bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((ph) => (
            <div key={ph.id} className="bg-ugavole-surface border border-ugavole-border rounded-2xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-black text-ugavole-text text-sm leading-snug">{ph.name}</h3>
                <span className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  {ph.district}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-ugavole-muted mb-3">
                {ph.address && (
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{ph.address}</span>
                  </div>
                )}
                {ph.open_hours && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{ph.open_hours}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {ph.phone && (
                  <a href={`tel:${ph.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors">
                    <Phone className="w-3.5 h-3.5" /> Ara
                  </a>
                )}
                {ph.address && (
                  <a href={mapsUrl(ph.address)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 bg-ugavole-surface-2 hover:bg-ugavole-border text-ugavole-muted px-3 py-2 rounded-xl text-xs font-bold transition-colors border border-ugavole-border">
                    <ExternalLink className="w-3.5 h-3.5" /> Harita
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
