import "server-only";

import { composeCaption } from "../format";
import { providerId, requestProviderJson } from "../http";
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

export async function deliverFacebook(
  job: SocialOutboxJob,
  config: SocialAccountConfig,
  context: DeliveryContext
): Promise<DeliveryResult> {
  const configurationError = configurationFailure(config);
  if (configurationError) return configurationError;

  const target = config.targetAccountId as string;
  const token = config.accessToken as string;
  const graphVersion = config.apiVersion as string;
  const base = `https://graph.facebook.com/${graphVersion}`;
  const identity = await requestProviderJson(
    `${base}/${encodeURIComponent(target)}?fields=id`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!identity.ok) return preMutationFailure(identity, config, "facebook_identity_failed");
  if (objectString(identity.body, "id") !== target) {
    return {
      kind: "failed",
      code: "facebook_target_mismatch",
      message: "The access token is not bound to the approved Facebook Page.",
      httpStatus: identity.status,
    };
  }

  await context.beforePublicMutation();
  const form = new URLSearchParams({
    message: composeCaption(job.payload.caption, job.payload.canonical_url, 4_500),
    link: job.payload.canonical_url,
  });
  const response = await requestProviderJson(`${base}/${encodeURIComponent(target)}/feed`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  if (!response.ok) return publicMutationFailure(response, config, "facebook_publish_failed");

  const id = providerId(response.body);
  if (!id) {
    return {
      kind: "ambiguous",
      code: "facebook_remote_id_missing",
      message: "Facebook accepted the request without returning a post identifier.",
      httpStatus: response.status,
    };
  }
  return { kind: "success", remoteId: id, httpStatus: response.status };
}
