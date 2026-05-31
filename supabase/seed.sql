-- Admin user (PIN stored as plain text for MVP - hash in production)
insert into usuarios (id, nombre, pin, rol, avatar) values
  ('00000000-0000-0000-0000-000000000001', 'admin', '1234', 'admin', '👑')
on conflict (nombre) do nothing;

-- Mundial 2026
insert into torneos (id, nombre, anio, activo) values
  ('00000000-0000-0000-0000-000000000010', 'Mundial 2026', 2026, true)
on conflict do nothing;

-- Sample matches for Mundial 2026 (Group stage)
insert into partidos (torneo_id, equipo_a, equipo_b, fecha, fase) values
  ('00000000-0000-0000-0000-000000000010', 'Argentina', 'México', '2026-06-15 18:00:00+00', 'grupos'),
  ('00000000-0000-0000-0000-000000000010', 'Brasil', 'Francia', '2026-06-16 21:00:00+00', 'grupos'),
  ('00000000-0000-0000-0000-000000000010', 'España', 'Alemania', '2026-06-17 18:00:00+00', 'grupos'),
  ('00000000-0000-0000-0000-000000000010', 'Uruguay', 'Portugal', '2026-06-18 21:00:00+00', 'grupos'),
  ('00000000-0000-0000-0000-000000000010', 'Colombia', 'Chile', '2026-06-19 18:00:00+00', 'grupos'),
  ('00000000-0000-0000-0000-000000000010', 'Italia', 'Inglaterra', '2026-06-20 21:00:00+00', 'grupos'),
  ('00000000-0000-0000-0000-000000000010', 'Argentina', 'Polonia', '2026-06-26 18:00:00+00', 'grupos'),
  ('00000000-0000-0000-0000-000000000010', 'Brasil', 'Marruecos', '2026-06-27 21:00:00+00', 'grupos'),
  ('00000000-0000-0000-0000-000000000010', 'España', 'Japón', '2026-06-28 18:00:00+00', 'grupos')
on conflict do nothing;
