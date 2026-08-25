import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "../src/lib/seo";

test("JSON-LD cannot terminate its script element", () => {
  const serialized = serializeJsonLd({
    title: "</script><script>globalThis.pwned=true</script>",
    separators: "\u2028\u2029",
  });

  assert.equal(serialized.includes("</script>"), false);
  assert.equal(serialized.includes("<script>"), false);
  assert.match(serialized, /\\u003c\/script>/);
  assert.match(serialized, /\\u2028\\u2029/);
});
