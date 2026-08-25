import { createHash } from "node:crypto";
import type { SocialAccountConfig, SocialPlatform } from "./types";

export type SocialConfigValueReader = (name: string) => string | null | undefined;

const META_VERSION = /^v\d+\.\d+$/;

function value(read: SocialConfigValueReader, name: string): string | null {
  const result = read(name)?.trim();
  return result ? result : null;
}

function enabled(read: SocialConfigValueReader, name: string): boolean {
  return value(read, name)?.toLowerCase() === "true";
}

function positiveInteger(read: SocialConfigValueReader, name: string): number | null {
  const raw = value(read, name);
  if (!raw || !/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function isoDate(read: SocialConfigValueReader, name: string): string | null {
  const raw = value(read, name);
  if (!raw) return null;
  const timestamp = Date.parse(raw);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function fingerprint(platform: SocialPlatform, target: string, apiVersion: string): string {
  return createHash("sha256")
    .update(`${platform}\u0000${target}\u0000${apiVersion}`)
    .digest("hex")
    .slice(0, 32);
}

function metaConfig(
  read: SocialConfigValueReader,
  platform: "facebook" | "instagram",
  nowMs: number
): SocialAccountConfig {
  const requested = enabled(
    read,
    platform === "facebook" ? "UGAVOLE_FACEBOOK_ENABLED" : "UGAVOLE_INSTAGRAM_ENABLED"
  );
  const targetAccountId = value(
    read,
    platform === "facebook" ? "META_PAGE_ID" : "META_INSTAGRAM_ACCOUNT_ID"
  );
  const apiVersion = value(read, "META_GRAPH_API_VERSION");
  const accessToken =
    platform === "instagram"
      ? value(read, "META_INSTAGRAM_ACCESS_TOKEN") ?? value(read, "META_PAGE_ACCESS_TOKEN")
      : value(read, "META_PAGE_ACCESS_TOKEN");
  const displayHandle = value(
    read,
    platform === "facebook" ? "META_PAGE_HANDLE" : "META_INSTAGRAM_HANDLE"
  );
  const credentialExpiresAt = isoDate(read, "META_ACCESS_TOKEN_EXPIRES_AT");

  let configurationIssue: string | null = null;
  if (requested && !targetAccountId) configurationIssue = "target_account_missing";
  else if (requested && (!apiVersion || !META_VERSION.test(apiVersion))) {
    configurationIssue = "graph_api_version_missing_or_invalid";
  }

  if (!configurationIssue && requested && !accessToken) {
    configurationIssue = "access_token_missing";
  } else if (
    !configurationIssue &&
    requested &&
    credentialExpiresAt &&
    Date.parse(credentialExpiresAt) <= nowMs + 15 * 60 * 1000
  ) {
    configurationIssue = "access_token_expired_or_imminent";
  }

  const ready = requested && !configurationIssue && targetAccountId && apiVersion && accessToken;
  return {
    platform,
    enabled: Boolean(ready),
    targetAccountId,
    displayHandle,
    apiVersion,
    fingerprint:
      targetAccountId && apiVersion && META_VERSION.test(apiVersion)
        ? fingerprint(platform, targetAccountId, apiVersion)
        : null,
    postingCap: null,
    costNotice: null,
    credentialExpiresAt,
    accessToken,
    configurationIssue,
  };
}

function xConfig(
  read: SocialConfigValueReader,
  nowMs: number
): SocialAccountConfig {
  const requested = enabled(read, "UGAVOLE_X_ENABLED");
  const targetAccountId = value(read, "X_API_USER_ID");
  const accessToken = value(read, "X_USER_ACCESS_TOKEN");
  const postingCap = positiveInteger(read, "X_API_MONTHLY_POST_CAP");
  const costNotice = value(read, "X_API_COST_NOTICE");
  const credentialExpiresAt = isoDate(read, "X_USER_ACCESS_TOKEN_EXPIRES_AT");
  const credentialExpiryTimestamp = credentialExpiresAt
    ? Date.parse(credentialExpiresAt)
    : null;
  const apiVersion = "2";

  let configurationIssue: string | null = null;
  if (requested && !targetAccountId) configurationIssue = "target_account_missing";
  else if (requested && !postingCap) configurationIssue = "monthly_post_cap_missing";
  else if (requested && !costNotice) configurationIssue = "cost_notice_missing";
  if (!configurationIssue && requested && !accessToken) {
    configurationIssue = "access_token_missing";
  } else if (!configurationIssue && requested && !credentialExpiresAt) {
    configurationIssue = "access_token_expiry_missing";
  } else if (
    !configurationIssue &&
    requested &&
    credentialExpiryTimestamp !== null &&
    credentialExpiryTimestamp <= nowMs + 15 * 60 * 1000
  ) {
    configurationIssue = "access_token_expired_or_imminent";
  }

  // A present but expired token keeps its configured target queueable. The
  // worker defers before mutation; missing token/expiry is never configured.
  const configured =
    requested &&
    targetAccountId &&
    postingCap &&
    costNotice &&
    accessToken &&
    credentialExpiresAt;

  return {
    platform: "x",
    enabled: Boolean(configured),
    targetAccountId,
    displayHandle: value(read, "X_DISPLAY_HANDLE"),
    apiVersion,
    fingerprint: targetAccountId ? fingerprint("x", targetAccountId, apiVersion) : null,
    postingCap,
    costNotice:
      costNotice ??
      "Kapalı: güncel ücret ve aylık paylaşım kotası doğrulanmadan etkinleştirilmez.",
    credentialExpiresAt,
    accessToken,
    configurationIssue,
  };
}

export function buildSocialAccountConfigs(
  read: SocialConfigValueReader,
  nowMs = Date.now()
): SocialAccountConfig[] {
  return [
    metaConfig(read, "facebook", nowMs),
    metaConfig(read, "instagram", nowMs),
    xConfig(read, nowMs),
  ];
}
