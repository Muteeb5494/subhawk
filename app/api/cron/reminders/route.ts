import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { type Subscription } from "@/lib/types";
import { daysUntil, rollForwardToFuture } from "@/lib/dates";
import { reminderStageFor, sendReminderEmail } from "@/lib/reminders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically when
  // the CRON_SECRET env var is set. This blocks anyone else from triggering it.
  const authHeader = request.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase.from("subscriptions").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const subscriptions = (data ?? []) as Subscription[];

  // Look up user emails once per user.
  const emailCache = new Map<string, string | null>();
  async function emailFor(userId: string): Promise<string | null> {
    if (emailCache.has(userId)) return emailCache.get(userId)!;
    const { data } = await supabase.auth.admin.getUserById(userId);
    const email = data.user?.email ?? null;
    emailCache.set(userId, email);
    return email;
  }

  let remindersSent = 0;
  let rolledForward = 0;
  const errors: string[] = [];

  for (const sub of subscriptions) {
    // Keep recurring subscriptions current: if a billing date has passed, roll
    // it forward and reset the reminder tracking so the new cycle reminds again.
    if (sub.type === "paid" && daysUntil(sub.next_billing_date) < 0) {
      const rolled = rollForwardToFuture(sub.next_billing_date, sub.billing_cycle);
      const { error: updErr } = await supabase
        .from("subscriptions")
        .update({ next_billing_date: rolled, reminded_for: null, reminder_stage: 0 })
        .eq("id", sub.id);
      if (updErr) {
        errors.push(`roll ${sub.id}: ${updErr.message}`);
      } else {
        sub.next_billing_date = rolled;
        sub.reminded_for = null;
        sub.reminder_stage = 0;
        rolledForward++;
      }
    }

    // The date we remind on: trial end for trials, next billing otherwise.
    const due = sub.type === "trial" ? sub.trial_end_date : sub.next_billing_date;
    if (!due) continue;

    const days = daysUntil(due);
    const target = reminderStageFor(days);
    if (target === 0) continue;

    // How far we've already reminded for THIS due date (stage resets per cycle).
    const currentStage = sub.reminded_for === due ? sub.reminder_stage : 0;
    if (target <= currentStage) continue;

    const email = await emailFor(sub.user_id);
    if (!email) continue;

    const { error: sendErr } = await sendReminderEmail(email, sub, due, days);
    if (sendErr) {
      errors.push(`send ${sub.id}: ${sendErr}`);
      continue;
    }

    await supabase
      .from("subscriptions")
      .update({ reminded_for: due, reminder_stage: target })
      .eq("id", sub.id);
    remindersSent++;
  }

  return NextResponse.json({
    ok: true,
    checked: subscriptions.length,
    remindersSent,
    rolledForward,
    errors,
  });
}
