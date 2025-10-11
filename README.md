

# Super Servicios Express

API Express + Prisma + PostgreSQL lista para desarrollo local con Docker.

## Requisitos

- Docker y Docker Compose

## Pasos para correr el proyecto

1. Clona el repositorio:
	```bash
	git clone https://github.com/emonca19/super-servicios-express.git
	cd super-servicios-express
	```

2. Crea un archivo `.env` en la raíz con el siguiente contenido (ajusta usuario/contraseña si lo deseas):
	```env
	DATABASE_URL="postgresql://superuser:superpassword@db:5432/super_servicios_db"
	POSTGRES_USER=superuser
	POSTGRES_PASSWORD=superpassword
	POSTGRES_DB=super_servicios_db
	PORT=3000
	NODE_ENV=development
	```

3. Levanta los servicios:
	```bash
	docker compose up --build
	```

4. Ejecuta migraciones de la base de datos (en otra terminal):
	```bash
	docker exec -it super-servicios-express npx prisma migrate deploy
	```

5. (Opcional) Genera el cliente de Prisma:
	```bash
	docker exec -it super-servicios-express npx prisma generate
	```

6. Accede a la API en:
	- http://localhost:3000

7. Accede a Prisma Studio (visualizador de la base de datos):
	```bash
	docker exec -it super-servicios-express npx prisma studio --hostname 0.0.0.0 --port 5555
	```
	Luego entra en tu navegador a: http://localhost:5555

---

Si tienes problemas:
- Asegúrate de que el puerto 5555 está mapeado en la sección `api` de tu `docker-compose.yml`.
- Usa siempre `--hostname 0.0.0.0` al abrir Prisma Studio en Docker.
- Si cambias el usuario/contraseña de la base de datos, actualiza también la variable `DATABASE_URL`.


