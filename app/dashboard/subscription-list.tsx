"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BILLING_CYCLE_LABELS,
  SUB_TYPE_LABELS,
  type Subscription,
} from "@/lib/types";
import {
  daysUntil,
  dueDate,
  formatDate,
  formatUSD,
  monthlyCost,
  relativeLabel,
} from "@/lib/dates";
import { DeleteButton } from "./delete-button";

const SOON_DAYS = 7;

type SortKey = "due" | "name" | "cost";

const inputClass =
  "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

function csvField(value: string | number | null): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function exportCsv(subs: Subscription[]) {
  const header = [
    "Name",
    "Cost (USD)",
    "Billing cycle",
    "Type",
    "Next billing date",
    "Trial end date",
    "Notes",
  ];
  const rows = subs.map((s) =>
    [
      csvField(s.name),
      csvField(Number(s.cost).toFixed(2)),
      csvField(BILLING_CYCLE_LABELS[s.billing_cycle]),
      csvField(SUB_TYPE_LABELS[s.type]),
      csvField(s.next_billing_date),
      csvField(s.trial_end_date),
      csvField(s.notes),
    ].join(","),
  );
  const csv = [header.map(csvField).join(","), ...rows].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "subhawk-subscriptions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function SubscriptionList({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("due");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? subscriptions.filter((s) => s.name.toLowerCase().includes(q))
      : subscriptions;

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "cost":
          return (
            monthlyCost(Number(b.cost), b.billing_cycle) -
            monthlyCost(Number(a.cost), a.billing_cycle)
          );
        case "due":
        default:
          return dueDate(a).localeCompare(dueDate(b));
      }
    });
  }, [subscriptions, query, sort]);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search subscriptions"
          aria-label="Search subscriptions"
          className={`${inputClass} min-w-0 flex-1 sm:max-w-xs`}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort subscriptions"
          className={inputClass}
        >
          <option value="due">Soonest due</option>
          <option value="name">Name A to Z</option>
          <option value="cost">Highest cost</option>
        </select>
        <button
          type="button"
          onClick={() => exportCsv(subscriptions)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Export CSV
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400">
            No subscriptions match &ldquo;{query}&rdquo;.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((sub) => {
            const due = dueDate(sub);
            const days = daysUntil(due);
            const soon = days <= SOON_DAYS;
            const urgent = days <= 0; // due today or overdue

            return (
              <li
                key={sub.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${
                  soon
                    ? urgent
                      ? "border-red-300 ring-1 ring-red-200 dark:border-red-500/40 dark:ring-red-500/20"
                      : "border-amber-300 ring-1 ring-amber-200 dark:border-amber-500/40 dark:ring-amber-500/20"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {sub.name}
                      </h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          sub.type === "trial"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {SUB_TYPE_LABELS[sub.type]}
                      </span>
                      {soon && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            urgent
                              ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300"
                          }`}
                        >
                          {sub.type === "trial" ? "Trial ends" : "Renews"}{" "}
                          {relativeLabel(days)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {formatUSD(Number(sub.cost))} ·{" "}
                      {BILLING_CYCLE_LABELS[sub.billing_cycle]}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {sub.type === "trial" ? "Trial ends" : "Next billing"}{" "}
                      {formatDate(due)}
                    </p>
                    {sub.notes && (
                      <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                        {sub.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/${sub.id}/edit`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={sub.id} name={sub.name} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
