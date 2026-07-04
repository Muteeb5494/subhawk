import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { type Subscription } from "@/lib/types";
import { formatUSD, monthlyCost } from "@/lib/dates";
import { SubscriptionList } from "./subscription-list";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("subscriptions").select("*");

  const subscriptions = (data ?? []) as Subscription[];

  // Estimated spend across paid subscriptions only (free trials cost $0
  // until they convert).
  const monthlyTotal = subscriptions
    .filter((s) => s.type === "paid")
    .reduce((sum, s) => sum + monthlyCost(Number(s.cost), s.billing_cycle), 0);
  const yearlyTotal = monthlyTotal * 12;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Your subscriptions
        </h1>
        <Link
          href="/dashboard/new"
          className="shrink-0 rounded-lg bg-accent px-4 py-2 font-medium text-white transition hover:bg-accent-hover"
        >
          + Add
        </Link>
      </div>

      {/* Estimated spend */}
      <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Estimated monthly spend
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {formatUSD(monthlyTotal)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Estimated yearly spend
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {formatUSD(yearlyTotal)}
          </p>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400">
            No subscriptions yet.
          </p>
          <Link
            href="/dashboard/new"
            className="mt-3 inline-block font-medium text-accent hover:text-accent-hover"
          >
            Add your first one →
          </Link>
        </div>
      ) : (
        <SubscriptionList subscriptions={subscriptions} />
      )}
    </div>
  );
}
