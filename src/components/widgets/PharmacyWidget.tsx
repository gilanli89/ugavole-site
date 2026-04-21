"use client";

import { useEffect, useState } from "react";
import { Phone, MapPin, Clock, Pill } from "lucide-react";
import type { Pharmacy } from "@/app/api/eczane/route";

export default function PharmacyWidget() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/eczane")
      .then((r) => r.json())
      .then((data) => {
        setPharmacies(data.pharmacies ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-green-700 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4" />
          <h2 className="font-bold text-sm uppercase tracking-wider">Nöbetçi Eczaneler</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-70">{today}</span>
          <a href="/eczaneler" className="text-xs opacity-70 hover:opacity-100 underline">
            Tümü →
          </a>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-4 py-3 animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-3 bg-gray-100 rounded w-56" />
            </div>
          ))
        ) : pharmacies.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-500">Nöbetçi eczane bilgisi bulunamadı.</p>
        ) : (
          pharmacies.slice(0, 4).map((ph) => (
            <div key={ph.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{ph.name}</p>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{ph.address}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{ph.open_hours}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={`tel:${ph.phone}`}
                  className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 px-2.5 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  Ara
                </a>
              </div>
              <span className="inline-block mt-1.5 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {ph.district}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
