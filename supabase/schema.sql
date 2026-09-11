-- =====================================================================
--  Rəvan Abdulzadə — Portfolio + Təlim Platforması
--  Supabase sxemi (SQL Editor-da bir dəfə tam icra et)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PROFILLƏR
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  email       text not null default '',
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now(),
  last_seen_at timestamptz
);

-- Qeydiyyatdan keçən hər kəs üçün avtomatik profil yaradılır.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin yoxlaması. SECURITY DEFINER olduğu üçün RLS rekursiyası yaranmır.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------
-- 2. KURSLAR
-- ---------------------------------------------------------------------
create table if not exists public.courses (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  summary       text not null default '',          -- kart üzərindəki 1 cümlə
  description   text not null default '',          -- detal səhifəsindəki mətn
  thumbnail_url text,
  category      text not null default 'marketinq'
                check (category in ('marketinq', 'ai', 'satis', 'dropshipping')),
  is_free       boolean not null default false,
  price         numeric(10,2) not null default 0,
  currency      text not null default 'AZN',
  learn_points  text[] not null default '{}',      -- "Bu kursda nə öyrənəcəksən"
  sort_order    integer not null default 0,        -- vitrində sıralama
  is_published  boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists courses_sort_idx on public.courses (sort_order, created_at desc);

-- ---------------------------------------------------------------------
-- 3. DƏRSLƏR VƏ MATERİALLAR
-- ---------------------------------------------------------------------
create table if not exists public.lessons (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses(id) on delete cascade,
  title       text not null,
  description text not null default '',
  video_url   text,                                 -- Google Drive embed linki
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists lessons_course_idx on public.lessons (course_id, sort_order);

create table if not exists public.lesson_materials (
  id         uuid primary key default gen_random_uuid(),
  lesson_id  uuid not null references public.lessons(id) on delete cascade,
  title      text not null,
  file_url   text not null,
  kind       text not null default 'pdf',
  sort_order integer not null default 0
);

create index if not exists materials_lesson_idx on public.lesson_materials (lesson_id, sort_order);

-- ---------------------------------------------------------------------
-- 4. QOŞULMALAR (kursa çıxış icazəsi)
-- ---------------------------------------------------------------------
--  Pulsuz kurs  -> istifadəçi özü qoşulur (admin təsdiqi YOX)
--  Pullu kurs   -> yalnız admin əlavə edə bilər
create table if not exists public.enrollments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  course_id  uuid not null references public.courses(id) on delete cascade,
  source     text not null default 'free' check (source in ('free', 'admin')),
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create index if not exists enrollments_user_idx on public.enrollments (user_id);

-- ---------------------------------------------------------------------
-- 5. DƏRS PROQRESİ (istifadəçi özü təsdiqləyir)
-- ---------------------------------------------------------------------
create table if not exists public.lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_id    uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists progress_user_idx on public.lesson_progress (user_id);

-- ---------------------------------------------------------------------
-- 6. SORĞULAR (pullu kurs lead-ləri)
-- ---------------------------------------------------------------------
create table if not exists public.course_requests (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  course_id  uuid not null references public.courses(id) on delete cascade,
  full_name  text not null default '',
  email      text not null default '',
  status     text not null default 'new'
             check (status in ('new', 'contacted', 'approved', 'rejected')),
  note       text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists requests_status_idx on public.course_requests (status, created_at desc);

-- ---------------------------------------------------------------------
-- 7. KURS BAXIŞLARI (admin statistikası üçün)
-- ---------------------------------------------------------------------
create table if not exists public.course_views (
  id         bigserial primary key,
  course_id  uuid not null references public.courses(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists views_course_idx on public.course_views (course_id, created_at desc);

-- =====================================================================
--  RLS — SƏTİR SƏVİYYƏSİNDƏ TƏHLÜKƏSİZLİK
-- =====================================================================
alter table public.profiles         enable row level security;
alter table public.courses          enable row level security;
alter table public.lessons          enable row level security;
alter table public.lesson_materials enable row level security;
alter table public.enrollments      enable row level security;
alter table public.lesson_progress  enable row level security;
alter table public.course_requests  enable row level security;
alter table public.course_views     enable row level security;

-- --- profiles ---
drop policy if exists "profil: özünü oxu" on public.profiles;
create policy "profil: özünü oxu" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profil: özünü yenilə" on public.profiles;
create policy "profil: özünü yenilə" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "profil: admin tam idarə" on public.profiles;
create policy "profil: admin tam idarə" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- --- courses: dərc olunanlar hamıya açıqdır ---
drop policy if exists "kurs: dərc olunanı hamı görür" on public.courses;
create policy "kurs: dərc olunanı hamı görür" on public.courses
  for select using (is_published or public.is_admin());

drop policy if exists "kurs: admin idarə edir" on public.courses;
create policy "kurs: admin idarə edir" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

-- --- lessons: YALNIZ qoşulmuş istifadəçi görür ---
-- (kurs detal səhifəsindəki "məzmun planı" ayrıca RPC ilə verilir, aşağıda)
drop policy if exists "dərs: yalnız qoşulanlar" on public.lessons;
create policy "dərs: yalnız qoşulanlar" on public.lessons
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.enrollments e
      where e.course_id = lessons.course_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "dərs: admin idarə edir" on public.lessons;
create policy "dərs: admin idarə edir" on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

-- --- lesson_materials: dərsin icazəsini miras alır ---
drop policy if exists "material: yalnız qoşulanlar" on public.lesson_materials;
create policy "material: yalnız qoşulanlar" on public.lesson_materials
  for select using (
    public.is_admin()
    or exists (
      select 1
      from public.lessons l
      join public.enrollments e on e.course_id = l.course_id
      where l.id = lesson_materials.lesson_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "material: admin idarə edir" on public.lesson_materials;
create policy "material: admin idarə edir" on public.lesson_materials
  for all using (public.is_admin()) with check (public.is_admin());

-- --- enrollments ---
drop policy if exists "qoşulma: özünü oxu" on public.enrollments;
create policy "qoşulma: özünü oxu" on public.enrollments
  for select using (user_id = auth.uid() or public.is_admin());

-- İstifadəçi YALNIZ pulsuz və dərc olunmuş kursa özü qoşula bilər.
-- Pullu kursa qoşulma bu policy ilə bloklanır → yalnız admin verə bilər.
drop policy if exists "qoşulma: pulsuz kursa özü qoşulur" on public.enrollments;
create policy "qoşulma: pulsuz kursa özü qoşulur" on public.enrollments
  for insert with check (
    user_id = auth.uid()
    and source = 'free'
    and exists (
      select 1 from public.courses c
      where c.id = enrollments.course_id
        and c.is_free = true
        and c.is_published = true
    )
  );

drop policy if exists "qoşulma: admin idarə edir" on public.enrollments;
create policy "qoşulma: admin idarə edir" on public.enrollments
  for all using (public.is_admin()) with check (public.is_admin());

-- --- lesson_progress: yalnız qoşulduğu dərsi tamamlaya bilər ---
drop policy if exists "proqres: özünü oxu" on public.lesson_progress;
create policy "proqres: özünü oxu" on public.lesson_progress
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "proqres: özü qeyd edir" on public.lesson_progress;
create policy "proqres: özü qeyd edir" on public.lesson_progress
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.lessons l
      join public.enrollments e on e.course_id = l.course_id
      where l.id = lesson_progress.lesson_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "proqres: özü silir" on public.lesson_progress;
create policy "proqres: özü silir" on public.lesson_progress
  for delete using (user_id = auth.uid());

drop policy if exists "proqres: admin oxuyur" on public.lesson_progress;
create policy "proqres: admin oxuyur" on public.lesson_progress
  for all using (public.is_admin()) with check (public.is_admin());

-- --- course_requests: istifadəçi yaradır, yalnız admin oxuyur ---
drop policy if exists "sorğu: istifadəçi yaradır" on public.course_requests;
create policy "sorğu: istifadəçi yaradır" on public.course_requests
  for insert with check (user_id = auth.uid());

drop policy if exists "sorğu: özünü oxu" on public.course_requests;
create policy "sorğu: özünü oxu" on public.course_requests
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "sorğu: admin idarə edir" on public.course_requests;
create policy "sorğu: admin idarə edir" on public.course_requests
  for all using (public.is_admin()) with check (public.is_admin());

-- --- course_views: hər kəs yaza bilər, yalnız admin oxuyur ---
drop policy if exists "baxış: hamı yazır" on public.course_views;
create policy "baxış: hamı yazır" on public.course_views
  for insert with check (true);

drop policy if exists "baxış: admin oxuyur" on public.course_views;
create policy "baxış: admin oxuyur" on public.course_views
  for select using (public.is_admin());

-- =====================================================================
--  RPC — kurs detal səhifəsindəki "məzmun planı"
--  Dərslərin video linkini AÇMADAN yalnız başlıq/sıra qaytarır ki,
--  qoşulmamış ziyarətçi də plana baxa bilsin.
-- =====================================================================
create or replace function public.course_outline(course_slug text)
returns table (title text, sort_order integer)
language sql
stable
security definer
set search_path = public
as $$
  select l.title, l.sort_order
  from public.lessons l
  join public.courses c on c.id = l.course_id
  where c.slug = course_slug and c.is_published = true
  order by l.sort_order;
$$;

grant execute on function public.course_outline(text) to anon, authenticated;

-- =====================================================================
--  ADMIN HESABI
--  1) Supabase Dashboard → Authentication → Users → "Add user"
--     Email: revanabdulov2006@gmail.com   (Auto Confirm User: ON)
--  2) Sonra aşağıdakı sətri icra et:
-- =====================================================================
-- update public.profiles set role = 'admin' where email = 'revanabdulov2006@gmail.com';
