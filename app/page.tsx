import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
                  className="rounded-lg bg-accent px-4 py-2 text-white transition hover:bg-accent-hover"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <span className="mb-6 inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Privacy-first · No bank login required
        </span>
        <h1 className="max-w-2xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-100">
          Never get charged by surprise again
        </h1>
        <p className="mt-6 max-w-md text-lg text-slate-600 dark:text-slate-400">
          Track every subscription and free trial. No bank details required.
        </p>
        <div className="mt-10">
          <Link
            href="/login"
            className="inline-block rounded-lg bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-hover"
          >
            Start tracking for free
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
        © {new Date().getFullYear()} SubHawk
      </footer>
    </div>
  );
}
