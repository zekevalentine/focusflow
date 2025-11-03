'use client';
import type { Job } from '@/src/lib/types';
import { supabase } from '@/src/lib/supabaseClient';

export default function JobTable({ jobs, onChange }: { jobs: Job[]; onChange: () => void }) {
  const updateStatus = async (id: string, status: Job['status']) => {
    const { error } = await supabase.from('job_applications').update({ status }).eq('id', id);
    if (!error) onChange();
  };

  return (
    <table className="w-full text-left border mt-2">
      <thead>
        <tr className="bg-gray-50">
          <th className="p-2">Company</th>
          <th className="p-2">Position</th>
          <th className="p-2">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map(j => (
          <tr key={j.id} className="border-t">
            <td className="p-2">{j.company_name}</td>
            <td className="p-2">{j.position_title}</td>
            <td className="p-2">{j.status}</td>
            <td className="p-2">
              <select
                defaultValue={j.status}
                onChange={e => updateStatus(j.id, e.target.value as Job['status'])}
                className="border p-1 rounded"
              >
                <option value="wishlist">Wishlist</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
