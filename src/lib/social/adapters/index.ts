import "server-only";

import type {
  DeliveryContext,
  DeliveryResult,
  SocialAccountConfig,
  SocialOutboxJob,
} from "../types";
import { deliverFacebook } from "./facebook";
import { deliverInstagram } from "./instagram";
import { deliverX } from "./x";

export function deliverSocialJob(
  job: SocialOutboxJob,
  config: SocialAccountConfig,
  context: DeliveryContext
): Promise<DeliveryResult> {
  switch (job.platform) {
    case "facebook":
      return deliverFacebook(job, config, context);
    case "instagram":
      return deliverInstagram(job, config, context);
    case "x":
      return deliverX(job, config, context);
  }
}
