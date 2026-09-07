-- Run only in the independent gallery Supabase project. No TCF tables or accounts.
create table if not exists public.gallery_submission_quota (
  account_id uuid not null references auth.users(id) on delete cascade,
  submission_day date not null,
  used integer not null check (used between 0 and 5),
  primary key (account_id, submission_day)
);
alter table public.gallery_submission_quota enable row level security;
revoke all on public.gallery_submission_quota from anon, authenticated;

create or replace function public.reserve_gallery_submission(account_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  day_key date := (now() at time zone 'Asia/Taipei')::date;
  new_count integer;
  reset_time timestamptz := (((now() at time zone 'Asia/Taipei')::date + 1)::timestamp at time zone 'Asia/Taipei');
begin
  insert into public.gallery_submission_quota as q (account_id, submission_day, used)
  values (account_id, day_key, 1)
  on conflict on constraint gallery_submission_quota_pkey do update set used = q.used + 1
  where q.used < 5
  returning used into new_count;
  return jsonb_build_object('allowed', new_count is not null, 'remaining', greatest(0, 5 - coalesce(new_count, 5)), 'resetAt', reset_time);
end;
$$;
revoke all on function public.reserve_gallery_submission(uuid) from public, anon, authenticated;
grant execute on function public.reserve_gallery_submission(uuid) to service_role;
