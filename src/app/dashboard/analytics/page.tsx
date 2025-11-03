'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import Chart from 'chart.js/auto';
import AuthGate from '@/src/components/AuthGate';

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const appsRef = useRef<HTMLCanvasElement>(null);
  const convRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: jobs } = await supabase.from('job_applications').select('status, created_at').order('created_at');
      const total = jobs?.length || 0;
      const byStatus = (jobs || []).reduce((acc:any, j:any)=>{ acc[j.status]=(acc[j.status]||0)+1; return acc;}, {});
      const applied = byStatus['applied']||0;
      const interview = byStatus['interview']||0;
      const offer = byStatus['offer']||0;
      const interviewRate = total ? (interview / total) : 0;
      const offerRate = interview ? (offer / interview) : 0;
      setStats({ total, byStatus, interviewRate, offerRate });

      // Chart 1: Applications by status
      if (appsRef.current) {
        new Chart(appsRef.current, {
          type: 'bar',
          data: {
            labels: Object.keys(byStatus),
            datasets: [{ label: 'Count', data: Object.values(byStatus) as number[] }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }
      // Chart 2: Conversion funnel
      if (convRef.current) {
        new Chart(convRef.current, {
          type: 'bar',
          data: {
            labels: ['Applied→Interview', 'Interview→Offer'],
            datasets: [{ label: 'Rate', data: [interviewRate*100, offerRate*100] }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { ticks: { callback: (v:any)=> v + '%' }, suggestedMax: 100 } }
          }
        });
      }
    })();
  }, []);

  return (
    <AuthGate>
      <main className="max-w-6xl mx-auto p-6 grid gap-6">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded p-4">
              <div className="text-xs opacity-80">Total applications</div>
              <div className="text-2xl font-semibold">{stats.total}</div>
            </div>
            <div className="border rounded p-4">
              <div className="text-xs opacity-80">Interview rate</div>
              <div className="text-2xl font-semibold">{(stats.interviewRate*100).toFixed(0)}%</div>
            </div>
            <div className="border rounded p-4">
              <div className="text-xs opacity-80">Offer rate</div>
              <div className="text-2xl font-semibold">{(stats.offerRate*100).toFixed(0)}%</div>
            </div>
          </div>
        ) : <div>Loading…</div>}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded p-4 h-[300px]">
            <h2 className="font-semibold mb-2">Applications by status</h2>
            <canvas ref={appsRef} className="w-full h-full"></canvas>
          </div>
          <div className="border rounded p-4 h-[300px]">
            <h2 className="font-semibold mb-2">Conversion</h2>
            <canvas ref={convRef} className="w-full h-full"></canvas>
          </div>
        </section>
      </main>
    </AuthGate>
  );
}
