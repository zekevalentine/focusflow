'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import type { Job } from '@/src/lib/types';
import AuthGate from '@/src/components/AuthGate';

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const load = async () => {
    const { data, error } = await supabase.from('job_applications').select('*').order('created_at', { ascending: false });
    if (!error && data) setJobs(data as Job[]);
  };

  useEffect(() => { load(); }, []);

  return (
    <AuthGate>
      <main className="max-w-5xl mx-auto py-8 px-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="opacity-80">Track your job applications. AI tools live in the nav.</p>
        {/* Lazy-import forms from the starter after you copy files over */}
      </main>
    </AuthGate>
  );
}
