# FocusFlow — SCALE Pack

Adds:
- **Stripe webhook sync**: price→plan mapping, updates `profiles.plan` & `subscriptions`
- **Kanban board** for job stages (drag & drop)
- **Analytics dashboard** with Chart.js
- Optional SQL **metrics view**

## Install
1) Copy these files over your codebase (after Plus pack).
2) Add dependency:
```bash
npm install chart.js
```
3) Ensure env has:
```
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTH=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTH=price_yyy
```
4) Deploy webhook route at `/api/webhooks/stripe` (replaces stub).
5) (Optional) Run `supabase/metrics_view.sql`.
