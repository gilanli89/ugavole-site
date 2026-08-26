import { createCronSignature } from "../src/lib/social/hmac";

async function main() {
  const job = process.argv[2];
  if (job !== "social" && job !== "maintenance") {
    throw new Error("Usage: tsx scripts/run-signed-cron.ts <social|maintenance>");
  }

  const secret = job === "social"
    ? process.env.SOCIAL_CRON_SECRET
    : process.env.RETENTION_CRON_SECRET;
  const siteUrl = (process.env.UGAVOLE_SITE_URL ?? "https://ugavole.com").replace(/\/$/, "");
  if (!secret || secret.length < 32) {
    throw new Error(`${job === "social" ? "SOCIAL_CRON_SECRET" : "RETENTION_CRON_SECRET"} is missing or too short.`);
  }

  const rawBody = job === "social" ? JSON.stringify({ batchSize: 1 }) : "{}";
  const timestamp = Math.floor(Date.now() / 1_000);
  const signature = createCronSignature(secret, timestamp, rawBody);
  const response = await fetch(`${siteUrl}/api/cron/${job}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Ugavole-Timestamp": String(timestamp),
      "X-Ugavole-Signature": `v1=${signature}`,
    },
    body: rawBody,
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`${job} cron failed with HTTP ${response.status}: ${responseText.slice(0, 500)}`);
  }
  console.log(`${job} cron completed: ${responseText.slice(0, 500)}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Signed cron failed");
  process.exitCode = 1;
});
