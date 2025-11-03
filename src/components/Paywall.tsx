'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import Link from 'next/link';

export default function Paywall({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setAllowed(false);
      const { data } = await supabase.from('profiles').select('plan').eq('id', user.id).maybeSingle();
      const plan = (data?.plan ?? 'free') as string;
      setAllowed(plan === 'pro' || plan === 'premium');
    })();
  }, []);

  if (allowed === null) return <div className="p-6">Loading…</div>;
  if (!allowed) return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-semibold">This feature needs Pro</h2>
      <p className="opacity-80">Upgrade to unlock AI and advanced tools.</p>
      <Link href="/subscribe" className="border px-4 py-2 rounded inline-block mt-3">See plans</Link>
    </div>
  );
  return <>{children}</>;
}
