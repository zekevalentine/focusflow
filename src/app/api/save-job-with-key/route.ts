import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-api-key');
  if (!key) return NextResponse.json({ error: 'Missing API key' }, { status: 401 });

  const { data: profile } = await supabaseAdmin.from('profiles').select('id').eq('api_key', key).maybeSingle();
  if (!profile?.id) return NextResponse.json({ error: 'Invalid API key' }, { status: 403 });

  const body = await req.json();
  const { company_name, position_title, job_url } = body || {};
  if (!company_name || !position_title) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { data, error } = await supabaseAdmin.from('job_applications').insert({
    user_id: profile.id,
    company_name,
    position_title,
    status: 'wishlist',
    job_url
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
