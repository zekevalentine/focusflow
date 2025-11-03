export type JobStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface Job {
  id: string;
  user_id: string;
  company_name: string;
  position_title: string;
  status: JobStatus;
  job_url?: string | null;
  resume_version?: string | null;
  cover_letter_text?: string | null;
  date_applied?: string | null;
  next_action_date?: string | null;
  notes?: string | null;
  ai_score?: number | null;
  created_at?: string;
}
