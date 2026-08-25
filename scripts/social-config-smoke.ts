import assert from "node:assert/strict";
import { buildSocialAccountConfigs } from "../src/lib/social/config-core";
import type { SocialPlatform } from "../src/lib/social/types";

const nowMs = Date.parse("2026-08-25T12:00:00.000Z");
const values = new Map<string, string>();
const read = (name: string) => values.get(name) ?? null;

function config(platform: SocialPlatform) {
  const result = buildSocialAccountConfigs(read, nowMs).find(
    (candidate) => candidate.platform === platform
  );
  if (!result) throw new Error("social_config_smoke_platform_missing");
  return result;
}

values.set("UGAVOLE_FACEBOOK_ENABLED", "true");
values.set("META_PAGE_ID", "facebook-page-smoke");
values.set("META_GRAPH_API_VERSION", "v99.0");
const facebookMissingToken = config("facebook");
assert.equal(facebookMissingToken.enabled, false);
assert.equal(facebookMissingToken.configurationIssue, "access_token_missing");

values.set("META_PAGE_ACCESS_TOKEN", "smoke-page-token-never-log");
values.set("META_ACCESS_TOKEN_EXPIRES_AT", "2026-08-25T11:59:00.000Z");
const facebookExpired = config("facebook");
assert.equal(facebookExpired.enabled, false);
assert.equal(facebookExpired.configurationIssue, "access_token_expired_or_imminent");
values.set("META_ACCESS_TOKEN_EXPIRES_AT", "2026-08-26T12:00:00.000Z");
assert.equal(config("facebook").enabled, true);

values.set("UGAVOLE_X_ENABLED", "true");
values.set("X_API_USER_ID", "x-user-smoke");
values.set("X_DISPLAY_HANDLE", "verified-handle-smoke");
values.set("X_API_MONTHLY_POST_CAP", "10");
values.set("X_API_COST_NOTICE", "Smoke-only verified cap");

const xMissingToken = config("x");
assert.equal(xMissingToken.enabled, false);
assert.equal(xMissingToken.configurationIssue, "access_token_missing");

values.set("X_USER_ACCESS_TOKEN", "smoke-user-token-never-log");
const xMissingExpiry = config("x");
assert.equal(xMissingExpiry.enabled, false);
assert.equal(xMissingExpiry.configurationIssue, "access_token_expiry_missing");

values.set("X_USER_ACCESS_TOKEN_EXPIRES_AT", "2026-08-25T11:59:00.000Z");
const xExpired = config("x");
assert.equal(xExpired.enabled, true);
assert.equal(xExpired.configurationIssue, "access_token_expired_or_imminent");
assert.equal(xExpired.displayHandle, "verified-handle-smoke");

values.set("X_USER_ACCESS_TOKEN_EXPIRES_AT", "2026-08-26T12:00:00.000Z");
const xReady = config("x");
assert.equal(xReady.enabled, true);
assert.equal(xReady.configurationIssue, null);

console.log("social-config smoke: ok (no network calls)");
