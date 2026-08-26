import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kıbrıslıca Sözlük: Kıbrıs Türkçesi Kelimeleri ve Anlamları | ugavole",
  description: "Kıbrıslıca kelimeler, Kıbrıs Türkçesi anlamları, şive, deyimler ve yemek adları. Aya, palabre, hellim ve daha fazlasını örnekleriyle keşfet.",
  alternates: { canonical: "https://ugavole.com/sozluk" },
  openGraph: {
    title: "Kıbrıslıca Sözlük: Kıbrıs Türkçesi Kelimeleri ve Anlamları",
    description: "Kıbrıs Türkçesi kelimelerini örnekleriyle öğren; şive, deyim ve kültür sözlüğünü keşfet.",
    url: "https://ugavole.com/sozluk",
  },
};

export default function SozlukLayout({ children }: { children: React.ReactNode }) {
  return children;
}
