import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChangePasswordForm, DeleteAccountForm } from "./settings-forms";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        ← Back to dashboard
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Account settings
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">{user.email}</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Change password
        </h2>
        <div className="mt-4 max-w-sm">
          <ChangePasswordForm />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-500/30 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
          Delete account
        </h2>
        <div className="mt-4 max-w-sm">
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}
