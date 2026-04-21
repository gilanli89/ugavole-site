export type City = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

export const KKTC_CITIES: City[] = [
  { id: "lefkosa", name: "Lefkoşa", lat: 35.1856, lon: 33.3823 },
  { id: "gazimagusa", name: "Gazimağusa", lat: 35.1264, lon: 33.9355 },
  { id: "girne", name: "Girne", lat: 35.3411, lon: 33.3194 },
  { id: "guzelyurt", name: "Güzelyurt", lat: 35.2006, lon: 32.9937 },
  { id: "iskele", name: "İskele", lat: 35.2913, lon: 33.8936 },
];

export type WeatherData = {
  city: string;
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  forecast: ForecastDay[];
  fetched_at: string;
};

export type ForecastDay = {
  date: string;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
};

export async function fetchWeather(cityId: string): Promise<WeatherData> {
  const city = KKTC_CITIES.find((c) => c.id === cityId) ?? KKTC_CITIES[0];
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    // API key yoksa Open-Meteo'yu ücretsiz kullan
    return fetchWeatherOpenMeteo(city);
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric&lang=tr&cnt=40`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) return fetchWeatherOpenMeteo(city);

  const data = await res.json();
  const current = data.list[0];

  const forecastMap = new Map<string, ForecastDay>();
  for (const item of data.list) {
    const date = item.dt_txt.split(" ")[0];
    if (!forecastMap.has(date)) {
      forecastMap.set(date, {
        date,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      });
    } else {
      const existing = forecastMap.get(date)!;
      existing.temp_min = Math.min(existing.temp_min, item.main.temp_min);
      existing.temp_max = Math.max(existing.temp_max, item.main.temp_max);
    }
  }

  return {
    city: city.name,
    temp: Math.round(current.main.temp),
    feels_like: Math.round(current.main.feels_like),
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    humidity: current.main.humidity,
    wind_speed: Math.round(current.wind.speed * 3.6),
    forecast: Array.from(forecastMap.values()).slice(0, 5),
    fetched_at: new Date().toISOString(),
  };
}

async function fetchWeatherOpenMeteo(city: City): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FNicosia&forecast_days=5`;

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error("Hava durumu verisi alınamadı");

  const data = await res.json();
  const { current, daily } = data;

  const wmoDesc = getWMODescription(current.weather_code);

  const forecast: ForecastDay[] = daily.time.slice(0, 5).map((date: string, i: number) => ({
    date,
    temp_min: Math.round(daily.temperature_2m_min[i]),
    temp_max: Math.round(daily.temperature_2m_max[i]),
    description: getWMODescription(daily.weather_code[i]).desc,
    icon: getWMODescription(daily.weather_code[i]).icon,
  }));

  return {
    city: city.name,
    temp: Math.round(current.temperature_2m),
    feels_like: Math.round(current.apparent_temperature),
    description: wmoDesc.desc,
    icon: wmoDesc.icon,
    humidity: current.relative_humidity_2m,
    wind_speed: Math.round(current.wind_speed_10m),
    forecast,
    fetched_at: new Date().toISOString(),
  };
}

function getWMODescription(code: number): { desc: string; icon: string } {
  if (code === 0) return { desc: "Açık", icon: "01d" };
  if (code <= 2) return { desc: "Az bulutlu", icon: "02d" };
  if (code === 3) return { desc: "Kapalı", icon: "04d" };
  if (code <= 49) return { desc: "Sisli", icon: "50d" };
  if (code <= 59) return { desc: "Çiseleyen yağmur", icon: "09d" };
  if (code <= 69) return { desc: "Yağmurlu", icon: "10d" };
  if (code <= 79) return { desc: "Karlı", icon: "13d" };
  if (code <= 82) return { desc: "Sağanak yağış", icon: "09d" };
  if (code <= 99) return { desc: "Fırtınalı", icon: "11d" };
  return { desc: "Değişken", icon: "03d" };
}
