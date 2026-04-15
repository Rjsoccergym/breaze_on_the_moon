INSERT INTO personas (
  id,
  username,
  password,
  nombre,
  apellido,
  tipo_identificacion,
  numero_identificacion,
  telefono,
  email,
  fecha_nacimiento,
  rol,
  created_at,
  updated_at
)
SELECT
  '11111111-1111-1111-1111-111111111111'::uuid,
  'admin1',
  '$2a$10$byt4Gx.Wr9HCeNjYVtZ41eSWGZ7sIs0X.OmkjixCXvh1FRD0pUbJO',
  'Admin',
  'Breaze',
  'CC',
  '900000001',
  '3000000001',
  'admin1@breaze.local',
  DATE '1990-01-15',
  'ADMIN',
  TIMESTAMP '2026-01-10 09:00:00',
  TIMESTAMP '2026-01-10 09:00:00'
WHERE NOT EXISTS (
  SELECT 1 FROM personas WHERE username = 'admin1'
);

INSERT INTO personas (
  id,
  username,
  password,
  nombre,
  apellido,
  tipo_identificacion,
  numero_identificacion,
  telefono,
  email,
  fecha_nacimiento,
  rol,
  created_at,
  updated_at
)
SELECT
  '22222222-2222-2222-2222-222222222222'::uuid,
  'client1',
  '$2a$10$e7Xls5hltX5agLsXs9ISSOdyljKqkRLgBgMKrtstDrzsyk6M9xGci',
  'Cliente',
  'Breaze',
  'CC',
  '900000002',
  '3000000002',
  'client1@breaze.local',
  DATE '1996-07-20',
  'CLIENT',
  TIMESTAMP '2026-01-10 09:05:00',
  TIMESTAMP '2026-01-10 09:05:00'
WHERE NOT EXISTS (
  SELECT 1 FROM personas WHERE username = 'client1'
);
