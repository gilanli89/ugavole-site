import * as cheerio from "cheerio";

export type Pharmacy = {
  id: number;
  name: string;
  address: string;
  phone: string;
  district: string;
  open_hours: string;
  detail_url?: string;
};

const KTEB_URL = "https://www.kteb.org/dp/?lang=tr";

function normalizeDistrict(raw: string): string {
  const map: Record<string, string> = {
    "GAZİMAĞUSA": "Gazimağusa",
    "MAĞUSA": "Gazimağusa",
    "LEFKOŞA": "Lefkoşa",
    "GİRNE": "Girne",
    "GÜZELYURT": "Güzelyurt",
    "LEFKE": "Lefke",
    "İSKELE": "İskele",
    "KARPAZ": "Karpaz",
    "ÜST MESARYA": "Üst Mesarya",
    "ALT MESARYA": "Alt Mesarya",
  };
  const key = raw.replace(/BÖLGESİ/gi, "").trim().toUpperCase();
  return map[key] ?? key.charAt(0) + key.slice(1).toLowerCase();
}

export async function scrapePharmacies(): Promise<Pharmacy[]> {
  const res = await fetch(KTEB_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "tr-TR,tr;q=0.9",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`KTEB yanıt vermedi: ${res.status}`);

  const html = await res.text();
  const $ = cheerio.load(html);
  const pharmacies: Pharmacy[] = [];
  let id = 1;

  // Her bölge paneli: id="CpAll_DutyPharmacies_7_pnl*"
  $("[id^='CpAll_DutyPharmacies_7_pnl']").each((_i, panel) => {
    // Bölge adını bölge başlığı div'inden al
    const districtRaw = $(panel)
      .find(".col-md-12.text-center")
      .first()
      .text()
      .trim();
    const district = districtRaw ? normalizeDistrict(districtRaw) : "Bilinmiyor";

    // Her eczane article'ı
    $(panel).find("article").each((_j, article) => {
      const nameEl = $(article).find("h1.h4.title, h1.title, .h4.title").first();

      // Adı temizle: sadece eczane adı metni (alt elementleri hariç)
      const name = nameEl
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .trim();

      // Telefon: href="tel:..." olan link
      let phone = "";
      nameEl.find("a[href^='tel:']").each((_k, a) => {
        const num = ($(a).attr("href") ?? "").replace("tel:", "").trim();
        if (num) { phone = num; return false; } // ilk geçerli numarayı al
      });

      // Saat: icon-clock'dan sonraki td
      const hours = nameEl
        .find(".icon-clock")
        .closest("tr")
        .find("td")
        .last()
        .text()
        .trim();

      // Adres: icon-map-marker'dan sonraki td
      const address = nameEl
        .find(".icon-map-marker")
        .closest("tr")
        .find("td")
        .last()
        .text()
        .trim();

      // Detay linki
      const detailHref = nameEl.find("a.btn-clean").attr("href") ?? "";
      const detail_url = detailHref ? `https://www.kteb.org${detailHref}` : undefined;

      if (name) {
        pharmacies.push({
          id: id++,
          name,
          phone,
          address,
          district,
          open_hours: hours,
          detail_url,
        });
      }
    });
  });

  return pharmacies;
}
