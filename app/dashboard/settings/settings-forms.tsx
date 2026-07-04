"use client";

import { useActionState } from "react";
import {
  changePassword,
  deleteAccount,
  type SettingsState,
} from "./actions";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";
const labelClass =
  "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

function Feedback({ state }: { state: SettingsState }) {
  if (state?.error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
        {state.error}
      </p>
    );
  }
  if (state?.message) {
    return (
      <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-300">
        {state.message}
      </p>
    );
  }
  return null;
}

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    changePassword,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="password" className={labelClass}>
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="confirm" className={labelClass}>
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Repeat the new password"
          className={inputClass}
        />
      </div>
      <Feedback state={state} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    deleteAccount,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        This permanently deletes your account and every subscription you track.
        It cannot be undone.
      </p>
      <div>
        <label htmlFor="confirmation" className={labelClass}>
          Type <span className="font-semibold">DELETE</span> to confirm
        </label>
        <input
          id="confirmation"
          name="confirmation"
          type="text"
          required
          autoComplete="off"
          placeholder="DELETE"
          className={inputClass}
        />
      </div>
      <Feedback state={state} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {pending ? "Deleting…" : "Delete my account"}
      </button>
    </form>
  );
}
