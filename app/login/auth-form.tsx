"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { login, signup, type AuthState } from "@/app/auth/actions";

export function AuthForm({ initialError }: { initialError?: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex rounded-lg bg-slate-100 p-1 text-sm font-medium dark:bg-slate-800">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-md py-2 transition ${
            mode === "login"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-md py-2 transition ${
            mode === "signup"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Sign up
        </button>
      </div>

      {/* Keyed by mode so switching tabs remounts and clears any prior message. */}
      <CredentialsForm
        key={mode}
        mode={mode}
        initialError={mode === "login" ? initialError : undefined}
      />

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link
          href="/"
          className="hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Back to home
        </Link>
      </p>
    </div>
  );
}

function CredentialsForm({
  mode,
  initialError,
}: {
  mode: "login" | "signup";
  initialError?: string;
}) {
  const action = mode === "login" ? login : signup;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    initialError ? { error: initialError } : undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:text-slate-100"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={mode === "signup" ? 8 : undefined}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:text-slate-100"
          placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {state.error}
        </p>
      )}
      {state?.message && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-300">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-4 py-2.5 font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
      >
        {pending
          ? "Please wait…"
          : mode === "login"
            ? "Log in"
            : "Create account"}
      </button>
    </form>
  );
}
