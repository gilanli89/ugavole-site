"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import type { MapEvent } from "@/components/HaritaMap";
import { MapPin, Filter, RefreshCw } from "lucide-react";

const MapComponent = dynamic(() => import("@/components/HaritaMap"), { ssr: false });

const mockEvents: MapEvent[] = [
  {
    id: 1,
    title: "Girne - Lefkoşa Anayolunda Zincirleme Kaza",
    category: "kaza",
    lat: 35.3317,
    lng: 33.3192,
    time: "14:32",
    description: "3 araç karıştı, trafik yavaşlıyor",
    source: "ugavole"
  },
  {
    id: 2,
    title: "Gazimağusa'da Bina Yangını",
    category: "yangin",
    lat: 35.1264,
    lng: 33.9419,
    time: "13:15",
    description: "İtfaiye ekipleri müdahale ediyor",
    source: "ugavole"
  },
  {
    id: 3,
    title: "Lefkoşa'da Su Kesintisi",
    category: "hizmet",
    lat: 35.1856,
    lng: 33.3823,
    time: "12:00",
    description: "Çarşamba 18:00'e kadar kesinti var",
    source: "ugavole"
  },
  {
    id: 4,
    title: "Karaoğlanoğlu'nda Yoğun Sis",
    category: "hava",
    lat: 35.3592,
    lng: 33.2650,
    time: "09:45",
    description: "Görüş mesafesi 50 metrenin altında",
    source: "ugavole"
  },
  {
    id: 5,
    title: "Lefkoşa - Girne Anayolunda Yoğun Trafik",
    category: "trafik",
    lat: 35.2750,
    lng: 33.2950,
    time: "08:30",
    description: "Sabah trafiği nedeniyle yoğunluk yaşanıyor",
    source: "ugavole"
  },
  {
    id: 6,
    title: "Güzelyurt'ta Belediye Çalışması",
    category: "hizmet",
    lat: 35.1997,
    lng: 32.9939,
    time: "10:00",
    description: "Yol genişletme çalışması devam ediyor",
    source: "ugavole"
  }
];

const FILTERS = [
  { label: "Tümü",     value: "tumu",   color: "#F5C518" },
  { label: "⚡ Elektrik/Su", value: "hizmet",  color: "#a855f7" },
  { label: "🚗 Trafik",     value: "trafik",  color: "#3b82f6" },
  { label: "🔥 Yangın",     value: "yangin",  color: "#f97316" },
  { label: "💥 Kaza",       value: "kaza",    color: "#ef4444" },
  { label: "📰 Haber",      value: "haber",   color: "#F5C518" },
  { label: "🌊 Diğer",      value: "hava",    color: "#06b6d4" },
];

const CATEGORY_COLORS: Record<string, string> = {
  kaza: "bg-red-500",
  yangin: "bg-orange-500",
  haber: "bg-yellow-500",
  trafik: "bg-blue-500",
  hizmet: "bg-purple-500",
  hava: "bg-cyan-500",
};

export default function HaritaPage() {
  const [activeFilter, setActiveFilter] = useState("tumu");
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [rssEvents, setRssEvents] = useState<MapEvent[]>([]);
  const [rssLoading, setRssLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchRssEvents = async () => {
    setRssLoading(true);
    try {
      const res = await fetch("/api/harita");
      const data = await res.json();
      if (data.events?.length > 0) setRssEvents(data.events);
      setLastFetch(new Date());
    } catch {
      // fallback to mock
    } finally {
      setRssLoading(false);
    }
  };

  useEffect(() => {
    fetchRssEvents();
    const id = setInterval(fetchRssEvents, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const allEvents = rssEvents.length > 0
    ? [...rssEvents, ...mockEvents]
    : mockEvents;

  const filteredEvents = activeFilter === "tumu"
    ? allEvents
    : allEvents.filter((e) => e.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-black text-2xl flex items-center gap-2">
            <MapPin className="w-6 h-6 text-ugavole-yellow" />
            Kıbrıs Anlık Harita
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kuzey Kıbrıs&apos;ta anlık olayları takip et</p>
        </div>
        <div className="flex items-center gap-3">
          {rssLoading && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />}
          {lastFetch && (
            <span className="text-xs text-gray-500">
              {lastFetch.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button onClick={fetchRssEvents} className="p-1 hover:bg-ugavole-surface-2 rounded-lg transition-colors" title="Yenile">
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-blink" />
          <span className="text-xs text-green-400 font-bold">CANLI</span>
        </div>
      </div>

      {/* Filtre butonları */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <Filter className="w-4 h-4 text-gray-500 flex-shrink-0 mt-2" />
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              activeFilter === f.value
                ? "bg-ugavole-yellow text-black"
                : "bg-ugavole-surface text-gray-400 hover:bg-ugavole-surface-2 border border-ugavole-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: "70vh" }}>
        {/* Sol panel */}
        <div className="bg-ugavole-surface border border-ugavole-border rounded-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-ugavole-black flex items-center justify-between border-b border-ugavole-border">
            <h2 className="text-white font-black text-sm uppercase tracking-wider">Olaylar</h2>
            <span className="bg-ugavole-yellow text-black text-xs font-black px-2 py-0.5 rounded-full">
              {filteredEvents.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-ugavole-border">
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`w-full text-left px-4 py-3 hover:bg-ugavole-surface-2 transition-colors ${
                  selectedEvent?.id === event.id ? "bg-ugavole-surface-2 border-l-2 border-ugavole-yellow" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`${CATEGORY_COLORS[event.category] ?? "bg-gray-500"} w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold leading-snug line-clamp-2">{event.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{event.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-ugavole-yellow text-xs font-bold">{event.time}</span>
                      <span className="text-gray-600 text-xs">{event.source}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {filteredEvents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-2xl mb-2">🗺️</p>
                <p className="text-sm">Bu kategori için olay yok</p>
              </div>
            )}
          </div>
        </div>

        {/* Harita */}
        <div className="lg:col-span-2 bg-ugavole-surface border border-ugavole-border rounded-2xl overflow-hidden">
          <MapComponent
            events={allEvents}
            activeFilter={activeFilter}
            onMarkerClick={setSelectedEvent}
          />
        </div>
      </div>

      {/* Seçili olay detay */}
      {selectedEvent && (
        <div className="mt-4 bg-ugavole-surface border border-ugavole-yellow/40 rounded-2xl p-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`${CATEGORY_COLORS[selectedEvent.category] ?? "bg-gray-500"} w-2 h-2 rounded-full`} />
              <span className="text-ugavole-yellow text-xs font-black uppercase">{selectedEvent.category}</span>
              <span className="text-gray-500 text-xs">{selectedEvent.time}</span>
            </div>
            <h3 className="text-white font-black text-base">{selectedEvent.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{selectedEvent.description}</p>
          </div>
          <button
            onClick={() => setSelectedEvent(null)}
            className="text-gray-500 hover:text-white text-lg flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
