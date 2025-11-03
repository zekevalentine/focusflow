'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import type { Job } from '@/src/lib/types';
import AuthGate from '@/src/components/AuthGate';

const STATUSES: Job['status'][] = ['wishlist','applied','interview','offer','rejected'];

export default function Kanban() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const load = async () => {
    const { data } = await supabase.from('job_applications').select('*');
    setJobs((data || []) as Job[]);
  };

  useEffect(()=>{ load(); }, []);

  const onDrop = async (jobId: string, newStatus: Job['status']) => {
    await supabase.from('job_applications').update({ status: newStatus }).eq('id', jobId);
    await load();
  };

  return (
    <AuthGate>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Kanban</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STATUSES.map(s => (
            <Column key={s} status={s}
              items={jobs.filter(j => j.status === s)}
              onDrop={onDrop} />
          ))}
        </div>
      </main>
    </AuthGate>
  );
}

function Column({ status, items, onDrop }:{ status: Job['status']; items: Job[]; onDrop:(id:string,s:Job['status'])=>void }){
  const handleDragOver = (e:any)=> e.preventDefault();
  const handleDrop = (e:any)=> {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    onDrop(id, status);
  };

  return (
    <div className="border rounded p-2 min-h-[300px]" onDragOver={handleDragOver} onDrop={handleDrop}>
      <h2 className="font-semibold capitalize mb-2">{status}</h2>
      <div className="space-y-2">
        {items.map(item => <Card key={item.id} job={item} />)}
      </div>
    </div>
  );
}

function Card({ job }:{ job: Job }){
  const onDragStart = (e:any)=> e.dataTransfer.setData('text/plain', job.id);
  return (
    <div draggable onDragStart={onDragStart} className="border rounded p-2 bg-white">
      <div className="text-sm font-semibold">{job.position_title}</div>
      <div className="text-xs opacity-80">{job.company_name}</div>
    </div>
  );
}
