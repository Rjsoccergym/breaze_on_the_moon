INSERT INTO habitaciones (
  id,
  numero_identificador,
  tipo,
  descripcion,
  capacidad_maxima,
  precio_noche,
  estado,
  created_at,
  updated_at
)
SELECT
  '33333333-3333-3333-3333-333333333331'::uuid,
  'HAB-101',
  'SENCILLA',
  'Habitación sencilla con vista al jardín y acceso rápido al lobby.',
  1,
  180000.00,
  'DISPONIBLE',
  TIMESTAMP '2026-01-10 10:00:00',
  TIMESTAMP '2026-01-10 10:00:00'
WHERE NOT EXISTS (
  SELECT 1 FROM habitaciones WHERE numero_identificador = 'HAB-101'
);

INSERT INTO habitaciones (
  id,
  numero_identificador,
  tipo,
  descripcion,
  capacidad_maxima,
  precio_noche,
  estado,
  created_at,
  updated_at
)
SELECT
  '33333333-3333-3333-3333-333333333332'::uuid,
  'HAB-202',
  'DOBLE',
  'Habitación doble para pruebas de reserva pendiente de confirmación.',
  2,
  265000.00,
  'RESERVADA',
  TIMESTAMP '2026-01-10 10:05:00',
  TIMESTAMP '2026-01-10 10:05:00'
WHERE NOT EXISTS (
  SELECT 1 FROM habitaciones WHERE numero_identificador = 'HAB-202'
);

INSERT INTO habitaciones (
  id,
  numero_identificador,
  tipo,
  descripcion,
  capacidad_maxima,
  precio_noche,
  estado,
  created_at,
  updated_at
)
SELECT
  '33333333-3333-3333-3333-333333333333'::uuid,
  'HAB-303',
  'SUITE',
  'Suite ejecutiva ya confirmada para validar ocupación real.',
  4,
  520000.00,
  'OCUPADA',
  TIMESTAMP '2026-01-10 10:10:00',
  TIMESTAMP '2026-01-10 10:10:00'
WHERE NOT EXISTS (
  SELECT 1 FROM habitaciones WHERE numero_identificador = 'HAB-303'
);

INSERT INTO habitaciones (
  id,
  numero_identificador,
  tipo,
  descripcion,
  capacidad_maxima,
  precio_noche,
  estado,
  created_at,
  updated_at
)
SELECT
  '33333333-3333-3333-3333-333333333334'::uuid,
  'HAB-404',
  'DOBLE',
  'Habitación liberada para validar reservas canceladas.',
  2,
  245000.00,
  'DISPONIBLE',
  TIMESTAMP '2026-01-10 10:15:00',
  TIMESTAMP '2026-01-10 10:15:00'
WHERE NOT EXISTS (
  SELECT 1 FROM habitaciones WHERE numero_identificador = 'HAB-404'
);
