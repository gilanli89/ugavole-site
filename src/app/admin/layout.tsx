import type { Metadata } from "next";
import { requireStaffPage } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: "Moderasyon merkezi",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireStaffPage();
  return children;
}
