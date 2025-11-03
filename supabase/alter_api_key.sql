alter table public.profiles add column if not exists api_key text unique;
-- No default for security; user generates from Account page.
-- Policies already restrict select/update to the owner.
