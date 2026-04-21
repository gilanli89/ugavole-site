"use client";

import { useEffect, useState } from "react";
import { Wind, Droplets, Thermometer, MapPin } from "lucide-react";
import type { WeatherData, City } from "@/lib/api/weather";
import { KKTC_CITIES } from "@/lib/api/weather";

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState<string>("lefkosa");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/hava?city=${selectedCity}`)
      .then((r) => r.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCity]);

  const weatherEmoji = (icon: string) => {
    if (icon.startsWith("01")) return "☀️";
    if (icon.startsWith("02")) return "⛅";
    if (icon.startsWith("03") || icon.startsWith("04")) return "☁️";
    if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
    if (icon.startsWith("11")) return "⛈️";
    if (icon.startsWith("13")) return "❄️";
    if (icon.startsWith("50")) return "🌫️";
    return "🌤️";
  };

  const dayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", { weekday: "short" });
  };

  return (
    <div className="bg-gradient-to-br from-sky-500 to-blue-700 text-white rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-sm uppercase tracking-wider opacity-80">Hava Durumu</h2>
        <a href="/hava-durumu" className="text-xs opacity-70 hover:opacity-100 underline">
          Tümü →
        </a>
      </div>

      {/* Şehir seçici */}
      <div className="flex gap-1 flex-wrap mb-4">
        {KKTC_CITIES.map((city: City) => (
          <button
            key={city.id}
            onClick={() => setSelectedCity(city.id)}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
              selectedCity === city.id
                ? "bg-white text-blue-700"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-white/20 rounded-lg" />
          <div className="h-4 bg-white/20 rounded w-3/4" />
        </div>
      ) : weather ? (
        <>
          {/* Mevcut hava */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{weather.temp}°</span>
                <span className="text-sm opacity-80">Hissedilen {weather.feels_like}°</span>
              </div>
              <p className="text-sm capitalize mt-1">{weather.description}</p>
              <div className="flex items-center gap-1 mt-1 opacity-70">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{weather.city}</span>
              </div>
            </div>
            <span className="text-6xl">{weatherEmoji(weather.icon)}</span>
          </div>

          {/* Detaylar */}
          <div className="flex gap-4 text-xs opacity-80 mb-4 bg-white/10 rounded-xl p-2">
            <div className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" />
              <span>%{weather.humidity}</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5" />
              <span>{weather.wind_speed} km/s</span>
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5" />
              <span>Hissedilen {weather.feels_like}°</span>
            </div>
          </div>

          {/* 5 günlük tahmin */}
          {weather.forecast.length > 0 && (
            <div className="flex justify-between">
              {weather.forecast.slice(0, 5).map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1 text-xs">
                  <span className="opacity-70">{i === 0 ? "Bug." : dayName(day.date)}</span>
                  <span className="text-lg">{weatherEmoji(day.icon)}</span>
                  <span className="font-semibold">{day.temp_max}°</span>
                  <span className="opacity-60">{day.temp_min}°</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm opacity-70">Hava durumu yüklenemedi.</p>
      )}
    </div>
  );
}
