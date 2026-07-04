"use server";

import { Resend } from "resend";

export type ContactState = { error?: string; message?: string } | undefined;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // Honeypot: real users never see or fill this field. Bots do. Pretend
  // success so they move on.
  const honeypot = String(formData.get("website") ?? "");
  if (honeypot) {
    return { message: "Message sent. Thanks for reaching out." };
  }

  if (!name || name.length > 100) {
    return { error: "Enter your name." };
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email) || email.length > 200) {
    return { error: "Enter a valid email address." };
  }
  if (!message) {
    return { error: "Enter a message." };
  }
  if (message.length > 2000) {
    return { error: "Message must be 2,000 characters or fewer." };
  }

  const to = process.env.CONTACT_EMAIL;
  const from = process.env.REMINDER_FROM_EMAIL;
  if (!to || !from) {
    return { error: "The contact form is not configured yet." };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `SubHawk contact from ${name}`,
    html: `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0f172a;">
    <p style="font-size:18px;font-weight:700;margin:0 0 16px;">Sub<span style="color:#4f46e5;">Hawk</span> contact form</p>
    <p style="font-size:14px;margin:0 0 4px;"><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
    <p style="font-size:14px;line-height:1.6;margin:16px 0 0;white-space:pre-wrap;">${escapeHtml(message)}</p>
  </div>`,
  });

  if (error) {
    return { error: "Could not send your message. Try again in a few minutes." };
  }

  return { message: "Message sent. Thanks for reaching out." };
}
