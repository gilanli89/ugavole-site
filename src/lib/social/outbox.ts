import "server-only";

import { createHash } from "node:crypto";
import {
  getSocialAccountConfigs,
  publicAccountMetadata,
} from "./config";
import { loadApprovedImage } from "./media";
import { createSocialAdminClient } from "./supabase-admin";
import type {
  DeliveryResult,
  ProviderState,
  SocialDeliveryPhase,
  SocialOutboxJob,
  SocialPlatform,
} from "./types";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value) throw new Error(`invalid_social_job_${field}`);
  return value;
}

function requiredNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`invalid_social_job_${field}`);
  }
  return value;
}

function requiredSha256(value: unknown, field: string): string {
  const hash = requiredString(value, field);
  if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error(`invalid_social_job_${field}`);
  return hash;
}

function parsePayload(value: unknown): SocialOutboxJob["payload"] {
  if (!isObject(value)) throw new Error("invalid_social_job_payload");
  const mediaValue = value.media;
  const media = isObject(mediaValue)
      ? {
        url: requiredString(mediaValue.url, "media_url"),
        url_hash: requiredSha256(mediaValue.url_hash, "media_url_hash"),
        sha256: requiredSha256(mediaValue.sha256, "media_sha256"),
      }
    : undefined;

  return {
    schema_version: 1,
    content_id: requiredString(value.content_id, "payload_content_id"),
    content_version: requiredNumber(value.content_version, "payload_content_version"),
    slug: requiredString(value.slug, "payload_slug"),
    title: requiredString(value.title, "payload_title"),
    excerpt: typeof value.excerpt === "string" ? value.excerpt : "",
    caption: requiredString(value.caption, "payload_caption"),
    canonical_url: requiredString(value.canonical_url, "payload_canonical_url"),
    ...(media ? { media } : {}),
  };
}

async function snapshotApprovedMedia(input: {
  contentId: string;
  contentVersion: number;
}): Promise<string | null> {
  const supabase = createSocialAdminClient();
  const { data, error } = await supabase
    .from("content_items")
    .select("cover_image_url,content_version")
    .eq("id", input.contentId)
    .maybeSingle();
  if (error || !data) throw new Error("social_media_snapshot_content_unavailable");
  if (data.content_version !== input.contentVersion) {
    throw new Error("social_media_snapshot_version_conflict");
  }
  const mediaUrl = data.cover_image_url?.trim();
  if (!mediaUrl) return null;
  return (await loadApprovedImage(mediaUrl)).sha256;
}

export function parseSocialOutboxJob(value: unknown): SocialOutboxJob {
  if (!isObject(value)) throw new Error("invalid_social_job");
  const platform = requiredString(value.platform, "platform");
  if (platform !== "facebook" && platform !== "instagram" && platform !== "x") {
    throw new Error("invalid_social_job_platform");
  }
  if (value.status !== "processing") throw new Error("invalid_social_job_status");
  const providerState = isObject(value.provider_state) ? value.provider_state : {};

  return {
    id: requiredString(value.id, "id"),
    event_key: requiredString(value.event_key, "event_key"),
    content_id: requiredString(value.content_id, "content_id"),
    content_version: requiredNumber(value.content_version, "content_version"),
    account_id: requiredString(value.account_id, "account_id"),
    platform,
    target_account_id: requiredString(value.target_account_id, "target_account_id"),
    target_fingerprint: requiredString(value.target_fingerprint, "target_fingerprint"),
    payload: parsePayload(value.payload),
    payload_hash: requiredString(value.payload_hash, "payload_hash"),
    status: "processing",
    delivery_phase: "preflight",
    worker_run_count: requiredNumber(value.worker_run_count, "worker_run_count"),
    max_worker_runs: requiredNumber(value.max_worker_runs, "max_worker_runs"),
    attempt_count: requiredNumber(value.attempt_count, "attempt_count"),
    max_attempts: requiredNumber(value.max_attempts, "max_attempts"),
    lease_token: requiredString(value.lease_token, "lease_token"),
    leased_until: requiredString(value.leased_until, "leased_until"),
    provider_state: providerState,
  };
}

export async function syncSocialAccountMetadata(): Promise<void> {
  const supabase = createSocialAdminClient();
  const rows = getSocialAccountConfigs().map((config) => {
    const metadata = publicAccountMetadata(config);
    return {
      platform: metadata.platform,
      enabled: metadata.enabled,
      target_account_id: metadata.targetAccountId,
      display_handle: metadata.displayHandle,
      api_version: metadata.apiVersion,
      config_fingerprint: metadata.fingerprint,
      posting_cap: metadata.postingCap,
      cost_notice: metadata.costNotice,
      credential_expires_at: metadata.credentialExpiresAt,
      last_configured_at: new Date().toISOString(),
    };
  });
  const { error } = await supabase.from("social_accounts").upsert(rows, { onConflict: "platform" });
  if (error) throw new Error("social_account_metadata_sync_failed");
}

export async function enqueueApprovedContent(input: {
  contentId: string;
  contentVersion: number;
  actorId: string;
  platforms?: SocialPlatform[];
  captions?: Partial<Record<SocialPlatform, string>>;
}) {
  const mediaSha256 = await snapshotApprovedMedia({
    contentId: input.contentId,
    contentVersion: input.contentVersion,
  });
  await syncSocialAccountMetadata();
  const supabase = createSocialAdminClient();
  const { data, error } = await supabase.rpc("enqueue_social_outbox", {
    p_content_id: input.contentId,
    p_expected_content_version: input.contentVersion,
    p_actor_id: input.actorId,
    p_platforms: input.platforms ?? null,
    p_captions: input.captions ?? {},
    p_media_sha256: mediaSha256,
  });
  if (error) throw new Error(`social_enqueue_failed:${error.code ?? "unknown"}`);
  return data as unknown;
}

export async function publishApprovedContent(input: {
  contentId: string;
  contentVersion: number;
  actorId: string;
  adEligible: boolean;
  socialReady: boolean;
  platforms?: SocialPlatform[];
  captions?: Partial<Record<SocialPlatform, string>>;
}) {
  const mediaSha256 = input.socialReady
    ? await snapshotApprovedMedia({
        contentId: input.contentId,
        contentVersion: input.contentVersion,
      })
    : null;
  if (input.socialReady) await syncSocialAccountMetadata();
  const supabase = createSocialAdminClient();
  const { data, error } = await supabase.rpc("publish_content_with_social", {
    p_content_id: input.contentId,
    p_expected_content_version: input.contentVersion,
    p_ad_eligible: input.adEligible,
    p_social_ready: input.socialReady,
    p_actor_id: input.actorId,
    p_platforms: input.platforms ?? null,
    p_captions: input.captions ?? {},
    p_media_sha256: mediaSha256,
  });
  if (error) throw new Error(`content_publish_failed:${error.code ?? "unknown"}`);
  return data as unknown;
}

export async function claimSocialJobs(input: {
  workerId: string;
  batchSize: number;
  leaseSeconds?: number;
}): Promise<SocialOutboxJob[]> {
  const supabase = createSocialAdminClient();
  const { data, error } = await supabase.rpc("claim_social_outbox", {
    p_worker_id: input.workerId,
    p_batch_size: input.batchSize,
    p_lease_seconds: input.leaseSeconds ?? 600,
  });
  if (error) throw new Error(`social_claim_failed:${error.code ?? "unknown"}`);
  if (!Array.isArray(data)) throw new Error("social_claim_invalid_response");
  return data.map(parseSocialOutboxJob);
}

export async function persistProviderState(
  job: SocialOutboxJob,
  state: ProviderState,
  phase: Extract<SocialDeliveryPhase, "preflight" | "preparation" | "provider_processing">
): Promise<boolean> {
  const supabase = createSocialAdminClient();
  const { data, error } = await supabase.rpc("persist_social_provider_state", {
    p_job_id: job.id,
    p_lease_token: job.lease_token,
    p_phase: phase,
    p_provider_state: state,
  });
  if (error) throw new Error(`social_state_persist_failed:${error.code ?? "unknown"}`);
  return data === true;
}

export async function markPublicMutationStarted(
  job: SocialOutboxJob,
  state: ProviderState = {}
): Promise<"started" | "invalidated" | "cap_reached" | "lease_lost"> {
  const supabase = createSocialAdminClient();
  const { data, error } = await supabase.rpc("mark_social_publication_started", {
    p_job_id: job.id,
    p_lease_token: job.lease_token,
    p_provider_state: state,
  });
  if (error) throw new Error(`social_mutation_marker_failed:${error.code ?? "unknown"}`);
  if (data === "started" || data === "invalidated" || data === "cap_reached" || data === "lease_lost") {
    return data;
  }
  throw new Error("social_mutation_marker_invalid_response");
}

export async function finishSocialJob(
  job: SocialOutboxJob,
  outcome: DeliveryResult | { kind: "cancelled"; code: string; message: string }
): Promise<boolean> {
  const supabase = createSocialAdminClient();
  const mapped = outcome.kind === "success"
    ? {
        status: "succeeded",
        remoteId: outcome.remoteId,
        remoteUrl: outcome.remoteUrl ?? null,
        code: null,
        message: null,
        httpStatus: outcome.httpStatus ?? null,
        retryAfter: null,
        providerState: outcome.providerState ?? {},
      }
    : outcome.kind === "retry"
      ? {
          status: "retry",
          remoteId: null,
          remoteUrl: null,
          code: outcome.code,
          message: outcome.message,
          httpStatus: outcome.httpStatus ?? null,
          retryAfter: outcome.retryAfterSeconds ?? null,
          providerState: outcome.providerState ?? {},
        }
      : {
          status: outcome.kind,
          remoteId: null,
          remoteUrl: null,
          code: outcome.code,
          message: outcome.message,
          httpStatus: "httpStatus" in outcome ? outcome.httpStatus ?? null : null,
          retryAfter: null,
          providerState: "providerState" in outcome ? outcome.providerState ?? {} : {},
        };

  const { data, error } = await supabase.rpc("finish_social_outbox_job", {
    p_job_id: job.id,
    p_lease_token: job.lease_token,
    p_outcome: mapped.status,
    p_remote_id: mapped.remoteId,
    p_remote_url: mapped.remoteUrl,
    p_error_code: mapped.code,
    p_error_message: mapped.message,
    p_http_status: mapped.httpStatus,
    p_retry_after_seconds: mapped.retryAfter,
    p_provider_state: mapped.providerState,
  });
  if (error) throw new Error(`social_finish_failed:${error.code ?? "unknown"}`);
  return data === true;
}

export type RevalidationResult =
  | { ok: true; monthlyPublishedCount: number }
  | { ok: false; code: string; retryable?: boolean };

export async function revalidateSocialJob(job: SocialOutboxJob): Promise<RevalidationResult> {
  const supabase = createSocialAdminClient();
  const [{ data: content, error: contentError }, { data: account, error: accountError }] =
    await Promise.all([
      supabase
        .from("content_items")
        .select(
          "id,slug,title,excerpt,cover_image_url,status,ad_status,social_status,content_version,published_at,origin,rights_confirmed_at,privacy_consent_version"
        )
        .eq("id", job.content_id)
        .maybeSingle(),
      supabase
        .from("social_accounts")
        .select(
          "id,platform,enabled,target_account_id,config_fingerprint,posting_cap"
        )
        .eq("id", job.account_id)
        .maybeSingle(),
    ]);
  if (contentError) {
    return { ok: false, code: "content_read_failed", retryable: true };
  }
  if (!content) return { ok: false, code: "content_missing" };
  if (accountError) {
    return { ok: false, code: "social_account_read_failed", retryable: true };
  }
  if (!account) return { ok: false, code: "social_account_missing" };

  if (
    content.status !== "published" ||
    content.ad_status !== "eligible" ||
    content.social_status !== "ready" ||
    !content.published_at
  ) {
    return { ok: false, code: "content_no_longer_social_eligible" };
  }
  if (
    content.origin === "ugc" &&
    (!content.rights_confirmed_at || !content.privacy_consent_version?.trim())
  ) {
    return { ok: false, code: "ugc_rights_or_privacy_no_longer_confirmed" };
  }
  if (
    content.content_version !== job.content_version ||
    content.slug !== job.payload.slug ||
    content.title !== job.payload.title ||
    content.excerpt !== job.payload.excerpt ||
    job.payload.content_id !== job.content_id ||
    job.payload.content_version !== job.content_version ||
    job.payload.canonical_url !== `https://ugavole.com/haber/${content.slug}`
  ) {
    return { ok: false, code: "content_snapshot_changed" };
  }

  const currentMedia = content.cover_image_url || null;
  const snapshotMedia = job.payload.media?.url ?? null;
  if (currentMedia !== snapshotMedia) return { ok: false, code: "media_snapshot_changed" };
  if (
    currentMedia &&
    createHash("sha256").update(currentMedia).digest("hex") !== job.payload.media?.url_hash
  ) {
    return { ok: false, code: "media_snapshot_hash_invalid" };
  }
  if (currentMedia && !/^[a-f0-9]{64}$/.test(job.payload.media?.sha256 ?? "")) {
    return { ok: false, code: "media_content_hash_invalid" };
  }

  const config = getSocialAccountConfigs().find((item) => item.platform === job.platform);
  const credentialTemporarilyUnavailable = [
    "access_token_missing",
    "access_token_expiry_missing",
    "access_token_expired_or_imminent",
  ].includes(config?.configurationIssue ?? "");
  if (
    credentialTemporarilyUnavailable &&
    account.platform === job.platform &&
    account.target_account_id === job.target_account_id &&
    account.config_fingerprint === job.target_fingerprint &&
    config?.targetAccountId === job.target_account_id &&
    config.fingerprint === job.target_fingerprint
  ) {
    return {
      ok: false,
      code: config.configurationIssue as string,
      retryable: true,
    };
  }
  if (
    !account.enabled ||
    account.platform !== job.platform ||
    account.target_account_id !== job.target_account_id ||
    account.config_fingerprint !== job.target_fingerprint ||
    !config?.enabled ||
    config.targetAccountId !== job.target_account_id ||
    config.fingerprint !== job.target_fingerprint
  ) {
    return { ok: false, code: "social_target_configuration_changed" };
  }

  let monthlyPublishedCount = 0;
  if (job.platform === "x") {
    if (!account.posting_cap || !config.postingCap || account.posting_cap !== config.postingCap) {
      return { ok: false, code: "x_posting_cap_unavailable" };
    }
    const start = new Date();
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);
    const { count, error } = await supabase
      .from("social_outbox")
      .select("id", { count: "exact", head: true })
      .eq("platform", "x")
      .eq("status", "succeeded")
      .gte("completed_at", start.toISOString());
    if (error || count === null) {
      return { ok: false, code: "x_posting_cap_check_failed", retryable: true };
    }
    monthlyPublishedCount = count;
    if (count >= account.posting_cap) return { ok: false, code: "x_monthly_posting_cap_reached" };
  }

  return { ok: true, monthlyPublishedCount };
}

export async function consumeCronNonce(nonceHash: string, expiresAt: string): Promise<boolean> {
  const supabase = createSocialAdminClient();
  const { data, error } = await supabase.rpc("consume_social_cron_nonce", {
    p_signature_hash: nonceHash,
    p_expires_at: expiresAt,
  });
  if (error) throw new Error(`social_cron_nonce_failed:${error.code ?? "unknown"}`);
  return data === true;
}
