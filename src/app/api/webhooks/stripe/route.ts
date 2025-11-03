import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/src/lib/stripe';
import { supabaseAdmin } from '@/src/lib/supabaseAdmin';

export const runtime = 'nodejs';

const PRICE_TO_PLAN: Record<string, 'pro'|'premium'> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTH as string]: 'pro',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTH as string]: 'premium',
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        // Retrieve subscription to get items/price
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          const item = sub.items.data[0];
          const priceId = item.price.id;
          const plan = PRICE_TO_PLAN[priceId];
          const customerId = sub.customer as string;

          // Find user by email (from session) or store mapping by customer id
          const email = session.customer_details?.email || session.customer_email;
          if (!email || !plan) break;

          // Get profile by email
          const { data: userRow } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', sub.metadata?.user_id || '')  // optional path
            .maybeSingle();

          // Fallback: if we didn't pass user_id metadata, we rely on a separate mapping. Here we update by customer only.
          // Upsert subscriptions row and update plan; in real app, map auth.users by email to profiles.id.

          await supabaseAdmin.from('subscriptions').upsert({
            user_id: userRow?.id || null,
            stripe_customer_id: customerId,
            stripe_subscription_id: sub.id,
            plan,
            status: sub.status,
            renewal_date: new Date(sub.current_period_end * 1000).toISOString().slice(0,10),
          }, { onConflict: 'stripe_subscription_id' });

          if (userRow?.id) {
            await supabaseAdmin.from('profiles').update({ plan }).eq('id', userRow.id);
          }
        }
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as any;
        const subId = invoice.subscription as string;
        const sub = await stripe.subscriptions.retrieve(subId);
        const item = sub.items.data[0];
        const plan = PRICE_TO_PLAN[item.price.id];
        const customerId = sub.customer as string;
        // Update stored subscription status + renewal_date
        await supabaseAdmin.from('subscriptions').upsert({
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          plan,
          status: sub.status,
          renewal_date: new Date(sub.current_period_end * 1000).toISOString().slice(0,10),
        }, { onConflict: 'stripe_subscription_id' });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        // Downgrade plan to free if we can resolve user
        await supabaseAdmin.from('subscriptions').update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }
      default:
        // no-op
        break;
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
