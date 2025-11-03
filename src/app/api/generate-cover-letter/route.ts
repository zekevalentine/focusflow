import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { COVER_LETTER_PROMPT } from '@/src/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { resume, job } = await req.json();
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = COVER_LETTER_PROMPT(resume, job);

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content ?? '';
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
