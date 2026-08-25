export type SocialPlatform = "facebook" | "instagram" | "x";

export type SocialOutboxStatus =
  | "pending"
  | "processing"
  | "retry"
  | "failed"
  | "succeeded"
  | "cancelled"
  | "ambiguous";

export type SocialDeliveryPhase =
  | "queued"
  | "preflight"
  | "preparation"
  | "provider_processing"
  | "publish_started"
  | "completed";

export type SocialMediaSnapshot = {
  url: string;
  url_hash: string;
  sha256: string;
};

export type SocialPayloadSnapshot = {
  schema_version: 1;
  content_id: string;
  content_version: number;
  slug: string;
  title: string;
  excerpt: string;
  caption: string;
  canonical_url: string;
  media?: SocialMediaSnapshot;
};

export type ProviderState = Record<string, unknown>;

export type SocialOutboxJob = {
  id: string;
  event_key: string;
  content_id: string;
  content_version: number;
  account_id: string;
  platform: SocialPlatform;
  target_account_id: string;
  target_fingerprint: string;
  payload: SocialPayloadSnapshot;
  payload_hash: string;
  status: SocialOutboxStatus;
  delivery_phase: SocialDeliveryPhase;
  worker_run_count: number;
  max_worker_runs: number;
  attempt_count: number;
  max_attempts: number;
  lease_token: string;
  leased_until: string;
  provider_state: ProviderState;
};

export type SocialAccountMetadata = {
  platform: SocialPlatform;
  enabled: boolean;
  targetAccountId: string | null;
  displayHandle: string | null;
  apiVersion: string | null;
  fingerprint: string | null;
  postingCap: number | null;
  costNotice: string | null;
  credentialExpiresAt: string | null;
};

export type SocialAccountConfig = SocialAccountMetadata & {
  accessToken: string | null;
  configurationIssue: string | null;
};

export type DeliveryResult =
  | {
      kind: "success";
      remoteId: string;
      remoteUrl?: string;
      httpStatus?: number;
      providerState?: ProviderState;
    }
  | {
      kind: "retry";
      code: string;
      message: string;
      retryAfterSeconds?: number;
      httpStatus?: number;
      providerState?: ProviderState;
    }
  | {
      kind: "failed";
      code: string;
      message: string;
      httpStatus?: number;
      providerState?: ProviderState;
    }
  | {
      kind: "ambiguous";
      code: string;
      message: string;
      httpStatus?: number;
      providerState?: ProviderState;
    };

export type DeliveryContext = {
  persistState: (
    state: ProviderState,
    phase: Extract<SocialDeliveryPhase, "preflight" | "preparation" | "provider_processing">
  ) => Promise<void>;
  beforePublicMutation: (state?: ProviderState) => Promise<void>;
};

export type WorkerSummary = {
  claimed: number;
  succeeded: number;
  retried: number;
  failed: number;
  cancelled: number;
  ambiguous: number;
  leaseLost: number;
};
