# Ugavole Social Outbox

This module delivers only immutable, editor-approved `content_items` snapshots. Publishing a content row never calls a provider API directly. Approval inserts one idempotent job per platform; a separately signed cron request leases and processes a bounded batch.

## Safety model

- `status=published`, `ad_status=eligible`, `social_status=ready`, the expected `content_version`, and an `editor`/`admin` actor are all required by the enqueue RPC.
- Authenticated publish/enqueue calls and staff queue reads require a current AAL2 JWT; service-role worker calls use their separate narrow RPC path.
- Atomic publish refuses UGC unless rights confirmation and a non-empty privacy-consent version are present.
- The worker repeats the content, version, media URL, destination fingerprint, and eligibility checks immediately before every public provider mutation.
- During the bounded `publish_started` lease, database triggers reject content-snapshot deletion/change and destination-identity changes, closing the marker-to-provider-call race.
- Credentials remain in server environment variables. Database rows contain destination IDs and fingerprints, never access or refresh tokens.
- Every claim has a unique lease token. Completion updates require the same unexpired lease.
- A lease that expires after `publish_started` becomes `ambiguous`; it is never replayed automatically.
- Provider `2xx` responses without a remote ID and every non-success/network outcome after `publish_started` become `ambiguous`; no provider currently has an approved idempotency guarantee for automatic replay.
- X is disabled unless its explicit enable flag, user-scoped token with recorded expiry, target user ID, current cost notice, and positive monthly cap are all configured.
- Remote images must use HTTPS, an exact allow-listed hostname, and no query string or fragment. Redirects are revalidated and downloads are limited to 5 MB.
- The protected publish helper fetches the approved media once and snapshots its SHA-256 with the outbox job; every worker fetch must match it. Instagram media hosts must additionally provide immutable public URLs because Meta fetches the URL itself.

## Database installation

Apply migrations in order:

1. `supabase/migrations/001_content_kernel.sql`
2. `supabase/migrations/002_social_outbox.sql`
3. `supabase/migrations/003_publish_workflow.sql`

The second migration creates `social_accounts`, `social_outbox`, delivery/audit logs, atomic enqueue/claim/complete RPCs, and durable cron replay protection. Tables are RLS-protected. Staff can read sanitized queue metadata; only RPCs or the service role can mutate it.

The future protected editorial action should call `enqueueApprovedContent()` with the authenticated staff UUID and the exact content version. Its result distinguishes a new insert from an existing idempotency key; an old `failed` or `succeeded` row must not be shown as newly queued.

For the normal editorial path, call `publishApprovedContent()`. Its database RPC locks an `approved` row, checks the expected content version, applies the explicit ad/social decisions, records the moderation event, and (only when requested) inserts outbox jobs in the same transaction. `socialReady=true` with `adEligible=false` is rejected without publishing anything. One content version can be delivered to each configured account only once; a deliberate repost requires a new approved content version (or a future explicit repost-generation workflow).

## Server environment

Common:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=server-only
UGAVOLE_SOCIAL_WORKER_ENABLED=false
SOCIAL_CRON_SECRET=at-least-32-random-bytes
SOCIAL_MEDIA_ALLOWED_HOSTS=ugavole.com,PROJECT.supabase.co
INSTAGRAM_IMMUTABLE_MEDIA_HOSTS=media.ugavole.com
```

Facebook Page:

```dotenv
UGAVOLE_FACEBOOK_ENABLED=false
META_GRAPH_API_VERSION=vXX.X
META_PAGE_ID=
META_PAGE_HANDLE=UGavole
META_PAGE_ACCESS_TOKEN=server-only
META_ACCESS_TOKEN_EXPIRES_AT=optional-ISO-8601-expiry
```

The Meta app and Page token must have the current Page publishing permissions required by the pinned Graph API version (including Page post management/read access). Verify them in Meta's official tooling; a token merely existing is not treated as permission proof.

Instagram Professional (must be linked to the managed Facebook Page):

```dotenv
UGAVOLE_INSTAGRAM_ENABLED=false
META_INSTAGRAM_ACCOUNT_ID=
META_INSTAGRAM_HANDLE=
META_INSTAGRAM_ACCESS_TOKEN=server-only
```

If `META_INSTAGRAM_ACCESS_TOKEN` is omitted, the adapter uses the configured Page token. The initial Instagram adapter intentionally accepts JPEG single-image posts only.
The Instagram account must be Professional, linked to the configured Facebook Page, and the token must carry the current Instagram basic/content-publishing and Page-read permissions required by Meta.

X (default off):

```dotenv
UGAVOLE_X_ENABLED=false
X_API_USER_ID=
X_DISPLAY_HANDLE=optional-verified-display-handle
X_USER_ACCESS_TOKEN=server-only-user-context-token
X_USER_ACCESS_TOKEN_EXPIRES_AT=required-ISO-8601-expiry
X_API_MONTHLY_POST_CAP=0
X_API_COST_NOTICE=Current verified estimate and billing-plan note
```

The X token must be user-context OAuth for the configured user, with post-write and offline access as required by the selected OAuth flow. App-only bearer tokens are not accepted for publishing. Delivery pauses and safely retries before mutation when the recorded access-token expiry is missing or less than 15 minutes away; queued jobs are not cancelled or allowed to exhaust their worker-run budget merely because credentials need refresh. Secure refresh-token storage and rotation still must be connected during account onboarding for unattended operation; a static access token is deliberately not presented as full automation.

Do not set any provider secret under a `NEXT_PUBLIC_` name. Do not put tokens in Supabase rows, captions, error text, request URLs, or logs. Token rotation and OAuth callback setup are intentionally outside this package until the accounts and permissions are created by the owner.

## Signed cron request

Only `POST /api/cron/social` is accepted. Sign the exact raw JSON body with:

```text
hex_hmac_sha256(SOCIAL_CRON_SECRET, "<unix-seconds>.<raw-body>")
```

Send it as `X-Ugavole-Signature: v1=<hex>` with `X-Ugavole-Timestamp: <unix-seconds>`. Requests are valid for five minutes and their signature hash is atomically consumed once in Supabase. The HTTP worker intentionally handles one job per invocation so a serverless timeout cannot strand a large leased batch.

Keep `UGAVOLE_SOCIAL_WORKER_ENABLED=false` until migrations, account identities, scopes, media hosts, platform costs, and a staging dry run have been verified. Enabling the worker and making the first real post are production actions and require explicit owner approval.

## RSS editorial handoff

The RSS registry is a discovery layer, not a republishing license. Local and commercial publishers remain link-only. The small official-source pilot can create a private `pending` editorial draft only when `UGAVOLE_EDITORIAL_DRAFTS_ENABLED=true`, `EDITORIAL_CRON_SECRET`, `GEMINI_API_KEY`, and `UGAVOLE_EDITORIAL_MODEL` are configured. It sends only an RSS title and summary to Gemini, never downloads source article bodies or images. Each draft retains its source URL and must be edited, approved, and explicitly published before an ad or social job can exist.

## Provider contracts

- Facebook Page publishing uses the version-pinned Graph API Page `/feed` endpoint with a Page access token.
- Instagram uses `/{ig-user-id}/media`, polls the container, then calls `/{ig-user-id}/media_publish`.
- X verifies `/2/users/me`, optionally uploads an image with `media_category=tweet_image`, then calls `POST /2/tweets`.

Official references:

- <https://developers.facebook.com/docs/pages-api/posts/>
- <https://developers.facebook.com/docs/instagram-platform/content-publishing/>
- <https://docs.x.com/x-api/media/upload-media>
- <https://docs.x.com/x-api/posts/create-post>

## Local non-network smoke test

```bash
npx tsx scripts/social-outbox-smoke.ts
npx tsx scripts/social-config-smoke.ts
```

These tests check caption bounds, signed-cron verification, and fail-closed credential readiness. They do not contact Supabase, Meta, Instagram, or X.
