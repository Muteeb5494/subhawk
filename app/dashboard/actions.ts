"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  BILLING_CYCLES,
  SUB_TYPES,
  type BillingCycle,
  type SubType,
} from "@/lib/types";
import { daysUntil, isValidDateString, nextBillingDate } from "@/lib/dates";
import { reminderStageFor, sendReminderEmail } from "@/lib/reminders";

export type SubFormState = { error?: string } | undefined;

type ParsedSubscription = {
  name: string;
  cost: number;
  billing_cycle: BillingCycle;
  next_billing_date: string;
  type: SubType;
  trial_end_date: string | null;
  notes: string | null;
};

/** The date a parsed subscription is due (trial end for trials). */
function dueOf(d: ParsedSubscription): string {
  return d.type === "trial" && d.trial_end_date
    ? d.trial_end_date
    : d.next_billing_date;
}

function parse(
  formData: FormData,
): { data: ParsedSubscription } | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const costRaw = String(formData.get("cost") ?? "").trim();
  const billing_cycle = String(formData.get("billing_cycle") ?? "");
  const next_billing_date = String(formData.get("next_billing_date") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const trialRaw = String(formData.get("trial_end_date") ?? "").trim();
  const notesRaw = String(formData.get("notes") ?? "").trim();

  if (!name) return { error: "Name is required." };
  if (name.length > 100) return { error: "Name must be 100 characters or fewer." };

  const cost = Number(costRaw);
  if (!costRaw || !Number.isFinite(cost) || cost < 0) {
    return { error: "Cost must be a number of 0 or more." };
  }

  if (!BILLING_CYCLES.includes(billing_cycle as never)) {
    return { error: "Please pick a valid billing cycle." };
  }

  if (!isValidDateString(next_billing_date)) {
    return { error: "Please enter a valid next billing date." };
  }

  if (!SUB_TYPES.includes(type as never)) {
    return { error: "Please pick a valid type." };
  }

  let trial_end_date: string | null = null;
  if (type === "trial") {
    if (!isValidDateString(trialRaw)) {
      return { error: "A free trial needs a valid trial end date." };
    }
    trial_end_date = trialRaw;
  }

  // For recurring (paid) subscriptions, treat the entered date as an anchor
  // (start date or last billing date) and compute the next billing date
  // strictly in the future. Trials keep the entered date as-is (they don't recur).
  const normalizedNextBilling =
    type === "paid"
      ? nextBillingDate(next_billing_date, billing_cycle as BillingCycle)
      : next_billing_date;

  return {
    data: {
      name,
      cost,
      billing_cycle: billing_cycle as BillingCycle,
      next_billing_date: normalizedNextBilling,
      type: type as SubType,
      trial_end_date,
      notes: notesRaw || null,
    },
  };
}

export async function createSubscription(
  _prev: SubFormState,
  formData: FormData,
): Promise<SubFormState> {
  const parsed = parse(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const due = dueOf(parsed.data);
  const days = daysUntil(due);
  const stage = reminderStageFor(days);

  const { error } = await supabase.from("subscriptions").insert({
    ...parsed.data,
    user_id: user.id,
    reminded_for: stage > 0 ? due : null,
    reminder_stage: stage,
  });

  if (error) return { error: error.message };

  // If it already renews within the next 7 days, send a heads-up right away so
  // last-minute additions don't wait for the daily job.
  if (stage > 0 && user.email) {
    try {
      await sendReminderEmail(user.email, parsed.data, due, days);
    } catch {
      // A failed email should never block creating the subscription.
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateSubscription(
  _prev: SubFormState,
  formData: FormData,
): Promise<SubFormState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing subscription id." };

  const parsed = parse(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Look at the existing row so we only re-arm reminders when the due date
  // actually changes (editing a note shouldn't re-send anything).
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("type, next_billing_date, trial_end_date")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const newDue = dueOf(parsed.data);
  const oldDue = existing
    ? existing.type === "trial"
      ? existing.trial_end_date
      : existing.next_billing_date
    : null;

  const payload: Record<string, unknown> = { ...parsed.data };
  let immediate: { due: string; days: number } | null = null;

  if (newDue !== oldDue) {
    // New cycle / changed date: reset reminder tracking, and send a heads-up
    // now if it lands within the next 7 days.
    const days = daysUntil(newDue);
    const stage = reminderStageFor(days);
    payload.reminded_for = stage > 0 ? newDue : null;
    payload.reminder_stage = stage;
    if (stage > 0) immediate = { due: newDue, days };
  }

  const { error } = await supabase
    .from("subscriptions")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  if (immediate && user.email) {
    try {
      await sendReminderEmail(user.email, parsed.data, immediate.due, immediate.days);
    } catch {
      // Ignore email failures during edit.
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteSubscription(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("subscriptions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}
