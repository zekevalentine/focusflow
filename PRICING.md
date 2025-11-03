# Pricing (MVP)

- **Free**: Job tracker, manual tasks, limited AI (10 prompts/month)
- **Pro** (100 NOK / month): AI cover letters, daily focus plan, unlimited job entries
- **Premium** (199 NOK / month): Interview coach, resume critique, priority queue

Create two recurring prices in Stripe and copy their `price_XXX` ids into env:
- `NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTH`
- `NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTH`
