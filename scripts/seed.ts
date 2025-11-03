
import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const email = process.env.SEED_USER_EMAIL || '';

if (!url || !service) {
  throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env');
}

const supabase = createClient(url, service);

async function main() {
  let userId: string | null = null;

  if (email) {
    // Try to find auth user by email via auth schema; this requires an rpc or admin API in real setup.
    // Here we assume you know your auth user id; else insert into profiles only.
    console.warn('NOTE: Attach to your user by updating profiles.id with your auth user id.');
  }

  // Create (or update) a profile row (replace with your auth user id if known)
  const { data: profile } = await supabase
    .from('profiles')
    .upsert({ id: '11111111-1111-1111-1111-111111111111', name: 'Demo User One', country: 'NO', plan: 'pro' })
    .select()
    .maybeSingle();

  const uid = profile?.id || '11111111-1111-1111-1111-111111111111';

  // Insert jobs
  const jobs = [
    { company_name: 'Telenor', position_title: 'Frontend Developer', status: 'wishlist', job_url: 'https://careers.example/telenor-fe', notes: 'Looks interesting', ai_score: 72 },
    { company_name: 'Kahoot!', position_title: 'Product Designer', status: 'applied', job_url: 'https://jobs.example/kahoot-design', notes: 'Submitted tailored cover letter', ai_score: 68 },
    { company_name: 'Vipps', position_title: 'Full-Stack Engineer', status: 'interview', job_url: 'https://vipps.example/fullstack', notes: 'Phone screen done; next: tech round', ai_score: 74 },
    { company_name: 'FINN.no', position_title: 'React Engineer', status: 'rejected', job_url: 'https://finn.example/react', notes: 'Rejected after resume screen', ai_score: 55 },
    { company_name: 'Oda', position_title: 'Mobile Engineer', status: 'offer', job_url: 'https://oda.example/mobile', notes: 'Offer pending', ai_score: 81 },
  ];

  await supabase.from('job_applications').insert(
    jobs.map(j => ({ ...j, user_id: uid, date_applied: new Date().toISOString().slice(0,10) }))
  );

  await supabase.from('daily_plans').upsert({
    user_id: uid,
    date: new Date().toISOString().slice(0,10),
    tasks: [
      { title: 'Apply to 2 roles', priority: 1 },
      { title: 'Reach out to 1 hiring manager', priority: 2 },
      { title: 'Practice 30m system design', priority: 3 },
    ],
    ai_suggestion: 'Focus: 2 targeted applications, 1 warm intro, 30m interview prep.',
    focus_score: null
  }, { onConflict: 'user_id,date' });

  await supabase.from('ai_logs').insert([
    { user_id: uid, type: 'cover_letter', input_data: { company: 'Kahoot!', role: 'Product Designer' }, output_text: 'Tailored cover letter draft...', tokens_used: 1200 },
    { user_id: uid, type: 'interview_prep', input_data: { role: 'Frontend Developer' }, output_text: '8 targeted questions + guidance...', tokens_used: 900 },
  ]);

  await supabase.from('subscriptions').upsert({
    user_id: uid, plan: 'pro', status: 'active', renewal_date: new Date(Date.now()+1000*60*60*24*20).toISOString().slice(0,10)
  });

  console.log('Seed complete. Update profile id to your real auth.user id for best results.');
}

main().catch(err => { console.error(err); process.exit(1); });
