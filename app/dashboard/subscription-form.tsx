"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  BILLING_CYCLES,
  BILLING_CYCLE_LABELS,
  SUB_TYPES,
  SUB_TYPE_LABELS,
  type Subscription,
  type SubType,
} from "@/lib/types";
import {
  createSubscription,
  updateSubscription,
  type SubFormState,
} from "./actions";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";
const labelClass =
  "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

export function SubscriptionForm({
  subscription,
}: {
  subscription?: Subscription;
}) {
  const isEdit = Boolean(subscription);
  const action = isEdit ? updateSubscription : createSubscription;

  const [state, formAction, pending] = useActionState<SubFormState, FormData>(
    action,
    undefined,
  );

  const [type, setType] = useState<SubType>(subscription?.type ?? "paid");

  return (
    <form action={formAction} className="space-y-5">
      {isEdit && <input type="hidden" name="id" value={subscription!.id} />}

      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          defaultValue={subscription?.name}
          placeholder="Netflix"
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cost" className={labelClass}>
            Cost (USD)
          </label>
          <input
            id="cost"
            name="cost"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={subscription?.cost}
            placeholder="15.99"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="billing_cycle" className={labelClass}>
            Billing cycle
          </label>
          <select
            id="billing_cycle"
            name="billing_cycle"
            defaultValue={subscription?.billing_cycle ?? "monthly"}
            className={inputClass}
          >
            {BILLING_CYCLES.map((cycle) => (
              <option key={cycle} value={cycle}>
                {BILLING_CYCLE_LABELS[cycle]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="next_billing_date" className={labelClass}>
            {type === "trial" ? "First billing date" : "Billing date"}
          </label>
          <input
            id="next_billing_date"
            name="next_billing_date"
            type="date"
            required
            defaultValue={subscription?.next_billing_date}
            className={inputClass}
          />
          {type === "paid" && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Enter when it started or last billed. We&apos;ll set the next
              renewal date for you.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="type" className={labelClass}>
            Type
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as SubType)}
            className={inputClass}
          >
            {SUB_TYPES.map((t) => (
              <option key={t} value={t}>
                {SUB_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {type === "trial" && (
        <div>
          <label htmlFor="trial_end_date" className={labelClass}>
            Trial end date
          </label>
          <input
            id="trial_end_date"
            name="trial_end_date"
            type="date"
            required
            defaultValue={subscription?.trial_end_date ?? undefined}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            We&apos;ll remind you before the free trial ends.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes <span className="text-slate-400 dark:text-slate-500">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={1000}
          defaultValue={subscription?.notes ?? ""}
          placeholder="Shared family plan, cancel before renewal, etc."
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {pending
            ? "Saving…"
            : isEdit
              ? "Save changes"
              : "Add subscription"}
        </button>
        <Link
          href="/dashboard"
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
