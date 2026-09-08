-- Independent gallery project only. Access is through the authenticated server API.
create table if not exists public.case_favorites (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 case_id bigint not null check (case_id > 0),
 created_at timestamptz not null default now(),
 unique (user_id, case_id)
);
alter table public.case_favorites enable row level security;
revoke all on public.case_favorites from anon, authenticated;
grant select, insert, update, delete on public.case_favorites to service_role;
