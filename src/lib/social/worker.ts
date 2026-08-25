import "server-only";

import { randomUUID } from "node:crypto";
import { deliverSocialJob } from "./adapters";
import { getSocialAccountConfig } from "./config";
import {
  claimSocialJobs,
  finishSocialJob,
  markPublicMutationStarted,
  persistProviderState,
  revalidateSocialJob,
  syncSocialAccountMetadata,
} from "./outbox";
import type { DeliveryResult, SocialOutboxJob, WorkerSummary } from "./types";

class LeaseLostError extends Error {
  constructor() {
    super("social_worker_lease_lost");
  }
}

class EligibilityRevokedError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

class CredentialDeferredError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

class JobFinalizedBeforeMutationError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

function emptySummary(): WorkerSummary {
  return {
    claimed: 0,
    succeeded: 0,
    retried: 0,
    failed: 0,
    cancelled: 0,
    ambiguous: 0,
    leaseLost: 0,
  };
}

function increment(summary: WorkerSummary, kind: DeliveryResult["kind"] | "cancelled") {
  if (kind === "success") summary.succeeded += 1;
  else if (kind === "retry") summary.retried += 1;
  else if (kind === "failed") summary.failed += 1;
  else if (kind === "ambiguous") summary.ambiguous += 1;
  else summary.cancelled += 1;
}

async function finishOrLoseLease(
  job: SocialOutboxJob,
  outcome: DeliveryResult | { kind: "cancelled"; code: string; message: string }
) {
  const persisted = await finishSocialJob(job, outcome);
  if (!persisted) throw new LeaseLostError();
}

async function processJob(job: SocialOutboxJob): Promise<DeliveryResult | { kind: "cancelled"; code: string; message: string }> {
  const initialEligibility = await revalidateSocialJob(job);
  if (!initialEligibility.ok) {
    if (initialEligibility.retryable) {
      const deferred: DeliveryResult = {
        kind: "retry",
        code: initialEligibility.code,
        message: "Platform credentials are temporarily unavailable; delivery remains queued.",
        retryAfterSeconds: 900,
      };
      await finishOrLoseLease(job, deferred);
      return deferred;
    }
    const cancelled = {
      kind: "cancelled" as const,
      code: initialEligibility.code,
      message: "Content or destination no longer matches the approved snapshot.",
    };
    await finishOrLoseLease(job, cancelled);
    return cancelled;
  }

  let publicMutationStarted = false;
  const context = {
    persistState: async (
      state: Record<string, unknown>,
      phase: "preflight" | "preparation" | "provider_processing"
    ) => {
      if (publicMutationStarted) throw new LeaseLostError();
      const persisted = await persistProviderState(job, state, phase);
      if (!persisted) throw new LeaseLostError();
      Object.assign(job.provider_state, state);
    },
    beforePublicMutation: async (state: Record<string, unknown> = {}) => {
      if (publicMutationStarted) throw new LeaseLostError();
      const finalEligibility = await revalidateSocialJob(job);
      if (!finalEligibility.ok) {
        if (finalEligibility.retryable) {
          throw new CredentialDeferredError(finalEligibility.code);
        }
        throw new EligibilityRevokedError(finalEligibility.code);
      }
      const marker = await markPublicMutationStarted(job, state);
      if (marker === "lease_lost") throw new LeaseLostError();
      if (marker === "invalidated") {
        throw new JobFinalizedBeforeMutationError("approval_invalidated_at_mutation");
      }
      if (marker === "cap_reached") {
        throw new JobFinalizedBeforeMutationError("x_monthly_posting_cap_reached");
      }
      publicMutationStarted = true;
      Object.assign(job.provider_state, state);
    },
  };

  try {
    const result = await deliverSocialJob(job, getSocialAccountConfig(job.platform), context);
    await finishOrLoseLease(job, result);
    return result;
  } catch (error) {
    if (error instanceof LeaseLostError) throw error;
    if (error instanceof JobFinalizedBeforeMutationError) {
      return {
        kind: "cancelled" as const,
        code: error.code,
        message: "The job was atomically cancelled immediately before public mutation.",
      };
    }
    if (error instanceof CredentialDeferredError) {
      const deferred: DeliveryResult = {
        kind: "retry",
        code: error.code,
        message: "Platform credentials became unavailable before public mutation; delivery remains queued.",
        retryAfterSeconds: 900,
      };
      await finishOrLoseLease(job, deferred);
      return deferred;
    }
    if (error instanceof EligibilityRevokedError) {
      const cancelled = {
        kind: "cancelled" as const,
        code: error.code,
        message: "Eligibility changed immediately before public mutation.",
      };
      await finishOrLoseLease(job, cancelled);
      return cancelled;
    }

    const result: DeliveryResult = publicMutationStarted
      ? {
          kind: "ambiguous",
          code: "ambiguous_network_failure",
          message: "The provider connection failed after public mutation started; manual reconciliation required.",
        }
      : {
          kind: "retry",
          code: "provider_preflight_network_failure",
          message: "A provider preflight or preparation request failed before public mutation.",
        };
    await finishOrLoseLease(job, result);
    return result;
  }
}

export async function runSocialWorker(batchSize = 5): Promise<WorkerSummary> {
  const safeBatchSize = Math.max(1, Math.min(Math.trunc(batchSize), 10));
  await syncSocialAccountMetadata();
  const jobs = await claimSocialJobs({
    workerId: `next-cron:${randomUUID()}`,
    batchSize: safeBatchSize,
    leaseSeconds: 600,
  });
  const summary = emptySummary();
  summary.claimed = jobs.length;

  for (const job of jobs) {
    try {
      const result = await processJob(job);
      increment(summary, result.kind);
    } catch (error) {
      if (error instanceof LeaseLostError) {
        summary.leaseLost += 1;
        continue;
      }
      // A persistence/configuration failure leaves the durable lease in place.
      // Expiry recovery will safely retry pre-mutation work or mark a started
      // public mutation ambiguous.
      summary.leaseLost += 1;
    }
  }
  return summary;
}
