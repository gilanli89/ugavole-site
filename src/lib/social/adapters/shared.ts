import "server-only";

import {
  isExplicitTransientProviderError,
  isRetryableStatus,
  providerMessage,
  type ProviderResponse,
} from "../http";
import type { DeliveryResult, SocialAccountConfig } from "../types";

export function configurationFailure(config: SocialAccountConfig): DeliveryResult | null {
  if (
    config.enabled &&
    !config.configurationIssue &&
    config.targetAccountId &&
    config.apiVersion &&
    config.fingerprint &&
    config.accessToken
  ) {
    return null;
  }
  if (
    config.enabled &&
    [
      "access_token_missing",
      "access_token_expiry_missing",
      "access_token_expired_or_imminent",
    ].includes(config.configurationIssue ?? "")
  ) {
    return {
      kind: "retry",
      code: config.configurationIssue as string,
      message: "Platform credentials are temporarily unavailable; delivery remains queued.",
      retryAfterSeconds: 900,
    };
  }
  return {
    kind: "failed",
    code: config.configurationIssue ?? "platform_disabled",
    message: "Platform configuration is disabled or incomplete.",
  };
}

export function preMutationFailure(
  response: ProviderResponse,
  config: SocialAccountConfig,
  code: string
): DeliveryResult {
  const message = providerMessage(response.body, [config.accessToken]);
  if (isRetryableStatus(response.status) || isExplicitTransientProviderError(response.body)) {
    return {
      kind: "retry",
      code,
      message,
      httpStatus: response.status,
      retryAfterSeconds: response.retryAfterSeconds,
    };
  }
  return { kind: "failed", code, message, httpStatus: response.status };
}

export function publicMutationFailure(
  response: ProviderResponse,
  config: SocialAccountConfig,
  code: string
): DeliveryResult {
  const message = providerMessage(response.body, [config.accessToken]);
  return {
    kind: "ambiguous",
    code: `ambiguous_${code}`,
    message,
    httpStatus: response.status,
  };
}

export function objectString(value: unknown, key: string): string | null {
  if (!value || typeof value !== "object") return null;
  const result = (value as Record<string, unknown>)[key];
  return typeof result === "string" || typeof result === "number" ? String(result) : null;
}
