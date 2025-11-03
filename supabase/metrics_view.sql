create view if not exists public.job_metrics as
select
  user_id,
  count(*) filter (where status in ('applied','interview','offer','rejected','wishlist')) as total_apps,
  count(*) filter (where status = 'interview') as interviews,
  count(*) filter (where status = 'offer') as offers
from public.job_applications
group by user_id;
