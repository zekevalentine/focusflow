import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY as string);
const FROM = process.env.MARKETING_FROM_EMAIL as string;

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  await resend.emails.send({
    from: FROM, to: email, subject: "We saved your seat 👋",
    html: `<p>Haven’t seen you in a bit. Your Kanban is waiting.</p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/kanban">Resume</a>`
  });
  return NextResponse.json({ ok: true });
}
