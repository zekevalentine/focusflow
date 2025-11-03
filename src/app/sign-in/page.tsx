'use client';
import { useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const sendLink = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` }
    });
    if (error) alert(error.message);
    else setSent(true);
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-sm opacity-80 mb-4">We’ll email you a magic link.</p>
      {sent ? (
        <p>Magic link sent. Check your inbox.</p>
      ) : (
        <form onSubmit={sendLink} className="space-y-3">
          <input className="border p-2 rounded w-full" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <button className="border px-4 py-2 rounded" type="submit">Send link</button>
        </form>
      )}
    </main>
  );
}
