export const BILLING_CYCLES = ["monthly", "yearly", "weekly"] as const;
export type BillingCycle = (typeof BILLING_CYCLES)[number];

export const SUB_TYPES = ["paid", "trial"] as const;
export type SubType = (typeof SUB_TYPES)[number];

export type Subscription = {
  id: string;
  user_id: string;
  name: string;
  cost: number;
  billing_cycle: BillingCycle;
  /** Stored as a calendar date: "YYYY-MM-DD" (no time, timezone-safe). */
  next_billing_date: string;
  type: SubType;
  /** "YYYY-MM-DD" for free trials, null for paid subscriptions. */
  trial_end_date: string | null;
  notes: string | null;
  /** The due date we last sent reminders for, used to de-duplicate. */
  reminded_for: string | null;
  /** Highest reminder already sent for `reminded_for` (0 none, 1 heads-up, 2 final). */
  reminder_stage: number;
  created_at: string;
  updated_at: string;
};

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: "Monthly",
  yearly: "Yearly",
  weekly: "Weekly",
};

export const SUB_TYPE_LABELS: Record<SubType, string> = {
  paid: "Paid subscription",
  trial: "Free trial",
};
