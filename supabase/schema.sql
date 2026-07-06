-- Tabela de licenças do Checklist EPMURAS
-- Rode este script no Supabase: Dashboard -> SQL Editor -> New query -> colar -> Run

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  plan text not null default 'completo' check (plan in ('simples', 'completo')),
  status text not null default 'active' check (status in ('active', 'revoked')),
  hotmart_transaction text,
  hotmart_product_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.licenses enable row level security;

-- Usuário logado só enxerga a própria licença (pelo e-mail do login).
-- O webhook usa a chave secreta, que ignora o RLS.
drop policy if exists "read own license" on public.licenses;
create policy "read own license" on public.licenses
  for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));
