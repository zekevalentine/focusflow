'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';

type Profile = { id: string; plan: string | null; api_key: string | null; };

export default function Account() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [busyKey, setBusyKey] = useState(false);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('profiles').select('id, plan, api_key').eq('id', user.id).maybeSingle();
    setProfile(data as Profile | null);
  };

  useEffect(() => { load(); }, []);

  const openPortal = async () => {
    try {
      setLoadingPortal(true);
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Could not open portal');
    } finally { setLoadingPortal(false); }
  };

  const genKey = async () => {
    setBusyKey(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // Generate on client then save; for real apps do this server-side.
    const newKey = crypto.randomUUID();
    const { error } = await supabase.from('profiles').update({ api_key: newKey }).eq('id', user.id);
    if (error) alert(error.message); else await load();
    setBusyKey(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Account</h1>
      <p>Your current plan: <strong>{profile?.plan ?? 'free'}</strong></p>

      <div className="mt-4 flex gap-3">
        <button onClick={openPortal} disabled={loadingPortal} className="border px-4 py-2 rounded">
          {loadingPortal ? 'Opening…' : 'Manage subscription'}
        </button>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">API Key (for Chrome Extension)</h2>
        <p className="opacity-80">Use this to save jobs from LinkedIn/Indeed directly to your dashboard.</p>
        <div className="mt-2 border rounded p-3">
          <div className="flex items-center gap-2">
            <code className="text-sm break-all">{profile?.api_key ?? 'No key yet'}</code>
            <button onClick={genKey} disabled={busyKey} className="border px-3 py-1 rounded ml-auto">
              {busyKey ? 'Saving…' : (profile?.api_key ? 'Regenerate' : 'Generate')}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
