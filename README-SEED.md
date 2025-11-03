
# FocusFlow — Seed Data

This pack lets you populate your local/dev database with **example users, jobs, plans, and subscriptions** so the UI looks alive immediately.

## Option A — One‑click SQL (Supabase SQL Editor)

1) Open your Supabase project → **SQL Editor**.
2) Paste the contents of `supabase/seed.sql` and run.
3) Sign in with the magic link to any of the inserted emails (or use your own user; the `profiles` rows are created for you).

> NOTE: Replace the placeholder user UUIDs with your own auth user ID if you want the data tied to your account. (See instructions inside the SQL file.)

## Option B — Node script (uses service role key)

1) Install deps in your app:
```bash
npm install @supabase/supabase-js
```
2) Copy `scripts/seed.ts` into your repo.
3) Set env vars in a `.env.local` or export before running:
```
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SEED_USER_EMAIL=you@example.com   # will attach data to this auth user if found
```
4) Run:
```bash
npx tsx scripts/seed.ts
# or: node --loader ts-node/esm scripts/seed.ts
```

You’ll get:
- 10 sample job applications across all statuses
- Today’s Daily Focus plan
- Sample AI logs (cover letter, interview prep)
- A sample subscription row (Pro)
