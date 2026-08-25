import "server-only";

import { Buffer } from "node:buffer";
import { composeXText } from "../format";
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

const X_API = "https://api.x.com/2";

export async function deliverX(
  job: SocialOutboxJob,
  config: SocialAccountConfig,
  context: DeliveryContext
): Promise<DeliveryResult> {
  const configurationError = configurationFailure(config);
  if (configurationError) return configurationError;

  const target = config.targetAccountId as string;
  const token = config.accessToken as string;
  const identity = await requestProviderJson(`${X_API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!identity.ok) return preMutationFailure(identity, config, "x_identity_failed");
  const identityData =
    identity.body && typeof identity.body === "object"
      ? (identity.body as Record<string, unknown>).data
      : null;
  if (objectString(identityData, "id") !== target) {
    return {
      kind: "failed",
      code: "x_target_mismatch",
      message: "The user access token is not bound to the approved X account.",
      httpStatus: identity.status,
    };
  }

  let mediaId: string | null = null;
  let mediaHash: string | null = null;
  if (job.payload.media?.url) {
    let image;
    try {
      image = await loadApprovedImage(job.payload.media.url);
    } catch (error) {
      return {
        kind: "failed",
        code: error instanceof Error ? error.message : "x_media_preflight_failed",
        message: "The approved X image failed the safe media preflight.",
      };
    }
    mediaHash = image.sha256;
    if (mediaHash !== job.payload.media.sha256) {
      return {
        kind: "failed",
        code: "x_approved_media_hash_mismatch",
        message: "The X image bytes no longer match the editor-approved snapshot.",
      };
    }
    const savedHash = objectString(job.provider_state, "media_sha256");
    if (savedHash && savedHash !== mediaHash) {
      return {
        kind: "failed",
        code: "x_media_content_changed",
        message: "The image bytes changed after the delivery snapshot was prepared.",
      };
    }
    mediaId = savedHash === mediaHash ? objectString(job.provider_state, "media_id") : null;

    if (!mediaId) {
      await context.persistState(
        { media_sha256: mediaHash, media_mime: image.mimeType },
        "preparation"
      );
      const uploadResponse = await requestProviderJson(
        `${X_API}/media/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media: Buffer.from(image.bytes).toString("base64"),
            media_category: "tweet_image",
            media_type: image.mimeType,
            shared: false,
          }),
        },
        30_000
      );
      if (!uploadResponse.ok) {
        return preMutationFailure(uploadResponse, config, "x_media_upload_failed");
      }
      mediaId = providerId(uploadResponse.body);
      if (!mediaId) {
        return {
          kind: "retry",
          code: "x_media_id_missing",
          message: "X did not return a media identifier.",
          httpStatus: uploadResponse.status,
        };
      }
      await context.persistState(
        { media_id: mediaId, media_sha256: mediaHash },
        "preparation"
      );
    }
  }

  await context.beforePublicMutation(
    mediaId ? { media_id: mediaId, media_sha256: mediaHash } : undefined
  );
  const requestBody: Record<string, unknown> = {
    text: composeXText(job.payload.caption, job.payload.canonical_url),
  };
  if (mediaId) requestBody.media = { media_ids: [mediaId] };
  const response = await requestProviderJson(`${X_API}/tweets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) return publicMutationFailure(response, config, "x_publish_failed");

  const id = providerId(response.body);
  if (!id) {
    return {
      kind: "ambiguous",
      code: "x_remote_id_missing",
      message: "X accepted the request without returning a post identifier.",
      httpStatus: response.status,
      providerState: mediaId ? { media_id: mediaId, media_sha256: mediaHash } : undefined,
    };
  }
  return {
    kind: "success",
    remoteId: id,
    remoteUrl: `https://x.com/i/web/status/${id}`,
    httpStatus: response.status,
    providerState: mediaId ? { media_id: mediaId, media_sha256: mediaHash } : undefined,
  };
}
