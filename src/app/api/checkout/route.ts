import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/src/lib/stripe';
import { createSupabaseServerClient } from '@/src/lib/auth';

export async function POST(req: NextRequest) {
  const { priceId } = await req.json();
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // Create a Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
    customer_email: user.email ?? undefined,
  });

  return NextResponse.json({ url: session.url });
}
