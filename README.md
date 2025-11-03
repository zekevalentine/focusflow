# Job Hunter FocusFlow — MVP Starter

An AI-powered job search & productivity assistant (MVP) built with Next.js (App Router), Supabase (Auth + DB), Stripe (billing), and OpenAI (AI features).

## Quick Start

1) **Create the project and install deps**
```bash
# Node 18+ recommended
npm create next-app@latest focusflow --typescript --eslint --src-dir --app --tailwind --use-npm
cd focusflow
# replace starter files with this bundle's src/ and config files
```

2) **Install dependencies**
```bash
npm install @supabase/supabase-js stripe openai zod date-fns lucide-react react-hook-form
```

3) **Copy files from this bundle**
Unzip and copy the `src/`, `supabase/`, `scripts/`, and config files into your repo. Review diffs.

4) **Create environment variables**
- Copy `.env.example` to `.env.local` and fill values.

5) **Supabase**
- Create a new Supabase project
- Run `supabase/schema.sql` in the SQL editor (or run via CLI)
- Add the **Anon** and **Service** keys to `.env.local`

6) **Stripe**
- Create products/prices that match `PRICING.md`
- Add webhook signing secret to `.env.local`
- Run the app and test the webhook at `/api/webhooks/stripe` using `stripe-cli`

7) **Run the dev server**
```bash
npm run dev
```

8) **Deploy**
- Vercel (set environment variables, add `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, etc.).
- Configure Supabase Auth redirect URLs for your Vercel domain.

## Folder Layout

```
src/
  app/
    (marketing)/page.tsx
    dashboard/page.tsx
    api/
      generate-cover-letter/route.ts
      interview-prep/route.ts
      daily-focus/route.ts
      jobs/route.ts
      webhooks/stripe/route.ts
  components/
    JobForm.tsx
    JobTable.tsx
    Header.tsx
    AuthGate.tsx
  lib/
    supabaseClient.ts
    stripe.ts
    auth.ts
    prompts.ts
    types.ts
supabase/
  schema.sql
PRICING.md
.env.example
```

## Notes

- This is a starter. Harden security, RLS policies, and error handling before production.
- Replace UI with your design system as you iterate.
- See inline TODOs for next steps.
