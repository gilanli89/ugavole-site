import SozlukExplorer from "@/components/sozluk/SozlukExplorer";
import { listPublishedDictionaryEntries } from "@/lib/data/dictionary";
import { sozlukData } from "@/lib/sozluk-data";
import { mergeSozlukEntries } from "@/lib/sozluk-search";

export default async function SozlukPage() {
  const communityEntries = await listPublishedDictionaryEntries();
  const entries = mergeSozlukEntries(sozlukData, communityEntries);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Kıbrıslıca Sözlük",
    description: "Kıbrıs Türkçesi kelimeleri, deyimleri ve gündelik ifadeleri.",
    url: "https://ugavole.com/sozluk",
    hasDefinedTerm: entries.map((entry) => ({
      "@type": "DefinedTerm",
      name: entry.kibrisca,
      description: entry.anlam,
      ...(entry.aliases?.length ? { alternateName: entry.aliases } : {}),
      inDefinedTermSet: "https://ugavole.com/sozluk",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SozlukExplorer entries={entries} />
    </>
  );
}
