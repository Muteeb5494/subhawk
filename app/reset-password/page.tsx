import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./reset-form";

export const metadata = {
  title: "Set a new SubHawk password",
};

export default async function ResetPasswordPage() {
  // The reset email link lands here with a fresh session. No session means
  // the link expired or was already used.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/forgot-password");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Link
        href="/"
        className="mb-8 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
      >
        Sub<span className="text-accent">Hawk</span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Set a new password
        </h1>
        <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">
          For {user.email}
        </p>
        <ResetPasswordForm />
      </div>
    </main>
  );
}
