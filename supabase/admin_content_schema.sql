create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'profile-images',
  'profile-images',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.text_tags (
  id uuid primary key default gen_random_uuid(),
  text text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year text not null,
  issuer text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (title, year)
);

create table if not exists public.tech_stack_items (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.experience_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  type text not null default 'Experience',
  logo text,
  from_date date not null,
  to_date date,
  description_list text[] not null default '{}',
  skills text[] not null default '{}',
  is_expanded boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.utility_categories (
  id text primary key,
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.utility_items (
  id uuid primary key default gen_random_uuid(),
  category_id text not null references public.utility_categories(id) on delete cascade,
  key text not null,
  name text not null,
  description text not null default '',
  url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (category_id, key)
);

-- ponytail: these two were missing from the original script — it granted
-- permissions on them further down without ever creating them, which errors
-- on a fresh project (42P01). Columns match src/data/projects.ts and
-- src/data/certificates.ts / the admin insert routes exactly.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  coverimage text,
  description text,
  githuburl text,
  previewurl text,
  tools text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issueddate date,
  orgname text,
  orglogo text,
  url text,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.text_tags enable row level security;
alter table public.achievements enable row level security;
alter table public.tech_stack_items enable row level security;
alter table public.experience_items enable row level security;
alter table public.utility_categories enable row level security;
alter table public.utility_items enable row level security;
alter table if exists public.projects enable row level security;
alter table if exists public.certificates enable row level security;

do $$
declare
  v_table_name text;
begin
  foreach v_table_name in array array[
    'site_content',
    'text_tags',
    'achievements',
    'tech_stack_items',
    'experience_items',
    'utility_categories',
    'utility_items',
    'projects',
    'certificates'
  ]
  loop
    if to_regclass('public.' || v_table_name) is not null and not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = v_table_name
        and policyname = 'Public read ' || v_table_name
    ) then
      execute format(
        'create policy %I on public.%I for select to anon, authenticated using (true)',
        'Public read ' || v_table_name,
        v_table_name
      );
    end if;
  end loop;
end $$;

grant select on public.site_content to anon, authenticated;
grant select on public.text_tags to anon, authenticated;
grant select on public.achievements to anon, authenticated;
grant select on public.tech_stack_items to anon, authenticated;
grant select on public.experience_items to anon, authenticated;
grant select on public.utility_categories to anon, authenticated;
grant select on public.utility_items to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select on public.certificates to anon, authenticated;

grant all on public.site_content to service_role;
grant all on public.text_tags to service_role;
grant all on public.achievements to service_role;
grant all on public.tech_stack_items to service_role;
grant all on public.experience_items to service_role;
grant all on public.utility_categories to service_role;
grant all on public.utility_items to service_role;
grant all on public.projects to service_role;
grant all on public.certificates to service_role;

insert into public.site_content (key, value)
values (
  'about',
  jsonb_build_object(
    'markdown',
    'I''m **Aayush**, larping into tech with AI.' || E'\n\n' ||
    'I build with Python, LLMs & AI agents, and RAG pipelines — turning "what if" ideas into working systems.' || E'\n\n' ||
    '- Python-first' || E'\n' ||
    '- AI agents & LLM workflows' || E'\n' ||
    '- RAG pipelines',
    'paragraphs',
    jsonb_build_array(
      'I''m Aayush, larping into tech with AI.',
      'I build with Python, LLMs & AI agents, and RAG pipelines.',
      'I care about turning ideas into working systems, one prototype at a time.'
    ),
    'focusAreas',
    jsonb_build_array('AI Agents', 'LLMs', 'RAG'),
    -- ponytail: no resume link yet, about.tsx hides the button when this is empty
    'resumeUrl',
    '',
    'resumeLabel',
    'See my resume',
    'secondaryLinkUrl',
    '',
    'secondaryLinkLabel',
    ''
  )
)
on conflict (key) do nothing;

insert into public.site_content (key, value)
values (
  'profile',
  jsonb_build_object(
    -- ponytail: placeholder initials avatar, replace via /admin once Cloudinary is set up
    'avatarUrl',
    'https://ui-avatars.com/api/?name=Aayush+Bhadbhade&size=300&background=C2521B&color=fff'
  )
)
on conflict (key) do nothing;

insert into public.site_content (key, value)
values (
  'photography',
  jsonb_build_object('photos', jsonb_build_array())
)
on conflict (key) do nothing;

insert into public.text_tags (text, sort_order)
values
  ('Building with LLMs', 0),
  ('Shipping AI agents', 1),
  ('RAG pipelines that actually retrieve', 2),
  ('Python, daily', 3),
  ('Turning prompts into products', 4),
  ('Learning in public', 5)
on conflict (text) do nothing;

-- ponytail: no verified achievements yet for Aayush — add real ones via /admin
-- instead of seeding placeholders here.

insert into public.tech_stack_items (name, slug, icon_url, sort_order)
values
  ('Python', 'python', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/python.svg', 0),
  ('PyTorch', 'pytorch', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/pytorch.svg', 1),
  ('OpenAI', 'openai', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg', 2),
  ('Hugging Face', 'huggingface', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/huggingface.svg', 3),
  ('FastAPI', 'fastapi', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/fastapi.svg', 4),
  ('NumPy', 'numpy', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/numpy.svg', 5),
  ('Pandas', 'pandas', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/pandas.svg', 6),
  ('Jupyter', 'jupyter', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/jupyter.svg', 7),
  ('PostgreSQL', 'postgresql', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/postgresql.svg', 8),
  ('Docker', 'docker', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/docker.svg', 9),
  ('Git', 'git', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/git.svg', 10),
  ('GitHub', 'github', 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg', 11)
on conflict (name) do nothing;
-- ponytail: verify icon slugs render once seeded (simple-icons renames slugs
-- occasionally) and adjust the stack itself via /admin to match your real tools.
