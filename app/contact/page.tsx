import Link from "next/link";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact SubHawk",
};

export default function ContactPage() {
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
          Get in touch
        </h1>
        <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">
          Feedback, questions, or ideas. It all goes straight to me.
        </p>
        <ContactForm />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        <Link
          href="/"
          className="hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
