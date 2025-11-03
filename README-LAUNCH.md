# FocusFlow — LAUNCH Pack (Integrated)

This pack adds:
- A conversion-optimized **landing page** at `/`
- **Pricing** section wired to Stripe Checkout
- **Newsletter signup** (Resend) and **welcome email**
- Onboarding email stubs: Day 1, Day 3, Day 7
- Win-back and Pro upsell email endpoints (manual/cron)
- **Product Hunt launch kit** (copy & assets)

## Setup
1) Install deps:
```bash
npm install resend
```
2) Add env vars to `.env.local`:
```
RESEND_API_KEY=
MARKETING_FROM_EMAIL="FocusFlow <hello@yourdomain.com>"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
3) Deploy + set env on Vercel too.
4) Update links/pricing copy as needed in `src/app/(marketing)/page.tsx`.

## Email usage (manual tester)
- POST `/api/marketing/newsletter` with `{ email }` to subscribe + send welcome.
- POST `/api/marketing/send-onboarding` with `{ email, step: 1|3|7 }`
- POST `/api/marketing/send-winback` with `{ email }`
- POST `/api/marketing/send-upsell` with `{ email }`
