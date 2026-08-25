import assert from "node:assert/strict";
import test from "node:test";
import { isSameOrigin, readJsonBody } from "../src/lib/http/security";
import { safeAdminDestination } from "../src/lib/auth/safe-redirect";

test("same-origin mutations require an Origin header", () => {
  const request = new Request("https://ugavole.com/api/submissions", { method: "POST" });
  assert.equal(isSameOrigin(request), false);
});

test("same-origin mutations reject cross-site requests", () => {
  const request = new Request("https://ugavole.com/api/submissions", {
    method: "POST",
    headers: {
      Origin: "https://evil.example",
      "Sec-Fetch-Site": "cross-site",
    },
  });
  assert.equal(isSameOrigin(request), false);
});

test("same-origin mutations accept the configured public origin", () => {
  const previous = process.env.APP_ORIGIN;
  process.env.APP_ORIGIN = "https://ugavole.com";
  try {
    const request = new Request("http://internal-host/api/submissions", {
      method: "POST",
      headers: {
        Origin: "https://ugavole.com",
        "Sec-Fetch-Site": "same-origin",
      },
    });
    assert.equal(isSameOrigin(request), true);
  } finally {
    if (previous === undefined) delete process.env.APP_ORIGIN;
    else process.env.APP_ORIGIN = previous;
  }
});

test("bounded JSON reader rejects a streamed oversized body", async () => {
  const request = new Request("https://ugavole.com/api/submissions", {
    method: "POST",
    body: JSON.stringify({ content: "x".repeat(200) }),
    headers: { "Content-Type": "application/json" },
  });
  await assert.rejects(() => readJsonBody(request, 50), /body_too_large/);
});

test("admin redirect allowlist rejects slash-backslash external URLs", () => {
  assert.equal(
    safeAdminDestination("/\\evil.example", "https://ugavole.com"),
    "/admin"
  );
  assert.equal(
    safeAdminDestination("https://evil.example/admin", "https://ugavole.com"),
    "/admin"
  );
  assert.equal(
    safeAdminDestination("/admin/review?id=1", "https://ugavole.com"),
    "/admin/review?id=1"
  );
});
