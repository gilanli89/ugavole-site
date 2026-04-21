import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kıbrıslıca Sözlük",
  description: "Kıbrıs Türkçesi kelimeleri öğren. Şive, deyimler, yemek isimleri ve daha fazlası. Aya, palabre, hellim ve çok daha fazlası.",
  alternates: { canonical: "https://ugavole.com/sozluk" },
  openGraph: {
    title: "Kıbrıslıca Sözlük · ugavole",
    description: "Kıbrıs Türkçesi kelimeleri öğren. Aya, palabre, hellim ve çok daha fazlası.",
    url: "https://ugavole.com/sozluk",
  },
};

export default function SozlukLayout({ children }: { children: React.ReactNode }) {
  return children;
}
