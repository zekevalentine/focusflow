'use client';
import { supabase } from '@/src/lib/supabaseClient';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  if (!ready) return <div className="p-6">Loading…</div>;
  if (!authed) return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-2">You need to sign in</h2>
      <p className="mb-4">Create an account to use the dashboard.</p>
      <Link href="/sign-in" className="border px-4 py-2 rounded inline-block">Sign in</Link>
    </div>
  );
  return <>{children}</>;
}
