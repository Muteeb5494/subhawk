import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const card =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-1 hover:border-accent dark:hover:border-accent";
const cta =
  "inline-block rounded-lg bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-hover motion-safe:hover:-translate-y-px";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between py-4 pl-4 pr-16">
          <span className="text-lg font-bold tracking-tight">
            Sub<span className="text-accent">Hawk</span>
          </span>
          <nav className="flex items-center gap-3 text-sm font-medium">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-accent px-4 py-2 text-white transition hover:bg-accent-hover"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg bg-accent px-4 py-2 text-white transition hover:bg-accent-hover motion-safe:hover:-translate-y-px"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center px-4 pb-4 pt-20 text-center">
          <span className="mb-6 inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Privacy-first · No bank login required
          </span>
          <h1 className="max-w-2xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-100">
            Never get charged by surprise again
          </h1>
          <p className="mt-6 max-w-md text-lg text-slate-600 dark:text-slate-400">
            Track every subscription and free trial. Get an email before
            anything renews.
          </p>
          <div className="mt-10">
            <Link href="/login" className={cta}>
              Start tracking for free
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            Free. No credit card required.
          </p>
        </section>

        {/* Product preview */}
        <section className="mx-auto mt-10 w-full max-w-lg px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Estimated monthly spend
                </p>
                <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  $114.45
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Estimated yearly spend
                </p>
                <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  $1,373.40
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-2" aria-label="Example subscriptions">
              <li className="flex items-center justify-between rounded-xl border border-red-300 px-3 py-2.5 ring-1 ring-red-200 dark:border-red-500/40 dark:ring-red-500/20 motion-safe:transition motion-safe:hover:-translate-y-0.5">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  YouTube Premium{" "}
                  <span className="font-normal text-slate-500 dark:text-slate-400">
                    $13.99
                  </span>
                </span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
                  Renews today
                </span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-amber-300 px-3 py-2.5 ring-1 ring-amber-200 dark:border-amber-500/40 dark:ring-amber-500/20 motion-safe:transition motion-safe:hover:-translate-y-0.5">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Disney+{" "}
                  <span className="font-normal text-slate-500 dark:text-slate-400">
                    Free trial
                  </span>
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
                  Trial ends in 3 days
                </span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800 motion-safe:transition motion-safe:hover:-translate-y-0.5">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Netflix{" "}
                  <span className="font-normal text-slate-500 dark:text-slate-400">
                    $15.49
                  </span>
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Renews in 12 days
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-3xl px-4 pt-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            How it works
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className={card}>
              <PlusIcon />
              <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
                Add your subscriptions
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Name, price, and renewal date. About 30 seconds each.
              </p>
            </div>
            <div className={card}>
              <CalendarIcon />
              <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
                We watch the dates
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Every renewal and trial deadline, tracked for you.
              </p>
            </div>
            <div className={card}>
              <BellIcon />
              <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
                Get alerted before you pay
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                An email a week ahead and again the day before.
              </p>
            </div>
          </div>
        </section>

        {/* Why SubHawk is different */}
        <section className="mx-auto max-w-3xl px-4 pt-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Why SubHawk is different
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Other trackers want your bank login or inbox access. We ask for
            neither.
          </p>
          <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
            <div className={card}>
              <BankIcon />
              <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
                No bank linking
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                We never ask for a bank login or card number.
              </p>
            </div>
            <div className={card}>
              <MailOffIcon />
              <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
                No inbox scanning
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                We do not read your email to detect subscriptions.
              </p>
            </div>
            <div className={card}>
              <DownloadIcon />
              <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
                Your data is yours
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Export everything as a CSV or delete your account anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-4 py-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Know what you pay before you pay it
          </h2>
          <div className="mt-6">
            <Link href="/login" className={cta}>
              Start tracking for free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
        © {new Date().getFullYear()} SubHawk
        <span className="mx-2">·</span>
        <Link
          href="/contact"
          className="transition hover:text-slate-600 dark:hover:text-slate-300"
        >
          Contact
        </Link>
        <span className="mx-2">·</span>
        <Link
          href="/privacy"
          className="transition hover:text-slate-600 dark:hover:text-slate-300"
        >
          Privacy
        </Link>
        <span className="mx-2">·</span>
        <Link
          href="/terms"
          className="transition hover:text-slate-600 dark:hover:text-slate-300"
        >
          Terms
        </Link>
      </footer>
    </div>
  );
}

function iconProps() {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "text-accent dark:text-indigo-400",
    "aria-hidden": true,
  };
}

function PlusIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 21h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7" />
      <path d="M12 3 3 8h18z" />
    </svg>
  );
}

function MailOffIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M9 5h11a2 2 0 0 1 2 2v10m-2 2H4a2 2 0 0 1-2-2V7" />
      <path d="m3 7 9 6 3.5-2.33" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 4v12M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}
