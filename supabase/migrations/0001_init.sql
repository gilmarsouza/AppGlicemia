-- AppGlicemia — schema inicial (MVP: só glicemia)
-- Contexto de cada medição, conforme PROJETO.md secao 5.
create type glucose_context as enum (
  'jejum',
  'antes_refeicao',
  'depois_refeicao',
  'antes_dormir'
);

create table glucose_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  value_mg_dl integer not null check (value_mg_dl > 0 and value_mg_dl < 1000),
  context glucose_context not null,
  measured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index glucose_readings_user_measured_at_idx
  on glucose_readings (user_id, measured_at desc);

alter table glucose_readings enable row level security;

create policy "Users manage their own glucose readings"
  on glucose_readings
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Faixas de alerta configuráveis por usuário (uma linha por paciente).
-- ATENCAO: os valores default abaixo sao referencias gerais comuns em
-- diretrizes de diabetes tipo 2 para adultos nao gestantes — NAO foram
-- validados por um medico para este paciente especifico. Conforme
-- PROJETO.md secao 5 e 11, isso precisa ser confirmado com orientacao
-- medica real antes de qualquer uso continuo; ate la, tratar como
-- sugestao inicial editavel, nao como diagnostico.
create table alert_thresholds (
  user_id uuid primary key references auth.users (id) on delete cascade,
  hypo_mg_dl integer not null default 70,
  hyper_fasting_mg_dl integer not null default 130,
  hyper_post_meal_mg_dl integer not null default 180,
  updated_at timestamptz not null default now()
);

alter table alert_thresholds enable row level security;

create policy "Users manage their own alert thresholds"
  on alert_thresholds
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
