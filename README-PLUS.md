# FocusFlow — PLUS Pack

Adds:
- Stripe **Customer Portal** (self-serve manage/cancel)
- **Interview Coach** UI
- **Save Job via API key** endpoint
- **Admin Supabase client** for secure server-side ops
- SQL patch to add `profiles.api_key`
- **Chrome Extension (MV3)** to save jobs from LinkedIn/Indeed/etc.

## Apply
1) Copy these files into your codebase (on top of the Extended pack).
2) Run SQL patch in Supabase: `supabase/alter_api_key.sql`
3) Set new env var in `.env.local`:
```
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_CUSTOMER_PORTAL_URL(optional)=  # if using hosted portal config; else we create sessions
```
4) In your **Account** page, click **Generate API key** and paste it into the extension Options.
5) Load the extension (`focusflow-extension/`) in Chrome: `chrome://extensions` → Developer mode → Load unpacked.
