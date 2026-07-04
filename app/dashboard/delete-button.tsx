"use client";

import { deleteSubscription } from "./actions";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteSubscription}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-red-500/10"
      >
        Delete
      </button>
    </form>
  );
}
