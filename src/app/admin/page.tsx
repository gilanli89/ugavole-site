import AdminDashboard from "./AdminDashboard";
import { requireStaffPage } from "@/lib/auth/dal";
import { listModerationQueue } from "@/lib/data/moderation";
import { getSocialAccountConfigs } from "@/lib/social/config";

export default async function AdminPage() {
  const staff = await requireStaffPage();
  const items = await listModerationQueue();
  const socialPlatforms = getSocialAccountConfigs()
    .filter((account) => account.enabled)
    .map((account) => account.platform);

  return (
    <AdminDashboard
      initialItems={items}
      editorName={staff.displayName || staff.role}
      socialPlatforms={socialPlatforms}
    />
  );
}
