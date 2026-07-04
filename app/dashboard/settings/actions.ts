"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export type SettingsState = { error?: string; message?: string } | undefined;

export async function changePassword(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.message };
  }

  return { message: "Password updated." };
}

export async function deleteAccount(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const confirmation = String(formData.get("confirmation") ?? "").trim();
  if (confirmation !== "DELETE") {
    return { error: "Type DELETE to confirm." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Deleting the auth user requires the service-role client. The subscriptions
  // rows are removed automatically via the ON DELETE CASCADE foreign key.
  const service = createServiceClient();
  const { error } = await service.auth.admin.deleteUser(user.id);
  if (error) {
    return { error: error.message };
  }

  // Clear the now-invalid session cookies; ignore errors since the user is gone.
  try {
    await supabase.auth.signOut();
  } catch {
    // no-op
  }

  redirect("/");
}
