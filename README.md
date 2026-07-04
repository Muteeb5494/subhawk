# SubHawk

A privacy-first subscription & free-trial tracker. Add subscriptions and trials
by hand and get an email before anything renews or a trial ends. **No bank
integration, no payment processing.**

Built with Next.js (App Router) + TypeScript + Tailwind CSS, Supabase (auth +
database), and Resend (reminder emails). Deploys to Vercel.

## Build stages

1. **Auth + protected dashboard** ✅ (done)
2. Add / edit / delete subscriptions
3. Total monthly spend, sorting, upcoming highlighting
4. Daily email-reminder cron (Vercel Cron + Resend)

## Local setup (Stage 1)

### 1. Create a Supabase project

1. Go to <https://supabase.com> → **New project**. Pick a name and a strong
   database password (you won't need it for this app).
2. Once it finishes provisioning, open **Project Settings → Data API** and copy
   the **Project URL**.
3. Open **Project Settings → API Keys** and copy the **anon / publishable** key.

### 2. Add environment variables

Copy the example file and fill in the two Supabase values:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

(The Resend / cron variables in the example are for Stage 4 — ignore them for now.)

### 3. Configure Auth URLs in Supabase

In **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000`
- **Redirect URLs:** add `http://localhost:3000/**`

For the smoothest first test you can **turn off email confirmation** under
**Authentication → Sign In / Providers → Email → "Confirm email"**. With it on,
sign-up sends a confirmation link (handled by `/auth/confirm`) that you must
click before logging in.

### 4. Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>, click **Get started**, create an account, and you
should land on the protected dashboard. Visiting `/dashboard` while logged out
redirects to `/login`.

## Architecture notes

- `lib/supabase/client.ts` — browser Supabase client.
- `lib/supabase/server.ts` — server client (Next.js 16 `await cookies()`).
- `proxy.ts` — Next.js 16's middleware (renamed **Proxy**). Refreshes the
  session on every request and guards `/dashboard`.
- `app/auth/actions.ts` — `login` / `signup` / `signout` server actions.
- `app/auth/confirm/route.ts` — email confirmation handler.
