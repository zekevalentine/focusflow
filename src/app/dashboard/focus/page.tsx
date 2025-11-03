'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Paywall from '@/src/components/Paywall';
import { supabase } from '@/src/lib/supabaseClient';

type Task = { title: string; completed?: boolean; priority?: number };
export default function FocusPage() {
  const [metrics, setMetrics] = useState('applications_last_7: 10\ninterviews: 2\nreplies: 3');
  const [suggestion, setSuggestion] = useState('');
  const [tasks, setTasks] = useState<Task[]>([{ title: 'Apply to 2 roles', priority: 1 }]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestion = useCallback(async (input: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/daily-focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: input })
      });
      const data = await res.json();
      if (data.text) setSuggestion(data.text);
      else alert(data.error || 'Failed.');
    } finally { setLoading(false); }
  }, []);

  const gen = useCallback(() => {
    void fetchSuggestion(metrics);
  }, [fetchSuggestion, metrics]);

  const hasGeneratedInitialPlan = useRef(false);

  const savePlan = async () => {
    const today = new Date().toISOString().slice(0,10);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Not signed in');
    const { error } = await supabase.from('daily_plans').upsert({
      user_id: user.id,
      date: today,
      tasks,
      ai_suggestion: suggestion,
      focus_score: null
    }, { onConflict: 'user_id,date' });
    if (error) alert(error.message); else alert('Saved');
  };

  useEffect(() => {
    if (hasGeneratedInitialPlan.current) return;
    hasGeneratedInitialPlan.current = true;
    void fetchSuggestion(metrics);
  }, [fetchSuggestion, metrics]);

  return (
    <Paywall>
      <main className="max-w-5xl mx-auto p-6 grid gap-4">
        <h1 className="text-2xl font-semibold">Daily Focus</h1>
        <textarea className="border p-2 rounded min-h-[100px]" value={metrics}
          onChange={e=>setMetrics(e.target.value)} />
        <button className="border px-4 py-2 rounded w-fit" disabled={loading} onClick={gen}>
          {loading ? 'Generating…' : 'Suggest Plan'}
        </button>
        {suggestion && <pre className="border rounded p-3 whitespace-pre-wrap">{suggestion}</pre>}

        <h2 className="text-xl font-semibold mt-4">Your Tasks</h2>
        {tasks.map((t, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input className="border p-2 rounded flex-1" value={t.title} onChange={e=>{
              const copy = [...tasks]; copy[i].title = e.target.value; setTasks(copy);
            }} />
            <button className="border px-3 py-1 rounded" onClick={()=>{
              const copy = tasks.filter((_, idx)=> idx!==i); setTasks(copy);
            }}>Remove</button>
          </div>
        ))}
        <button className="border px-3 py-1 rounded w-fit" onClick={()=>setTasks([...tasks, { title: 'New task' }])}>Add task</button>
        <button className="border px-4 py-2 rounded w-fit" onClick={savePlan}>Save today&apos;s plan</button>
      </main>
    </Paywall>
  );
}
