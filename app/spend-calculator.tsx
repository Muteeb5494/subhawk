"use client";

import { useMemo, useState } from "react";

type Item = { name: string; cost: number };

const ITEMS: Item[] = [
  { name: "Netflix", cost: 15.49 },
  { name: "Spotify", cost: 11.99 },
  { name: "ChatGPT Plus", cost: 20 },
  { name: "iCloud+", cost: 2.99 },
  { name: "Amazon Prime", cost: 14.99 },
  { name: "Disney+", cost: 9.99 },
  { name: "Adobe CC", cost: 54.99 },
  { name: "Gym app", cost: 9.99 },
];

const AVERAGE_GUESS = 86;

function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function SpendCalculator() {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const total = useMemo(
    () => [...selected].reduce((sum, i) => sum + ITEMS[i].cost, 0),
    [selected],
  );

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const message =
    selected.size === 0
      ? "Tap a few boxes to see where you land. The average person underestimates their subscription spend by about $133 a month."
      : total < AVERAGE_GUESS
        ? "Most people guess around $86 a month, then find they're actually paying closer to $219. Keep tapping."
        : "You're already past what most people guess they spend. This is the number SubHawk keeps in view for you, always.";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        See it for yourself. Tap what you pay for.
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {ITEMS.map((item, i) => {
          const on = selected.has(i);
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={on}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition motion-safe:hover:-translate-y-0.5 ${
                on
                  ? "border-accent bg-accent text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-accent dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              {item.name} · {formatUSD(item.cost)}
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Your estimated monthly spend
        </p>
        <p className="mt-0.5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {formatUSD(total)}
        </p>
        <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {message}
        </p>
      </div>
    </div>
  );
}
