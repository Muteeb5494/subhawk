/**
 * Date helpers for SubHawk.
 *
 * All subscription dates are stored as calendar dates ("YYYY-MM-DD") with no
 * time component. To stay timezone-safe we never let `new Date("YYYY-MM-DD")`
 * parse a bare date (that parses as UTC midnight and can shift a day depending
 * on the viewer's timezone). Instead we anchor to local midnight.
 */

import type { BillingCycle, Subscription } from "./types";

/** Weeks per month, used to normalize weekly costs to a monthly figure. */
const WEEKS_PER_MONTH = 4.33;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateString(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

/** Parse a "YYYY-MM-DD" string to a Date at local midnight. */
export function parseDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Format a "YYYY-MM-DD" string for display, e.g. "Jun 27, 2026". */
export function formatDate(value: string): string {
  return parseDate(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** US dollar formatter. */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/** Today at local midnight, for whole-day comparisons. */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Whole days from today until a "YYYY-MM-DD" date (negative = in the past). */
export function daysUntil(value: string): number {
  const target = parseDate(value);
  const diffMs = target.getTime() - startOfToday().getTime();
  return Math.round(diffMs / 86_400_000);
}

/** Normalize a subscription's cost to a monthly figure. */
export function monthlyCost(cost: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "yearly":
      return cost / 12;
    case "weekly":
      return cost * WEEKS_PER_MONTH;
    case "monthly":
    default:
      return cost;
  }
}

/**
 * The date a subscription is "due": the trial end date for free trials,
 * otherwise the next billing date. This is what we sort and remind on.
 */
export function dueDate(sub: Subscription): string {
  return sub.type === "trial" && sub.trial_end_date
    ? sub.trial_end_date
    : sub.next_billing_date;
}

/** Format a Date's local calendar day as "YYYY-MM-DD". */
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Advance a "YYYY-MM-DD" date by exactly one billing cycle.
 *
 * Month/year steps clamp to the last day of the target month, so e.g.
 * Jan 31 + 1 month → Feb 28 (or 29 in a leap year), and Feb 29 + 1 year →
 * Feb 28 in a non-leap year.
 */
export function addCycle(value: string, cycle: BillingCycle): string {
  const [y, m, d] = value.split("-").map(Number);

  if (cycle === "weekly") {
    // Date handles day overflow into the next month/year correctly.
    return toISODate(new Date(y, m - 1, d + 7));
  }

  let targetYear = y;
  let targetMonth = m - 1; // 0-based
  if (cycle === "monthly") targetMonth += 1;
  else if (cycle === "yearly") targetYear += 1;

  // Normalize a December roll-over (month 12 → next January).
  targetYear += Math.floor(targetMonth / 12);
  targetMonth = ((targetMonth % 12) + 12) % 12;

  // Clamp the day to the last day of the target month.
  const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
  const day = Math.min(d, lastDay);

  return toISODate(new Date(targetYear, targetMonth, day));
}

/**
 * Roll an anchor date forward by whole cycles until it is today or later.
 * Lets a user enter a start date (or any past billing date) and have it
 * normalized to the next upcoming billing date. Dates already in the future
 * are returned unchanged.
 */
export function rollForwardToFuture(value: string, cycle: BillingCycle): string {
  let current = value;
  // Guard against pathological input; 1000 cycles covers ~80+ years.
  for (let i = 0; i < 1000 && daysUntil(current) < 0; i++) {
    current = addCycle(current, cycle);
  }
  return current;
}

/**
 * The next billing date for a newly entered paid subscription. Treats the
 * entered date as an anchor (the day it started or last billed) and returns the
 * next occurrence strictly AFTER today. So entering today's date for a yearly
 * plan yields the date one year out, not today.
 *
 * (The cron uses rollForwardToFuture instead, which keeps a date that lands
 * exactly on today so the day-of reminder still fires.)
 */
export function nextBillingDate(anchor: string, cycle: BillingCycle): string {
  let current = anchor;
  for (let i = 0; i < 1000 && daysUntil(current) <= 0; i++) {
    current = addCycle(current, cycle);
  }
  return current;
}

/** Human label for how far away a due date is. */
export function relativeLabel(days: number): string {
  if (days < 0) {
    const n = Math.abs(days);
    return `${n} day${n === 1 ? "" : "s"} ago`;
  }
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `in ${days} days`;
}
