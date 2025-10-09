# super-servicios-express

API Express con Prisma y PostgreSQL, lista para desarrollo local y Docker.

## Requisitos

- Node.js 18 o superior
- Docker y Docker Compose

## Uso con Docker 

1. Construye y levanta los servicios:
   ```sh
   docker-compose up --build
   ```

2. La API estará disponible en [http://localhost:3000](http://localhost:3000)

---

## Notas

- Si cambias el esquema de Prisma, ejecuta `npx prisma generate` de nuevo.
- Para desarrollo puro en Node.js 18+, puedes usar `node --watch`.
