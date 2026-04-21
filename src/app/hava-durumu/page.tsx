import type { Metadata } from "next";
import { Cloud } from "lucide-react";
import { KKTC_CITIES } from "@/lib/api/weather";
import { fetchWeather } from "@/lib/api/weather";
import type { WeatherData } from "@/lib/api/weather";

export const metadata: Metadata = {
  title: "Hava Durumu",
  description: "Kuzey Kıbrıs hava durumu — Lefkoşa, Girne, Gazimağusa ve daha fazlası.",
};

const WEATHER_EMOJI: Record<string, string> = {
  "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
  "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
};

function getEmoji(icon: string) {
  return WEATHER_EMOJI[icon.slice(0, 2)] ?? "🌤️";
}

export default async function HavaDurumuPage() {
  const weatherResults = await Promise.allSettled(
    KKTC_CITIES.map((city) => fetchWeather(city.id))
  );

  const weathers: WeatherData[] = weatherResults
    .filter((r): r is PromiseFulfilledResult<WeatherData> => r.status === "fulfilled")
    .map((r) => r.value);

  const dayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "short" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center">
          <Cloud className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hava Durumu</h1>
          <p className="text-sm text-gray-500">Kuzey Kıbrıs — 5 günlük tahmin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {weathers.map((w) => (
          <div
            key={w.city}
            className="bg-gradient-to-br from-sky-500 to-blue-700 text-white rounded-2xl p-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{w.city}</h2>
              <span className="text-4xl">{getEmoji(w.icon)}</span>
            </div>

            <div className="mb-4">
              <span className="text-5xl font-bold">{w.temp}°C</span>
              <p className="text-sm opacity-80 mt-1 capitalize">{w.description}</p>
              <div className="flex gap-4 mt-2 text-xs opacity-70">
                <span>💧 %{w.humidity}</span>
                <span>💨 {w.wind_speed} km/s</span>
              </div>
            </div>

            {/* 5 günlük tahmin */}
            <div className="grid grid-cols-5 gap-1 border-t border-white/20 pt-3">
              {w.forecast.slice(0, 5).map((day, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs opacity-70 truncate">
                    {i === 0 ? "Bug." : day.date.slice(5).replace("-", "/")}
                  </p>
                  <p className="text-base my-0.5">{getEmoji(day.icon)}</p>
                  <p className="text-xs font-bold">{day.temp_max}°</p>
                  <p className="text-xs opacity-60">{day.temp_min}°</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
