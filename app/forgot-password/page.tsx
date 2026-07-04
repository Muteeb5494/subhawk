import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-form";

export const metadata = {
  title: "Reset your SubHawk password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Link
        href="/"
        className="mb-8 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
      >
        Sub<span className="text-accent">Hawk</span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Forgot your password?
        </h1>
        <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">
          Enter your email and we&apos;ll send you a link to set a new one.
        </p>
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        <Link
          href="/login"
          className="hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Back to log in
        </Link>
      </p>
    </main>
  );
}
