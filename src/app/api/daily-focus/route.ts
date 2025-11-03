import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DAILY_FOCUS_PROMPT } from '@/src/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { metrics } = await req.json();
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = DAILY_FOCUS_PROMPT(metrics);

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    const text = completion.choices[0]?.message?.content ?? '';
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
