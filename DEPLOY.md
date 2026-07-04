# Deploying SubHawk to Vercel (CLI)

The daily reminder cron only runs on a deployed **production** Vercel project,
so this is the final step to make reminders fire automatically.

## 1. Log in to Vercel

In your terminal, from the project folder (`/Users/muteeb/Site`):

```bash
npx vercel login
```

Pick "Continue with Email" (or GitHub/Google), enter your email, and click the
verification link Vercel emails you. (Creates a free Vercel account if you don't
have one.)

## 2. First deploy (creates the project)

```bash
npx vercel
```

Answer the prompts:

- **Set up and deploy?** → `y`
- **Which scope?** → your personal account
- **Link to existing project?** → `n`
- **Project name?** → `subhawk` (lowercase)
- **In which directory is your code located?** → press Enter (`./`)
- **Want to modify these settings?** → `n` (it auto-detects Next.js)

This creates the project and a preview deployment. The `.env.local` file is
**not** uploaded (it's gitignored and Vercel skips it), which is why we add the
variables in the next step.

## 3. Add environment variables

Go to **vercel.com → your `subhawk` project → Settings → Environment
Variables** and add all six. For each, tick **Production, Preview, and
Development**:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR-PROJECT-ref.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_…` (your anon key) |
| `RESEND_API_KEY` | `re_…` (your Resend key) |
| `REMINDER_FROM_EMAIL` | `onboarding@resend.dev` |
| `CRON_SECRET` | a long random string, e.g. output of `openssl rand -hex 32` |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_…` (your service-role key) |

Setting `CRON_SECRET` here is what lets Vercel Cron authenticate to the reminder
endpoint — Vercel automatically sends it as a Bearer token.

## 4. Deploy to production

```bash
npx vercel --prod
```

Copy the production URL it prints, e.g. `https://subhawk-xxx.vercel.app`.

## 5. Point Supabase Auth at the production URL

In Supabase → **Authentication → URL Configuration**:

- **Site URL:** `https://subhawk-xxx.vercel.app`
- **Redirect URLs:** add `https://subhawk-xxx.vercel.app/**`

(Without this, sign-up confirmation links would still point at localhost.)

## 6. Verify the cron is scheduled

Vercel → project → **Settings → Cron Jobs**. You should see
`/api/cron/reminders` scheduled for `0 13 * * *` (13:00 UTC daily). You can
change the time by editing `vercel.json` and redeploying.

### Test the deployed cron manually

```bash
curl -i https://subhawk-xxx.vercel.app/api/cron/reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Expect `{"ok":true,...}`. Without the header it returns 401 — that's correct.

## 7. Connect the domain (subhawk.io)

Do this after the production deploy exists.

### Buy + attach
- **Easiest (one place):** Vercel → project → **Settings → Domains** → type
  `subhawk.io` → if Vercel offers it for purchase, buy it there. DNS is
  configured automatically.
- **Buy elsewhere (Porkbun / Namecheap, often cheaper):** register `subhawk.io`,
  then in Vercel → Settings → Domains → **Add** `subhawk.io`. Vercel shows the
  exact DNS records to create at your registrar — typically:
  - `A` record, host `@` → `76.76.21.21`
  - `CNAME` record, host `www` → `cname.vercel-dns.com`
  (Or point the registrar's nameservers to Vercel if you prefer.)

### www + SSL
- Add both `subhawk.io` and `www.subhawk.io` in Vercel. Pick one as primary;
  Vercel auto-redirects the other and issues HTTPS certificates for free.

### Point Supabase at the real domain
In Supabase → **Authentication → URL Configuration**:
- **Site URL:** `https://subhawk.io` (or `https://www.subhawk.io`, matching your primary)
- **Redirect URLs:** add `https://subhawk.io/**` and `https://www.subhawk.io/**`

## Going to production for real (later)

- **Verify a domain in Resend** (you can use `subhawk.io`) and change
  `REMINDER_FROM_EMAIL` to an address on it, e.g. `reminders@subhawk.io`. Until
  then, Resend only delivers to your own account email.
