import assert from "node:assert/strict";
import test from "node:test";
import { createContentSlug, parseUgcInput, toContentBlocks } from "../src/lib/content/ugc";

const valid = {
  type: "story",
  title: "Girne'de herkesin bildiği küçük bir ada hikâyesi",
  excerpt: "Yerel ve özgün bir katkı.",
  content: "Bu ilk paragraf yeterince ayrıntılı bir yerel deneyimi anlatıyor.\n\nBu ikinci paragraf da gönderinin güvenli biçimde bloklara ayrıldığını doğruluyor.",
  category: "Ada Hayatı",
  location: "Girne",
  author_name: "Ada Katkıcısı",
  author_email: "katki@example.com",
  source_url: "https://example.com/kaynak",
  rights_confirmed: true,
  privacy_confirmed: true,
  website: "",
};

test("valid UGC is normalized", () => {
  const result = parseUgcInput(valid);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.authorEmail, "katki@example.com");
  assert.equal(result.value.sourceUrl, "https://example.com/kaynak");
});

test("honeypot and missing rights fail closed", () => {
  assert.equal(parseUgcInput({ ...valid, website: "spam" }).ok, false);
  assert.equal(parseUgcInput({ ...valid, rights_confirmed: false }).ok, false);
  assert.equal(parseUgcInput({ ...valid, privacy_confirmed: false }).ok, false);
});

test("unsafe URL schemes are rejected", () => {
  const result = parseUgcInput({ ...valid, source_url: "javascript:alert(1)" });
  assert.equal(result.ok, false);
});

test("content becomes plain text blocks and never HTML markup", () => {
  const blocks = toContentBlocks("<script>alert(1)</script> güvenli metin.\n\nİkinci paragraf.");
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].type, "paragraph");
  assert.equal(blocks[0].text, "<script>alert(1)</script> güvenli metin.");
});

test("Turkish titles produce stable URL-safe slugs", () => {
  assert.equal(
    createContentSlug("Kıbrıs'ta Şaşırtıcı Üç Şey", "ABCDEF12-9999"),
    "kibrista-sasirtici-uc-sey-abcdef12"
  );
});
