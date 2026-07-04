import Link from "next/link";

export const metadata = {
  title: "SubHawk privacy policy",
};

const h2 = "mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100";
const p = "mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400";
const li = "text-sm leading-relaxed text-slate-600 dark:text-slate-400";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
      <Link
        href="/"
        className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
      >
        Sub<span className="text-accent">Hawk</span>
      </Link>
      <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Privacy policy
      </h1>
      <p className={p}>Last updated: July 4, 2026</p>

      <p className={p}>
        SubHawk is a subscription tracker built around a simple idea: you
        should not have to hand over sensitive financial access to keep track
        of what you pay for. This policy explains what we collect, what we
        deliberately do not collect, and what happens to your data.
      </p>

      <h2 className={h2}>What we collect</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li className={li}>
          Account information: your email address and a password (stored only
          as a secure hash), or your name and email from Google if you sign in
          with Google.
        </li>
        <li className={li}>
          The subscription entries you add: names, costs, billing cycles,
          dates, and any notes you write. You type these in yourself; we never
          pull them from anywhere.
        </li>
        <li className={li}>
          Messages you send through the contact form, so we can reply.
        </li>
      </ul>

      <h2 className={h2}>What we never collect</h2>
      <p className={p}>
        We do not ask for, receive, or store bank logins, card numbers,
        account numbers, or transaction data. We do not connect to your bank.
        We do not read your email inbox. There is no payment processing in
        SubHawk at all.
      </p>

      <h2 className={h2}>How we use your data</h2>
      <p className={p}>
        We use your data for exactly one purpose: running SubHawk for you.
        That means showing you your subscriptions, sending you reminder emails
        before renewals and trial deadlines, sending account emails like
        password resets, and replying when you contact us. We do not sell your
        data, share it with advertisers, or use it for anything else.
      </p>

      <h2 className={h2}>Cookies and analytics</h2>
      <p className={p}>
        SubHawk uses only the cookies required to keep you signed in. There
        are no advertising or tracking cookies. We use Vercel Web Analytics to
        count visits in aggregate; it is cookieless and does not identify or
        profile individual visitors.
      </p>

      <h2 className={h2}>Who processes your data</h2>
      <p className={p}>
        SubHawk runs on three infrastructure providers that process data on
        our behalf: Supabase (database and authentication), Resend (email
        delivery), and Vercel (hosting). Each receives only what it needs to
        do its job, and none of them may use your data for their own purposes.
      </p>

      <h2 className={h2}>Your control</h2>
      <p className={p}>
        Your data stays yours. You can export every subscription you track as
        a CSV file at any time from the dashboard. You can delete your account
        from the settings page, which permanently removes your account and
        every subscription tied to it. There is no retention after deletion
        and no need to ask us first.
      </p>

      <h2 className={h2}>Children</h2>
      <p className={p}>
        SubHawk is not directed at children under 13, and we do not knowingly
        collect data from them.
      </p>

      <h2 className={h2}>Changes to this policy</h2>
      <p className={p}>
        If this policy changes, we will update this page and the date at the
        top. Meaningful changes will be visible here before they take effect.
      </p>

      <h2 className={h2}>Contact</h2>
      <p className={p}>
        Questions about this policy or your data? Reach us through the{" "}
        <Link href="/contact" className="text-accent hover:text-accent-hover">
          contact page
        </Link>
        .
      </p>

      <p className="mt-10 text-sm">
        <Link
          href="/"
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
