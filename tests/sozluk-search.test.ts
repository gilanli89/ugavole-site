import assert from "node:assert/strict";
import test from "node:test";
import type { SozlukEntry } from "../src/lib/sozluk-data";
import {
  compareSozlukEntries,
  matchesSozlukQuery,
  mergeSozlukEntries,
  normalizeSozlukText,
  sozlukInitial,
} from "../src/lib/sozluk-search";

const entry: SozlukEntry = {
  id: 1,
  kibrisca: "Babuç",
  aliases: ["Babiç"],
  anlam: "Pabuç, ayakkabı",
  cumle: "Babuçlarını kapının önüne bırak",
  kategori: "günlük",
  emoji: "👟",
  zorluk: "kolay",
};

test("dictionary normalization tolerates Turkish letters and missing accents", () => {
  assert.equal(normalizeSozlukText("KIBRISÇA ŞİVE"), "kibrisca sive");
  assert.equal(normalizeSozlukText("Kıbrısça şive"), "kibrisca sive");
});

test("dictionary search covers aliases, meanings, examples, and categories", () => {
  assert.equal(matchesSozlukQuery(entry, "babic"), true);
  assert.equal(matchesSozlukQuery(entry, "ayakkabi"), true);
  assert.equal(matchesSozlukQuery(entry, "kapinin onune"), true);
  assert.equal(matchesSozlukQuery(entry, "gunluk"), true);
  assert.equal(matchesSozlukQuery(entry, "bisiklet"), false);
});

test("dictionary uses Turkish initials and alphabetical order", () => {
  assert.equal(sozlukInitial({ kibrisca: "İskele" }), "İ");
  assert.equal(sozlukInitial({ kibrisca: "ışık" }), "I");

  const entries = [
    { ...entry, id: 2, kibrisca: "Şafk" },
    { ...entry, id: 3, kibrisca: "Seki" },
  ].sort(compareSozlukEntries);
  assert.deepEqual(entries.map((item) => item.kibrisca), ["Seki", "Şafk"]);
});

test("bundled entries win normalized-key conflicts", () => {
  const merged = mergeSozlukEntries(
    [entry],
    [{ ...entry, id: "community-1", kibrisca: "Babuc", source: "community" }]
  );
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, 1);
});
