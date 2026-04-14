# Seeds y credenciales de prueba

Los manifiestos [07a-auth-seed.yml](c:\Users\rjsoc\Downloads\Java\breaze_on_the_moon\breaze-backend\k8s\07a-auth-seed.yml), [12a-room-seed.yml](c:\Users\rjsoc\Downloads\Java\breaze_on_the_moon\breaze-backend\k8s\12a-room-seed.yml) y [19a-booking-seed.yml](c:\Users\rjsoc\Downloads\Java\breaze_on_the_moon\breaze-backend\k8s\19a-booking-seed.yml) cargan datos base cuando las tablas ya existen y los registros aún no están presentes.

Credenciales seed:
- Usuario admin: `seedadmin`
- Contraseña admin: `BreazeAdmin#2026`
- Usuario cliente: `seedclient`
- Contraseña cliente: `BreazeClient#2026`

Notas operativas:
- Los jobs esperan a que PostgreSQL esté disponible y a que Hibernate cree la tabla correspondiente antes de insertar.
- Los inserts son idempotentes, así que no duplican datos si reaplicas los manifiestos.
- Si eliminas manualmente un PVC y quieres volver a resembrar en el mismo cluster, elimina también el job completado antes de reaplicar el manifiesto correspondiente.
