import Link from "next/link";
import { SubscriptionForm } from "../subscription-form";

export default function NewSubscriptionPage() {
  return (
    <div>
      <Link
        href="/dashboard"
        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        ← Back to dashboard
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Add a subscription
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Track a paid subscription or a free trial.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <SubscriptionForm />
      </div>
    </div>
  );
}
