import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Subscription } from "@/lib/types";
import { SubscriptionForm } from "../../subscription-form";

export default async function EditSubscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", id)
    .single();

  // RLS ensures this only returns the row if the current user owns it.
  if (!data) notFound();

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        ← Back to dashboard
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Edit subscription
      </h1>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <SubscriptionForm subscription={data as Subscription} />
      </div>
    </div>
  );
}
