import Link from "next/link";

export const metadata = {
  title: "SubHawk terms of service",
};

const h2 = "mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100";
const p = "mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
      <Link
        href="/"
        className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
      >
        Sub<span className="text-accent">Hawk</span>
      </Link>
      <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Terms of service
      </h1>
      <p className={p}>Last updated: July 4, 2026</p>

      <h2 className={h2}>The agreement</h2>
      <p className={p}>
        By creating an account or using SubHawk (subhawk.io), you agree to
        these terms. If you do not agree with them, please do not use the
        service.
      </p>

      <h2 className={h2}>The service</h2>
      <p className={p}>
        SubHawk is a free tool for tracking subscriptions and free trials that
        you enter yourself, and for receiving email reminders before renewal
        and trial dates. SubHawk does not connect to financial accounts, does
        not process payments, and does not cancel or manage subscriptions on
        your behalf.
      </p>

      <h2 className={h2}>Your account</h2>
      <p className={p}>
        You are responsible for the accuracy of the email address on your
        account and for keeping your login credentials safe. You can delete
        your account at any time from the settings page, which permanently
        removes your data.
      </p>

      <h2 className={h2}>Reminders are a convenience, not a guarantee</h2>
      <p className={p}>
        This part matters, so plainly: SubHawk sends reminders on a best
        effort basis. Email can be delayed, filtered to spam, or fail to
        deliver for reasons outside our control, and reminders depend on the
        dates you enter being correct. You remain responsible for your own
        subscriptions and their charges. SubHawk is not liable for any charge,
        fee, renewal, or loss that occurs because a reminder was late, missed,
        filtered, or based on inaccurate information.
      </p>

      <h2 className={h2}>Acceptable use</h2>
      <p className={p}>
        Do not misuse the service: no attempts to access other users&apos;
        data, probe or disrupt the infrastructure, send spam through any part
        of the service, or use SubHawk for anything unlawful. We may suspend
        or remove accounts that do.
      </p>

      <h2 className={h2}>The service is provided as is</h2>
      <p className={p}>
        SubHawk is provided as is and as available, without warranties of any
        kind, express or implied. We do not guarantee the service will be
        uninterrupted, error free, or available at any particular time. To the
        maximum extent permitted by law, our total liability for any claim
        related to the service is limited to the amount you paid to use it,
        which for a free service is zero.
      </p>

      <h2 className={h2}>Changes</h2>
      <p className={p}>
        SubHawk is actively developed, so features may change, improve, or be
        removed. If these terms change meaningfully, we will update this page
        and the date at the top before the changes take effect.
      </p>

      <h2 className={h2}>Governing law</h2>
      <p className={p}>
        These terms are governed by the laws of the State of New York, United
        States.
      </p>

      <h2 className={h2}>Contact</h2>
      <p className={p}>
        Questions about these terms? Reach us through the{" "}
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
