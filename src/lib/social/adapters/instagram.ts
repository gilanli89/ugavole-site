import "server-only";

import { getImmutableInstagramMediaHosts } from "../config";
import { composeCaption } from "../format";
import { providerId, requestProviderJson } from "../http";
import { loadApprovedImage } from "../media";
import type {
  DeliveryContext,
  DeliveryResult,
  SocialAccountConfig,
  SocialOutboxJob,
} from "../types";
import {
  configurationFailure,
  objectString,
  preMutationFailure,
  publicMutationFailure,
} from "./shared";

export async function deliverInstagram(
  job: SocialOutboxJob,
  config: SocialAccountConfig,
  context: DeliveryContext
): Promise<DeliveryResult> {
  const configurationError = configurationFailure(config);
  if (configurationError) return configurationError;
  if (!job.payload.media?.url) {
    return {
      kind: "failed",
      code: "instagram_media_required",
      message: "Instagram publishing requires an approved cover image.",
    };
  }
  let mediaHostname: string;
  try {
    mediaHostname = new URL(job.payload.media.url).hostname.toLowerCase().replace(/\.$/, "");
  } catch {
    mediaHostname = "";
  }
  const immutableMediaHosts = getImmutableInstagramMediaHosts();
  if (!mediaHostname || !immutableMediaHosts.has(mediaHostname)) {
    return {
      kind: "failed",
      code: "instagram_immutable_media_host_required",
      message: "Instagram delivery requires an explicitly trusted immutable media host.",
    };
  }

  const target = config.targetAccountId as string;
  const token = config.accessToken as string;
  const graphVersion = config.apiVersion as string;
  const base = `https://graph.facebook.com/${graphVersion}`;
  const identity = await requestProviderJson(
    `${base}/${encodeURIComponent(target)}?fields=id,username`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!identity.ok) return preMutationFailure(identity, config, "instagram_identity_failed");
  if (objectString(identity.body, "id") !== target) {
    return {
      kind: "failed",
      code: "instagram_target_mismatch",
      message: "The access token is not bound to the approved Instagram professional account.",
      httpStatus: identity.status,
    };
  }

  let loadedImage;
  try {
    loadedImage = await loadApprovedImage(job.payload.media.url);
  } catch (error) {
    return {
      kind: "failed",
      code: error instanceof Error ? error.message : "instagram_media_preflight_failed",
      message: "The approved Instagram image failed the safe media preflight.",
    };
  }
  if (loadedImage.mimeType !== "image/jpeg") {
    return {
      kind: "failed",
      code: "instagram_jpeg_required",
      message: "The initial Instagram adapter accepts JPEG images only.",
    };
  }
  const finalMediaHostname = new URL(loadedImage.finalUrl).hostname
    .toLowerCase()
    .replace(/\.$/, "");
  if (!immutableMediaHosts.has(finalMediaHostname)) {
    return {
      kind: "failed",
      code: "instagram_redirected_to_mutable_media_host",
      message: "The approved Instagram image redirected outside the immutable media hosts.",
    };
  }
  if (loadedImage.sha256 !== job.payload.media.sha256) {
    return {
      kind: "failed",
      code: "instagram_approved_media_hash_mismatch",
      message: "The Instagram image bytes no longer match the editor-approved snapshot.",
    };
  }

  const approvedMediaHash = objectString(job.provider_state, "media_sha256");
  if (approvedMediaHash && approvedMediaHash !== loadedImage.sha256) {
    return {
      kind: "failed",
      code: "instagram_media_content_changed",
      message: "The image bytes changed after the delivery snapshot was prepared.",
    };
  }

  let containerId = objectString(job.provider_state, "container_id");
  if (!containerId) {
    await context.persistState(
      { media_sha256: loadedImage.sha256, media_mime: loadedImage.mimeType },
      "preparation"
    );
    const createResponse = await requestProviderJson(
      `${base}/${encodeURIComponent(target)}/media`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          image_url: loadedImage.finalUrl,
          caption: composeCaption(job.payload.caption, job.payload.canonical_url, 2_200),
        }),
      },
      25_000
    );
    if (!createResponse.ok) {
      return preMutationFailure(createResponse, config, "instagram_container_create_failed");
    }
    containerId = providerId(createResponse.body);
    if (!containerId) {
      return {
        kind: "retry",
        code: "instagram_container_id_missing",
        message: "Instagram did not return a media container identifier.",
        httpStatus: createResponse.status,
      };
    }
    await context.persistState(
      { container_id: containerId, media_sha256: loadedImage.sha256 },
      "provider_processing"
    );
  }

  const statusResponse = await requestProviderJson(
    `${base}/${encodeURIComponent(containerId)}?fields=status_code,status`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!statusResponse.ok) {
    return preMutationFailure(statusResponse, config, "instagram_container_status_failed");
  }
  const status = objectString(statusResponse.body, "status_code")?.toUpperCase();
  if (status === "ERROR" || status === "EXPIRED") {
    return {
      kind: "failed",
      code: `instagram_container_${status.toLowerCase()}`,
      message: "Instagram rejected or expired the prepared media container.",
      httpStatus: statusResponse.status,
      providerState: { container_id: containerId, container_status: status },
    };
  }
  if (status !== "FINISHED") {
    return {
      kind: "retry",
      code: "instagram_container_processing",
      message: "Instagram is still processing the media container.",
      retryAfterSeconds: 30,
      httpStatus: statusResponse.status,
      providerState: { container_id: containerId, container_status: status ?? "UNKNOWN" },
    };
  }

  await context.beforePublicMutation({ container_id: containerId });
  const publishResponse = await requestProviderJson(
    `${base}/${encodeURIComponent(target)}/media_publish`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ creation_id: containerId }),
    },
    25_000
  );
  if (!publishResponse.ok) {
    return publicMutationFailure(publishResponse, config, "instagram_publish_failed");
  }
  const id = providerId(publishResponse.body);
  if (!id) {
    return {
      kind: "ambiguous",
      code: "instagram_remote_id_missing",
      message: "Instagram accepted publish without returning a media identifier.",
      httpStatus: publishResponse.status,
      providerState: { container_id: containerId },
    };
  }
  return {
    kind: "success",
    remoteId: id,
    httpStatus: publishResponse.status,
    providerState: { container_id: containerId },
  };
}
