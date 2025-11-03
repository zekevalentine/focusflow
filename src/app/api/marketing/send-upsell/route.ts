import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY as string);
const FROM = process.env.MARKETING_FROM_EMAIL as string;

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  await resend.emails.send({
    from: FROM, to: email, subject: "Unlock AI interview prep + resume critique",
    html: `<p>Upgrade to Premium to get Interview Coach + Resume critique.</p><a href="${process.env.NEXT_PUBLIC_APP_URL}/subscribe">See plans</a>`
  });
  return NextResponse.json({ ok: true });
}
