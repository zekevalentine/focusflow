import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY as string);
const FROM = process.env.MARKETING_FROM_EMAIL as string;

const TEMPLATES: Record<number, {subject:string, html:(url:string)=>string}> = {
  1: { subject: 'Day 1: Set up your Kanban', html: (url)=> `<h2>Welcome to FocusFlow</h2><p>Start by adding 5 roles to your Kanban.</p><a href="${url}/dashboard/kanban">Open Kanban</a>` },
  3: { subject: 'Day 3: Tailor cover letters 5× faster', html: (url)=> `<h2>Cover Letters</h2><p>Paste your resume + JD, get a draft in seconds.</p><a href="${url}/dashboard/cover-letter">Try it</a>` },
  7: { subject: 'Day 7: Keep momentum with Daily Focus', html: (url)=> `<h2>Stay consistent</h2><p>Use Daily Focus to plan today.</p><a href="${url}/dashboard/focus">Open Daily Focus</a>` },
};

export async function POST(req: NextRequest) {
  const { email, step } = await req.json();
  if (!email || !TEMPLATES[step]) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  const tpl = TEMPLATES[step];
  await resend.emails.send({ from: FROM, to: email, subject: tpl.subject, html: tpl.html(process.env.NEXT_PUBLIC_APP_URL as string) });
  return NextResponse.json({ ok: true });
}
