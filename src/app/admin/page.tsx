"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PlusCircle, List, Rss, Save, CheckCircle, AlertCircle, Trash2, Edit, Camera, LayoutList, Plus, ChevronUp, ChevronDown, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Haber = {
  id: string;
  baslik: string;
  ozet: string;
  kategori: string;
  icerik_tipi: string;
  gorsel_url: string;
  kaynak_url: string;
  one_cikar: boolean;
  haritada_goster: boolean;
  harita_lat: string;
  harita_lng: string;
  harita_olay_tipi: string;
  harita_konum_adi: string;
  yayinlanma_tarihi: string;
  aktif: boolean;
};

const KATEGORILER = ["Gündem", "Kültür", "Eğlence", "Yemek", "Gezi", "Quiz", "Liste", "Spor", "Ekonomi"];
const ICERIK_TIPLERI = ["Haber", "Liste", "Quiz", "Meme", "Video"];
const OLAY_TIPLERI = ["kaza", "yangin", "trafik", "hizmet", "haber", "hava"];

const RSS_KAYNAKLAR = [
  { name: "Havadis Kıbrıs", url: "https://www.havadiskibris.com/feed/", aktif: true, son_cekim: "2 dk önce" },
  { name: "Kıbrıs Gazetesi", url: "https://www.kibrisgazetesi.com/rss", aktif: true, son_cekim: "5 dk önce" },
  { name: "Detay Kıbrıs", url: "https://www.detaykibris.com/feed/", aktif: true, son_cekim: "8 dk önce" },
  { name: "Cyprus Mail", url: "https://cyprus-mail.com/feed/", aktif: true, son_cekim: "3 dk önce" },
  { name: "Yeni Düzen", url: "https://www.yeniduzen.com/rss", aktif: false, son_cekim: "—" },
];

const EMPTY_FORM: Omit<Haber, "id" | "yayinlanma_tarihi" | "aktif"> = {
  baslik: "",
  ozet: "",
  kategori: "Gündem",
  icerik_tipi: "Haber",
  gorsel_url: "",
  kaynak_url: "",
  one_cikar: false,
  haritada_goster: false,
  harita_lat: "",
  harita_lng: "",
  harita_olay_tipi: "haber",
  harita_konum_adi: "",
};

type GbFoto = { id: string; gorsel_url: string; konum: string | null; yukleyen_ad: string | null; aciklama: string | null; oylar: number };
type ListeMadde = { sira: number; baslik: string; aciklama: string; gorsel_url: string };
type Gorus = { id: string; tip: string; sayfa: string; mesaj: string; email: string | null; olusturulma: string; okundu: boolean };

export default function AdminPage() {
  const [tab, setTab] = useState<"yukle" | "liste" | "rss" | "fotograf" | "listeler" | "gorusler">("yukle");
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [haberler, setHaberler] = useState<Haber[]>([]);

  // Fotoğraf onay state
  const [gbFotolar, setGbFotolar] = useState<GbFoto[]>([]);
  const [gbLoading, setGbLoading] = useState(false);

  // Görüşler state
  const [gorusler, setGorusler] = useState<Gorus[]>([]);
  const [goruslerLoading, setGoruslerLoading] = useState(false);
  const [okunmamis, setOkunmamis] = useState(0);

  // Liste oluştur state
  const [listeForm, setListeForm] = useState({ baslik: "", ozet: "", kapak_gorsel: "", kategori: "Gezi" });
  const [listeMaddeler, setListeMaddeler] = useState<ListeMadde[]>([
    { sira: 1, baslik: "", aciklama: "", gorsel_url: "" }
  ]);
  const [listeStatus, setListeStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  const fetchGbFotolar = useCallback(async () => {
    setGbLoading(true);
    const sb = createClient();
    const { data } = await sb.from("gunbatimi_fotolar").select("*").eq("aktif", false).order("olusturulma", { ascending: false });
    if (data) setGbFotolar(data as GbFoto[]);
    setGbLoading(false);
  }, []);

  const fetchGorusler = useCallback(async () => {
    setGoruslerLoading(true);
    const sb = createClient();
    const { data } = await sb.from("gorusler").select("*").order("olusturulma", { ascending: false }).limit(100);
    if (data) {
      setGorusler(data as Gorus[]);
      setOkunmamis(data.filter((g: Gorus) => !g.okundu).length);
    }
    setGoruslerLoading(false);
  }, []);

  const gorusuOku = async (id: string) => {
    const sb = createClient();
    await sb.from("gorusler").update({ okundu: true }).eq("id", id);
    setGorusler((prev) => prev.map((g) => g.id === id ? { ...g, okundu: true } : g));
    setOkunmamis((n) => Math.max(0, n - 1));
  };

  const gorusuSil = async (id: string) => {
    const sb = createClient();
    await sb.from("gorusler").delete().eq("id", id);
    setGorusler((prev) => prev.filter((g) => g.id !== id));
  };

  useEffect(() => {
    if (tab === "fotograf") fetchGbFotolar();
    if (tab === "gorusler") fetchGorusler();
  }, [tab, fetchGbFotolar, fetchGorusler]);

  const onaylaFoto = async (id: string) => {
    const sb = createClient();
    await sb.from("gunbatimi_fotolar").update({ aktif: true }).eq("id", id);
    setGbFotolar((prev) => prev.filter((f) => f.id !== id));
  };

  const silFoto = async (id: string) => {
    const sb = createClient();
    await sb.from("gunbatimi_fotolar").delete().eq("id", id);
    setGbFotolar((prev) => prev.filter((f) => f.id !== id));
  };

  const addMadde = () => setListeMaddeler((prev) => [
    ...prev, { sira: prev.length + 1, baslik: "", aciklama: "", gorsel_url: "" }
  ]);

  const updateMadde = (idx: number, field: keyof ListeMadde, value: string | number) =>
    setListeMaddeler((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));

  const moveMadde = (idx: number, dir: -1 | 1) => {
    const next = [...listeMaddeler];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setListeMaddeler(next.map((m, i) => ({ ...m, sira: i + 1 })));
  };

  const saveListe = async () => {
    if (!listeForm.baslik) return;
    setListeStatus("loading");
    try {
      const sb = createClient();
      const slug = listeForm.baslik
        .toLowerCase()
        .replace(/ş/g,"s").replace(/ç/g,"c").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ö/g,"o").replace(/ı/g,"i")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      const { data: icerik, error } = await sb
        .from("liste_icerikler")
        .insert({ ...listeForm, slug, aktif: true })
        .select()
        .single();
      if (error) throw error;

      const maddeRows = listeMaddeler
        .filter((m) => m.baslik.trim())
        .map((m) => ({ icerik_id: icerik.id, sira: m.sira, baslik: m.baslik, aciklama: m.aciklama || null, gorsel_url: m.gorsel_url || null, oylar: 0 }));
      if (maddeRows.length > 0) await sb.from("liste_maddeler").insert(maddeRows);

      setListeStatus("ok");
      setListeForm({ baslik: "", ozet: "", kapak_gorsel: "", kategori: "Gezi" });
      setListeMaddeler([{ sira: 1, baslik: "", aciklama: "", gorsel_url: "" }]);
      setTimeout(() => setListeStatus("idle"), 4000);
    } catch {
      setListeStatus("err");
      setTimeout(() => setListeStatus("idle"), 3000);
    }
  };

  // localStorage'dan haberleri yükle
  useEffect(() => {
    const saved = localStorage.getItem("ugavole_haberler");
    if (saved) {
      try {
        setHaberler(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveToStorage = (items: Haber[]) => {
    localStorage.setItem("ugavole_haberler", JSON.stringify(items));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.baslik.trim()) return;

    setStatus("loading");

    try {
      // Supabase yoksa localStorage kullan
      const yeniHaber: Haber = {
        ...form,
        id: crypto.randomUUID(),
        yayinlanma_tarihi: new Date().toISOString(),
        aktif: true,
      };

      // API'ye POST dene
      try {
        const res = await fetch("/api/haberler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(yeniHaber),
        });
        if (!res.ok) throw new Error("API hatası");
      } catch {
        // API başarısız → localStorage fallback
        const updated = [yeniHaber, ...haberler];
        setHaberler(updated);
        saveToStorage(updated);
      }

      setStatus("success");
      setForm(EMPTY_FORM);
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleDelete = (id: string) => {
    const updated = haberler.filter((h) => h.id !== id);
    setHaberler(updated);
    saveToStorage(updated);
  };

  const update = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-white font-black text-2xl">⚙️ Admin Paneli</h1>
        <p className="text-gray-500 text-sm mt-1">Haber yönetimi ve RSS takibi</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6 border-b border-ugavole-border">
        {([
          { key: "yukle",    label: "Haber Yükle",    icon: PlusCircle,   badge: 0  },
          { key: "liste",    label: "Haberler",        icon: List,         badge: 0  },
          { key: "rss",      label: "RSS",             icon: Rss,          badge: 0  },
          { key: "fotograf", label: "Fotoğraf Onay",   icon: Camera,       badge: 0  },
          { key: "listeler", label: "Liste Oluştur",   icon: LayoutList,   badge: 0  },
          { key: "gorusler", label: "Görüşler",        icon: MessageSquare, badge: okunmamis },
        ] as const).map(({ key, label, icon: Icon, badge }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors -mb-px ${
              tab === key
                ? "border-ugavole-yellow text-ugavole-yellow"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {badge > 0 && (
              <span className="bg-red-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full leading-none">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: Haber Yükle */}
      {tab === "yukle" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Başlık */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Başlık *</label>
              <input
                type="text"
                value={form.baslik}
                onChange={(e) => update("baslik", e.target.value)}
                placeholder="Haber başlığını gir..."
                required
                className="w-full bg-ugavole-surface border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              />
            </div>

            {/* Özet */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-300 mb-1.5">
                Özet
                <span className="text-gray-500 font-normal ml-1">({form.ozet.length}/300)</span>
              </label>
              <textarea
                value={form.ozet}
                onChange={(e) => update("ozet", e.target.value.slice(0, 300))}
                placeholder="Kısa özet..."
                rows={3}
                className="w-full bg-ugavole-surface border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors resize-none"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Kategori</label>
              <select
                value={form.kategori}
                onChange={(e) => update("kategori", e.target.value)}
                className="w-full bg-ugavole-surface border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              >
                {KATEGORILER.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            {/* İçerik Tipi */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">İçerik Tipi</label>
              <select
                value={form.icerik_tipi}
                onChange={(e) => update("icerik_tipi", e.target.value)}
                className="w-full bg-ugavole-surface border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              >
                {ICERIK_TIPLERI.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Görsel URL */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Görsel URL</label>
              <input
                type="url"
                value={form.gorsel_url}
                onChange={(e) => update("gorsel_url", e.target.value)}
                placeholder="https://..."
                className="w-full bg-ugavole-surface border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              />
            </div>

            {/* Kaynak URL */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Kaynak URL (opsiyonel)</label>
              <input
                type="url"
                value={form.kaynak_url}
                onChange={(e) => update("kaynak_url", e.target.value)}
                placeholder="https://..."
                className="w-full bg-ugavole-surface border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => update("one_cikar", !form.one_cikar)}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.one_cikar ? "bg-ugavole-yellow" : "bg-ugavole-border"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.one_cikar ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-gray-300 font-medium">Öne Çıkar</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => update("haritada_goster", !form.haritada_goster)}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.haritada_goster ? "bg-ugavole-yellow" : "bg-ugavole-border"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.haritada_goster ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-gray-300 font-medium">Harita&apos;ya Ekle</span>
            </label>
          </div>

          {/* Harita alanları */}
          {form.haritada_goster && (
            <div className="bg-ugavole-surface-2 border border-ugavole-border rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Konum Adı</label>
                <input
                  type="text"
                  value={form.harita_konum_adi}
                  onChange={(e) => update("harita_konum_adi", e.target.value)}
                  placeholder="ör: Girne Anayolu"
                  className="w-full bg-ugavole-surface border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Enlem</label>
                <input
                  type="number"
                  step="any"
                  value={form.harita_lat}
                  onChange={(e) => update("harita_lat", e.target.value)}
                  placeholder="35.1856"
                  className="w-full bg-ugavole-surface border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Boylam</label>
                <input
                  type="number"
                  step="any"
                  value={form.harita_lng}
                  onChange={(e) => update("harita_lng", e.target.value)}
                  placeholder="33.3823"
                  className="w-full bg-ugavole-surface border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Olay Tipi</label>
                <select
                  value={form.harita_olay_tipi}
                  onChange={(e) => update("harita_olay_tipi", e.target.value)}
                  className="w-full bg-ugavole-surface border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
                >
                  {OLAY_TIPLERI.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading" || !form.baslik.trim()}
            className="flex items-center gap-2 bg-ugavole-yellow text-black px-8 py-3 rounded-full font-black text-sm hover:bg-ugavole-yellow-dark transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {status === "loading" ? "Kaydediliyor..." : "Haberi Kaydet"}
          </button>

          {status === "success" && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              Haber başarıyla kaydedildi!
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Hata oluştu. Tekrar dene.
            </div>
          )}
        </form>
      )}

      {/* TAB 2: Mevcut Haberler */}
      {tab === "liste" && (
        <div>
          {haberler.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-4xl mb-3">📋</p>
              <p>Henüz haber yüklenmedi.</p>
              <button onClick={() => setTab("yukle")} className="mt-4 text-ugavole-yellow text-sm font-bold hover:underline">
                İlk haberi ekle →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {haberler.map((haber) => (
                <div key={haber.id} className="bg-ugavole-surface border border-ugavole-border rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-ugavole-yellow/10 text-ugavole-yellow text-xs font-bold px-2 py-0.5 rounded-full">
                        {haber.kategori}
                      </span>
                      <span className="bg-ugavole-surface-2 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                        {haber.icerik_tipi}
                      </span>
                      {haber.one_cikar && <span className="text-xs text-orange-400 font-bold">⭐ Öne Çıkan</span>}
                      {haber.haritada_goster && <span className="text-xs text-cyan-400 font-bold">🗺️ Haritada</span>}
                    </div>
                    <h3 className="text-white font-bold text-sm line-clamp-2">{haber.baslik}</h3>
                    {haber.ozet && <p className="text-gray-500 text-xs mt-1 line-clamp-1">{haber.ozet}</p>}
                    <p className="text-gray-600 text-xs mt-1.5">
                      {new Date(haber.yayinlanma_tarihi).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-2 text-gray-500 hover:text-ugavole-yellow transition-colors rounded-lg hover:bg-ugavole-surface-2">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(haber.id)}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-ugavole-surface-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Fotoğraf Onay */}
      {tab === "fotograf" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">{gbFotolar.length} fotoğraf onay bekliyor</p>
            <button onClick={fetchGbFotolar} className="text-xs text-ugavole-yellow font-bold hover:underline">Yenile</button>
          </div>
          {gbLoading ? (
            <div className="text-center py-12 text-gray-500 text-sm">Yükleniyor...</div>
          ) : gbFotolar.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-3xl mb-2">📸</p>
              <p>Onay bekleyen fotoğraf yok.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gbFotolar.map((foto) => (
                <div key={foto.id} className="bg-ugavole-surface border border-ugavole-border rounded-2xl overflow-hidden">
                  <div className="relative w-full h-36">
                    <Image src={foto.gorsel_url} alt={foto.konum ?? "foto"} fill className="object-cover" loading="lazy" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                  <div className="p-3">
                    {foto.konum && <p className="text-white font-bold text-sm">{foto.konum}</p>}
                    {foto.yukleyen_ad && <p className="text-gray-400 text-xs">{foto.yukleyen_ad}</p>}
                    {foto.aciklama && <p className="text-gray-500 text-xs mt-1">{foto.aciklama}</p>}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => onaylaFoto(foto.id)}
                        className="flex-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded-xl py-2 text-xs font-bold hover:bg-green-600/30 transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Onayla
                      </button>
                      <button
                        onClick={() => silFoto(foto.id)}
                        className="flex-1 bg-red-600/20 text-red-400 border border-red-600/30 rounded-xl py-2 text-xs font-bold hover:bg-red-600/30 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Liste Oluştur */}
      {tab === "listeler" && (
        <div className="space-y-6">
          {/* Liste Bilgileri */}
          <div className="bg-ugavole-surface border border-ugavole-border rounded-2xl p-5 space-y-4">
            <h3 className="text-white font-black text-sm uppercase tracking-wider">Liste Bilgileri</h3>
            <input
              type="text"
              value={listeForm.baslik}
              onChange={(e) => setListeForm((f) => ({ ...f, baslik: e.target.value }))}
              placeholder="Liste başlığı (örn: Kıbrıs'ta Yenmeden Geçilmez 10 Yemek)"
              className="w-full bg-ugavole-surface-2 border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
            />
            <textarea
              value={listeForm.ozet}
              onChange={(e) => setListeForm((f) => ({ ...f, ozet: e.target.value }))}
              placeholder="Kısa özet..."
              rows={2}
              className="w-full bg-ugavole-surface-2 border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="url"
                value={listeForm.kapak_gorsel}
                onChange={(e) => setListeForm((f) => ({ ...f, kapak_gorsel: e.target.value }))}
                placeholder="Kapak görsel URL"
                className="w-full bg-ugavole-surface-2 border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              />
              <select
                value={listeForm.kategori}
                onChange={(e) => setListeForm((f) => ({ ...f, kategori: e.target.value }))}
                className="w-full bg-ugavole-surface-2 border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              >
                {["Gezi", "Yemek", "Kültür", "Eğlence", "Tarih", "Doğa", "Genel"].map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Maddeler */}
          <div className="space-y-3">
            <h3 className="text-white font-black text-sm uppercase tracking-wider">Maddeler</h3>
            {listeMaddeler.map((madde, idx) => (
              <div key={idx} className="bg-ugavole-surface border border-ugavole-border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 bg-ugavole-yellow text-black rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                    {madde.sira}
                  </span>
                  <div className="flex gap-1 ml-auto">
                    <button onClick={() => moveMadde(idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30 rounded-lg hover:bg-ugavole-surface-2 transition-colors">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveMadde(idx, 1)} disabled={idx === listeMaddeler.length - 1} className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30 rounded-lg hover:bg-ugavole-surface-2 transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => setListeMaddeler((prev) => prev.filter((_, i) => i !== idx).map((m, i) => ({ ...m, sira: i + 1 })))} className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-ugavole-surface-2 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={madde.baslik}
                    onChange={(e) => updateMadde(idx, "baslik", e.target.value)}
                    placeholder="Madde başlığı"
                    className="w-full bg-ugavole-surface-2 border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors"
                  />
                  <textarea
                    value={madde.aciklama}
                    onChange={(e) => updateMadde(idx, "aciklama", e.target.value)}
                    placeholder="Açıklama..."
                    rows={2}
                    className="w-full bg-ugavole-surface-2 border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors resize-none"
                  />
                  <input
                    type="url"
                    value={madde.gorsel_url}
                    onChange={(e) => updateMadde(idx, "gorsel_url", e.target.value)}
                    placeholder="Görsel URL (opsiyonel)"
                    className="w-full bg-ugavole-surface-2 border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addMadde}
              className="w-full border-2 border-dashed border-ugavole-border text-gray-500 hover:border-ugavole-yellow hover:text-ugavole-yellow rounded-2xl py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Madde Ekle
            </button>
          </div>

          {/* Kaydet */}
          <button
            onClick={saveListe}
            disabled={listeStatus === "loading" || !listeForm.baslik}
            className="flex items-center gap-2 bg-ugavole-yellow text-black px-8 py-3 rounded-full font-black text-sm hover:bg-ugavole-yellow-dark transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {listeStatus === "loading" ? "Kaydediliyor..." : "Listeyi Yayınla"}
          </button>
          {listeStatus === "ok" && <p className="text-green-400 text-sm font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Liste yayınlandı!</p>}
          {listeStatus === "err" && <p className="text-red-400 text-sm font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Hata oluştu.</p>}
        </div>
      )}

      {/* TAB 3: RSS Feed Durumu */}
      {tab === "rss" && (
        <div className="space-y-3">
          {RSS_KAYNAKLAR.map((kaynak, i) => (
            <div key={i} className="bg-ugavole-surface border border-ugavole-border rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${kaynak.aktif ? "bg-green-400" : "bg-gray-600"}`} />
                <div>
                  <p className="text-white font-bold text-sm">{kaynak.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate max-w-xs">{kaynak.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className={`text-xs font-bold ${kaynak.aktif ? "text-green-400" : "text-gray-500"}`}>
                    {kaynak.aktif ? "Aktif" : "Pasif"}
                  </p>
                  <p className="text-xs text-gray-500">Son: {kaynak.son_cekim}</p>
                </div>
                <button className="bg-ugavole-surface-2 text-ugavole-yellow border border-ugavole-border px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-ugavole-yellow hover:text-black transition-colors">
                  Şimdi Çek
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 bg-ugavole-surface-2 border border-ugavole-border rounded-xl p-4 text-sm text-gray-400">
            <p className="font-bold text-white mb-1">RSS Otomatik Çekim</p>
            <p>RSS kaynakları her 15 dakikada bir otomatik olarak çekilir. Manuel çekim için &quot;Şimdi Çek&quot; butonunu kullan.</p>
          </div>
        </div>
      )}

      {/* TAB 6: Görüşler */}
      {tab === "gorusler" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-white font-black text-sm">
                Kullanıcı Görüşleri
                {okunmamis > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{okunmamis} yeni</span>
                )}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">FeedbackWidget ve iletişim formu gönderileri</p>
            </div>
            <button onClick={fetchGorusler} className="text-xs text-ugavole-yellow hover:underline">Yenile</button>
          </div>

          {goruslerLoading ? (
            <div className="text-center py-12 text-gray-500 text-sm">Yükleniyor...</div>
          ) : gorusler.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-3xl mb-2">💬</p>
              <p>Henüz görüş yok.</p>
            </div>
          ) : (
            gorusler.map((g) => (
              <div
                key={g.id}
                className={`bg-ugavole-surface border rounded-2xl p-4 ${!g.okundu ? "border-ugavole-yellow/40" : "border-ugavole-border"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        g.tip === "hata" ? "bg-red-500/20 text-red-400" :
                        g.tip === "oneri" ? "bg-yellow-500/20 text-yellow-400" :
                        g.tip === "iletisim" ? "bg-blue-500/20 text-blue-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        {g.tip === "hata" ? "🐛 Hata" : g.tip === "oneri" ? "💡 Öneri" : g.tip === "iletisim" ? "✉️ İletişim" : "👍 Genel"}
                      </span>
                      <span className="text-xs text-gray-500">{g.sayfa}</span>
                      <span className="text-xs text-gray-600">
                        {new Date(g.olusturulma).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {!g.okundu && <span className="text-xs bg-ugavole-yellow text-black px-1.5 py-0.5 rounded-full font-black">YENİ</span>}
                    </div>
                    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{g.mesaj}</p>
                    {g.email && <p className="text-xs text-ugavole-yellow mt-1">{g.email}</p>}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {!g.okundu && (
                      <button
                        onClick={() => gorusuOku(g.id)}
                        className="p-1.5 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors"
                        title="Okundu olarak işaretle"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => gorusuSil(g.id)}
                      className="p-1.5 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
