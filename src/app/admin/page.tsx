import AdminDashboard from "./AdminDashboard";
import { requireStaffPage } from "@/lib/auth/dal";
import { listModerationQueue } from "@/lib/data/moderation";
import {
  listDictionaryModerationQueue,
  listPublishedDictionaryModerationEntries,
} from "@/lib/data/dictionary";
import { getSocialAccountConfigs } from "@/lib/social/config";

export default async function AdminPage() {
  const staff = await requireStaffPage();
  const [items, dictionaryItems, publishedDictionaryItems] = await Promise.all([
    listModerationQueue(),
    listDictionaryModerationQueue(),
    listPublishedDictionaryModerationEntries(),
  ]);
  const socialPlatforms = getSocialAccountConfigs()
    .filter((account) => account.enabled)
    .map((account) => account.platform);

  return (
    <AdminDashboard
      initialItems={items}
      initialDictionaryItems={dictionaryItems}
      initialPublishedDictionaryItems={publishedDictionaryItems}
      editorName={staff.displayName || staff.role}
      socialPlatforms={socialPlatforms}
    />
  );
}
