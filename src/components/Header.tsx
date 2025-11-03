'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';

export default function Header() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); location.href = '/'; };

  return (
    <header className="border-b py-3">
      <nav className="max-w-6xl mx-auto px-6 flex gap-4 items-center">
        <Link href="/" className="font-semibold">FocusFlow</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/kanban">Kanban</Link>
        <Link href="/dashboard/cover-letter">Cover Letter</Link>
        <Link href="/dashboard/interview">Interview</Link>
        <Link href="/dashboard/focus">Daily Focus</Link>
        <Link href="/dashboard/analytics">Analytics</Link>
        <div className="ml-auto flex gap-3 items-center">
          {email ? (
            <>
              <Link href="/account" className="text-sm opacity-80">{email}</Link>
              <button onClick={signOut} className="border px-3 py-1 rounded text-sm">Sign out</button>
            </>
          ) : (
            <Link href="/sign-in" className="border px-3 py-1 rounded text-sm">Sign in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
