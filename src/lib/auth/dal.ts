import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "reader" | "contributor" | "editor" | "admin";

export type StaffSession = {
  userId: string;
  displayName: string | null;
  role: "editor" | "admin";
};

type StaffAuthState = {
  staff: StaffSession | null;
  mfaRequired: boolean;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  role: UserRole;
};

export const getCurrentProfile = cache(async (): Promise<ProfileRow | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return data as ProfileRow;
});

const getStaffAuthState = cache(async (): Promise<StaffAuthState> => {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "editor" && profile.role !== "admin")) {
    return { staff: null, mfaRequired: false };
  }

  const staff: StaffSession = {
    userId: profile.id,
    displayName: profile.display_name,
    role: profile.role,
  };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  return {
    staff,
    // Auth errors also fail closed instead of silently weakening the staff gate.
    mfaRequired: Boolean(error) || data?.currentLevel !== "aal2",
  };
});

export async function getStaffSession(): Promise<StaffSession | null> {
  const state = await getStaffAuthState();
  return state.mfaRequired ? null : state.staff;
}

export async function requireStaffPage(): Promise<StaffSession> {
  const state = await getStaffAuthState();
  if (!state.staff) redirect("/giris?next=/admin");
  if (state.mfaRequired) redirect("/mfa?next=/admin");
  return state.staff;
}
