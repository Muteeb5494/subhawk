import Link from "next/link";
import { AuthForm } from "./auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Link
        href="/"
        className="mb-8 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
      >
        Sub<span className="text-accent">Hawk</span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <AuthForm initialError={error} />
      </div>
    </main>
  );
}
