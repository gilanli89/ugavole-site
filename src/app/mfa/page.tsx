import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/dal";
import { safeAdminDestination } from "@/lib/auth/safe-redirect";
import MfaClient from "./MfaClient";

export const metadata: Metadata = {
  title: "İki aşamalı doğrulama",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MfaPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "editor" && profile.role !== "admin")) {
    redirect("/giris?next=/admin");
  }

  const params = await searchParams;
  return <MfaClient destination={safeAdminDestination(params.next, "https://ugavole.com")} />;
}
