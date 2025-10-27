# Super Servicios Express (Ready)

## Requisitos
- Docker Desktop
- (Opcional) Node 18+ si quieres correr local

## Uso con Docker
1. Copia `.env.example` a `.env` (no cambies la `DATABASE_URL` a menos que sepas lo que haces).
2. `docker compose up -d --build`
3. API en `http://localhost:3001`
   - Health: `GET /health`
   - Prisma Studio (opcional): `http://localhost:5555` si levantas studio manualmente.
4. Logs: `docker compose logs -f api`

## Endpoints base
- Clientes: `/api/clientes`
- Automóviles: `/api/automoviles`
- Servicios: `/api/servicios`
- Citas: `/api/citas`
- Servicio en Cita (detalle): `/api/servicio-cita`

Todas las rutas POST/PUT tienen validaciones con `express-validator` y errores manejados (409 duplicados, 404 no encontrado, etc.).

## Desarrollo local (sin Docker)
1. `cp .env.example .env` y ajusta la `DATABASE_URL` a tu MySQL local.
2. `npm ci`
3. `npm run db:push`
4. `npm run dev`