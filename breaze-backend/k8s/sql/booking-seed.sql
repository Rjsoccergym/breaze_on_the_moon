INSERT INTO reservas (
  id,
  habitacion_id,
  cliente_id,
  fecha_inicio,
  fecha_fin,
  monto_total,
  estado,
  created_at,
  updated_at
)
SELECT
  '44444444-4444-4444-4444-444444444441'::uuid,
  '33333333-3333-3333-3333-333333333332'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  DATE '2026-02-10',
  DATE '2026-02-13',
  795000.00,
  'RESERVADA',
  TIMESTAMP '2026-01-10 11:00:00',
  TIMESTAMP '2026-01-10 11:00:00'
WHERE NOT EXISTS (
  SELECT 1 FROM reservas WHERE id = '44444444-4444-4444-4444-444444444441'::uuid
);

INSERT INTO reservas (
  id,
  habitacion_id,
  cliente_id,
  fecha_inicio,
  fecha_fin,
  monto_total,
  estado,
  created_at,
  updated_at
)
SELECT
  '44444444-4444-4444-4444-444444444442'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  DATE '2026-02-18',
  DATE '2026-02-21',
  1560000.00,
  'CONFIRMADA',
  TIMESTAMP '2026-01-10 11:10:00',
  TIMESTAMP '2026-01-10 11:10:00'
WHERE NOT EXISTS (
  SELECT 1 FROM reservas WHERE id = '44444444-4444-4444-4444-444444444442'::uuid
);

INSERT INTO reservas (
  id,
  habitacion_id,
  cliente_id,
  fecha_inicio,
  fecha_fin,
  monto_total,
  estado,
  created_at,
  updated_at
)
SELECT
  '44444444-4444-4444-4444-444444444443'::uuid,
  '33333333-3333-3333-3333-333333333334'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  DATE '2026-01-22',
  DATE '2026-01-24',
  490000.00,
  'CANCELADA',
  TIMESTAMP '2026-01-10 11:20:00',
  TIMESTAMP '2026-01-10 11:20:00'
WHERE NOT EXISTS (
  SELECT 1 FROM reservas WHERE id = '44444444-4444-4444-4444-444444444443'::uuid
);
