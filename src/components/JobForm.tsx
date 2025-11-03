'use client';
import { useForm } from 'react-hook-form';
import { supabase } from '@/src/lib/supabaseClient';

type FormData = {
  company_name: string;
  position_title: string;
  job_url?: string;
  status: 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';
};

export default function JobForm({ onSaved }: { onSaved: () => void }) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { status: 'wishlist' },
  });

  const onSubmit = async (values: FormData) => {
    const { error } = await supabase.from('job_applications').insert(values);
    if (!error) {
      reset();
      onSaved();
    } else {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
      <input className="border p-2 rounded" placeholder="Company" {...register('company_name', { required: true })} />
      <input className="border p-2 rounded" placeholder="Position" {...register('position_title', { required: true })} />
      <input className="border p-2 rounded md:col-span-2" placeholder="Job URL" {...register('job_url')} />
      <select className="border p-2 rounded" {...register('status')}>
        <option value="wishlist">Wishlist</option>
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
      </select>
      <button className="border p-2 rounded md:col-span-5" type="submit">Add</button>
    </form>
  );
}
