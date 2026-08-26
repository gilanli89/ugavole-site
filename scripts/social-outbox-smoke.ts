import assert from "node:assert/strict";
import {
  buildPlatformCaptions,
  composeCaption,
  composeXText,
} from "../src/lib/social/format";
import {
  createCronSignature,
  verifyCronSignature,
} from "../src/lib/social/hmac";

const secret = "0123456789abcdef0123456789abcdef";
const timestamp = 1_800_000_000;
const rawBody = '{"batchSize":1}';
const signature = createCronSignature(secret, timestamp, rawBody);

assert.equal(signature.length, 64);
assert.deepEqual(
  verifyCronSignature({
    secret,
    rawBody,
    timestampHeader: String(timestamp),
    signatureHeader: `v1=${signature}`,
    nowSeconds: timestamp + 30,
  }).ok,
  true
);
assert.deepEqual(
  verifyCronSignature({
    secret,
    rawBody: `${rawBody} `,
    timestampHeader: String(timestamp),
    signatureHeader: `v1=${signature}`,
    nowSeconds: timestamp + 30,
  }),
  { ok: false, reason: "signature_invalid" }
);
assert.deepEqual(
  verifyCronSignature({
    secret,
    rawBody,
    timestampHeader: String(timestamp),
    signatureHeader: `v1=${signature}`,
    nowSeconds: timestamp + 301,
  }),
  { ok: false, reason: "timestamp_stale" }
);

const xText = composeXText("a".repeat(400), "https://ugavole.com/haber/ornek");
assert.ok(Array.from(xText).length <= 250);
assert.ok(xText.endsWith("https://ugavole.com/haber/ornek"));

const emojiXText = composeXText("😀".repeat(300), "https://ugavole.com/haber/ornek");
const emojiCaption = emojiXText.split("\n\n", 1)[0];
assert.ok(Array.from(emojiCaption).length <= 125);

const instagramCaption = composeCaption(
  "Kıbrıs gündemi",
  "https://ugavole.com/haber/ornek",
  2_200
);
assert.equal(instagramCaption, "Kıbrıs gündemi\n\nhttps://ugavole.com/haber/ornek");

const generated = buildPlatformCaptions({
  title: "Girne'de Kalabalıktan Uzak Bir Gün Nasıl Geçirilir?",
  excerpt: "Denizi, dağ eteklerini ve sakin mahalleleri bir güne sığdıran dengeli rota.",
  category: "Gezi",
});
assert.match(generated.facebook, /Ugavole'de/);
assert.match(generated.instagram, /#Ugavole/);
assert.match(generated.instagram, /#KıbrısGezi/);
assert.match(generated.x, /#KuzeyKıbrıs/);
assert.ok(Array.from(generated.x).length <= 125);

console.log("social-outbox smoke: ok (no network calls)");
