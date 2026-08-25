import "server-only";

import { buildSocialAccountConfigs } from "./config-core";
import type {
  SocialAccountConfig,
  SocialAccountMetadata,
  SocialPlatform,
} from "./types";

function enabled(name: string): boolean {
  return process.env[name]?.trim().toLowerCase() === "true";
}

function value(name: string): string | null {
  const result = process.env[name]?.trim();
  return result ? result : null;
}


export function getSocialAccountConfigs(): SocialAccountConfig[] {
  return buildSocialAccountConfigs((name) => process.env[name]);
}

export function getSocialAccountConfig(platform: SocialPlatform): SocialAccountConfig {
  const config = getSocialAccountConfigs().find((item) => item.platform === platform);
  if (!config) throw new Error("unsupported_social_platform");
  return config;
}

export function publicAccountMetadata(config: SocialAccountConfig): SocialAccountMetadata {
  return {
    platform: config.platform,
    enabled: config.enabled,
    targetAccountId: config.targetAccountId,
    displayHandle: config.displayHandle,
    apiVersion: config.apiVersion,
    fingerprint: config.fingerprint,
    postingCap: config.postingCap,
    costNotice: config.costNotice,
    credentialExpiresAt: config.credentialExpiresAt,
  };
}

export function isSocialWorkerEnabled(): boolean {
  return enabled("UGAVOLE_SOCIAL_WORKER_ENABLED");
}

export function getCronSecret(): string | null {
  const secret = value("SOCIAL_CRON_SECRET");
  return secret && Buffer.byteLength(secret, "utf8") >= 32 ? secret : null;
}

export function getAllowedMediaHosts(): Set<string> {
  const hosts = new Set<string>(["ugavole.com"]);
  const siteUrl = value("UGAVOLE_SITE_URL");
  if (siteUrl) {
    try {
      hosts.add(new URL(siteUrl).hostname.toLowerCase());
    } catch {
      // Invalid optional site URL is ignored; the fixed production host remains allowed.
    }
  }

  for (const host of value("SOCIAL_MEDIA_ALLOWED_HOSTS")?.split(",") ?? []) {
    const normalized = host.trim().toLowerCase().replace(/\.$/, "");
    if (/^[a-z0-9.-]+$/.test(normalized)) hosts.add(normalized);
  }
  return hosts;
}

export function getImmutableInstagramMediaHosts(): Set<string> {
  const hosts = new Set<string>();
  for (const host of value("INSTAGRAM_IMMUTABLE_MEDIA_HOSTS")?.split(",") ?? []) {
    const normalized = host.trim().toLowerCase().replace(/\.$/, "");
    if (/^[a-z0-9.-]+$/.test(normalized)) hosts.add(normalized);
  }
  return hosts;
}
