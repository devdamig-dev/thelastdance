-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Usuarios table (custom auth, no Supabase Auth)
create table if not exists usuarios (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null unique,
  pin text not null,
  avatar text,
  rol text not null default 'user' check (rol in ('user', 'admin')),
  created_at timestamptz default now()
);

-- Torneos
create table if not exists torneos (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  anio int not null,
  activo boolean default false,
  created_at timestamptz default now()
);

-- Partidos
create table if not exists partidos (
  id uuid primary key default uuid_generate_v4(),
  torneo_id uuid references torneos(id) on delete cascade,
  equipo_a text not null,
  equipo_b text not null,
  escudo_a text,
  escudo_b text,
  fecha timestamptz not null,
  fase text not null check (fase in ('grupos','octavos','cuartos','semifinal','final')),
  resultado text check (resultado in ('1','X','2')),
  created_at timestamptz default now()
);

-- Ligas
create table if not exists ligas (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  codigo text not null unique,
  owner_id uuid references usuarios(id) on delete cascade,
  torneo_id uuid references torneos(id),
  created_at timestamptz default now()
);

-- Miembros de liga
create table if not exists miembros_liga (
  id uuid primary key default uuid_generate_v4(),
  liga_id uuid references ligas(id) on delete cascade,
  usuario_id uuid references usuarios(id) on delete cascade,
  created_at timestamptz default now(),
  unique(liga_id, usuario_id)
);

-- Pronosticos
create table if not exists pronosticos (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references usuarios(id) on delete cascade,
  liga_id uuid references ligas(id) on delete cascade,
  partido_id uuid references partidos(id) on delete cascade,
  pronostico text not null check (pronostico in ('1','X','2')),
  created_at timestamptz default now(),
  unique(usuario_id, liga_id, partido_id)
);

-- Bonus
create table if not exists bonus (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references usuarios(id) on delete cascade,
  liga_id uuid references ligas(id) on delete cascade,
  torneo_id uuid references torneos(id) on delete cascade,
  campeon text,
  subcampeon text,
  goleador text,
  created_at timestamptz default now(),
  unique(usuario_id, liga_id, torneo_id)
);

-- Logros desbloqueados
create table if not exists logros_usuario (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references usuarios(id) on delete cascade,
  logro_id text not null,
  created_at timestamptz default now(),
  unique(usuario_id, logro_id)
);

-- Disable RLS for MVP (enable and configure policies later)
alter table usuarios disable row level security;
alter table torneos disable row level security;
alter table partidos disable row level security;
alter table ligas disable row level security;
alter table miembros_liga disable row level security;
alter table pronosticos disable row level security;
alter table bonus disable row level security;
alter table logros_usuario disable row level security;
