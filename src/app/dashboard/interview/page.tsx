'use client';
import { useState } from 'react';
import Paywall from '@/src/components/Paywall';

export default function InterviewCoach() {
  const [role, setRole] = useState('Frontend Developer');
  const [jd, setJd] = useState('');
  const [out, setOut] = useState('');
  const [loading, setLoading] = useState(false);

  const gen = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, jobDescription: jd })
      });
      const data = await res.json();
      if (data.text) setOut(data.text);
      else alert(data.error || 'Failed.');
    } finally { setLoading(false); }
  };

  return (
    <Paywall>
      <main className="max-w-5xl mx-auto p-6 grid gap-4">
        <h1 className="text-2xl font-semibold">Interview Coach</h1>
        <input className="border p-2 rounded" placeholder="Role title" value={role} onChange={e=>setRole(e.target.value)} />
        <textarea className="border p-2 rounded min-h-[120px]" placeholder="Paste the job description"
          value={jd} onChange={e=>setJd(e.target.value)} />
        <button className="border px-4 py-2 rounded w-fit" disabled={loading} onClick={gen}>
          {loading ? 'Generating…' : 'Generate questions & guidance'}
        </button>
        {out && <div className="border rounded p-4 whitespace-pre-wrap">{out}</div>}
      </main>
    </Paywall>
  );
}
