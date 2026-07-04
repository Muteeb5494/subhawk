import { Resend } from "resend";
import { BILLING_CYCLE_LABELS, type Subscription } from "./types";
import { formatDate, formatUSD } from "./dates";

/** Fields needed to compose a reminder email. */
type ReminderSub = Pick<
  Subscription,
  "name" | "cost" | "billing_cycle" | "type" | "notes"
>;

/**
 * Which reminder a subscription is due for, based on days until its due date:
 *   0 = none, 1 = week-ahead heads-up, 2 = day-before (or day-of) final notice.
 * We send at most one of each per billing cycle (tracked via reminder_stage).
 */
export function reminderStageFor(days: number): 0 | 1 | 2 {
  if (days <= 1) return 2;
  if (days <= 7) return 1;
  return 0;
}

function whenLabel(days: number): string {
  if (days <= 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
}

export function buildReminderEmail(
  sub: ReminderSub,
  due: string,
  days: number,
): { subject: string; html: string } {
  const when = whenLabel(days);
  const isTrial = sub.type === "trial";

  const subject = isTrial
    ? `Your ${sub.name} free trial ends ${when}`
    : `${sub.name} renews ${when} (${formatUSD(Number(sub.cost))})`;

  const headline = isTrial
    ? `Your <strong>${escapeHtml(sub.name)}</strong> free trial ends ${when}.`
    : `Your <strong>${escapeHtml(sub.name)}</strong> subscription renews ${when}.`;

  const detail = isTrial
    ? `Trial ends on <strong>${formatDate(due)}</strong>. If you don't want to be charged, cancel before then.`
    : `You'll be charged <strong>${formatUSD(Number(sub.cost))}</strong> (${BILLING_CYCLE_LABELS[sub.billing_cycle]}) on <strong>${formatDate(due)}</strong>.`;

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0f172a;">
    <p style="font-size:18px;font-weight:700;margin:0 0 16px;">Sub<span style="color:#4f46e5;">Hawk</span></p>
    <p style="font-size:16px;line-height:1.5;margin:0 0 12px;">${headline}</p>
    <p style="font-size:14px;line-height:1.5;color:#475569;margin:0 0 20px;">${detail}</p>
    ${sub.notes ? `<p style="font-size:13px;color:#94a3b8;margin:0 0 20px;">Your note: ${escapeHtml(sub.notes)}</p>` : ""}
    <p style="font-size:12px;color:#94a3b8;margin:24px 0 0;">You're getting this because you track this subscription in SubHawk.</p>
  </div>`;

  return { subject, html };
}

/** Send a single reminder email via Resend. Returns an error message if it fails. */
export async function sendReminderEmail(
  to: string,
  sub: ReminderSub,
  due: string,
  days: number,
): Promise<{ error?: string }> {
  const from = process.env.REMINDER_FROM_EMAIL;
  if (!from) return { error: "REMINDER_FROM_EMAIL is not set" };

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { subject, html } = buildReminderEmail(sub, due, days);
  const { error } = await resend.emails.send({ from, to, subject, html });
  return { error: error?.message };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
