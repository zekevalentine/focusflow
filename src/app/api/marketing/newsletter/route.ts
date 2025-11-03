import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);
const FROM = process.env.MARKETING_FROM_EMAIL as string;

export async function POST(req: NextRequest) {
  let email = '';
  const type = req.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    const body = await req.json();
    email = (body?.email || '').toString();
  } else {
    const form = await req.formData();
    email = (form.get('email') || '').toString();
  }
  if (!email) return NextResponse.redirect(new URL('/?sub=error', process.env.NEXT_PUBLIC_APP_URL));

  // Send welcome email
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to Job Hunter FocusFlow 👋",
      html: `<h2>Welcome!</h2><p>You're in. Expect short, practical tips to speed up your job hunt.</p><p>Open the app: <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">${process.env.NEXT_PUBLIC_APP_URL}/dashboard</a></p>`,
    });
  } catch (e) {
    // ignore send failures for now
  }
  // In a real app, store the subscriber in DB or an ESP list.
  return NextResponse.redirect(new URL('/?sub=ok', process.env.NEXT_PUBLIC_APP_URL));
}
