# 🚗 Super Servicios Express

Sistema de gestión para taller automotriz desarrollado con Node.js, Express, Prisma ORM y MySQL.

## Características

- ✅ API REST completa con arquitectura MVC
- ✅ Autenticación JWT
- ✅ Validación de datos con express-validator
- ✅ Manejo centralizado de errores
- ✅ **Documentación interactiva con Swagger UI** 📚
- ✅ Dockerizado (MySQL + API)
- ✅ Prisma ORM con migraciones
- ✅ Códigos HTTP apropiados (200, 201, 204, 400, 401, 404, 409, 500)

## Entidades

- **Cliente**: Gestión de clientes del taller
- **Automóvil**: Vehículos de los clientes
- **Servicio**: Catálogo de servicios ofrecidos
- **Cita**: Agendamiento de servicios
- **DetalleCita**: Servicios aplicados en cada cita

## Inicio Rápido

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/emonca19/super-servicios-express.git
cd super-servicios-express

# 2. Iniciar servicios
docker compose --env-file .env.docker up -d

# 3. Acceder a la documentación
# http://localhost:3000/api-docs
```

**O usa el script de ayuda:**
```powershell
.\docker-manager.ps1
```

### Opción 2: Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
copy .env.example .env
# Edita .env con tus configuraciones

# 3. Iniciar MySQL con Docker
docker compose --env-file .env.docker up -d mysql

# 4. Aplicar migraciones
npx prisma migrate deploy

# 5. Iniciar servidor
npm start
```

## Documentación API

Una vez iniciado el servidor, accede a:

**Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Autenticación

Todas las rutas están protegidas excepto `/api/v1/auth/login`.

**Credenciales de prueba:**
```json
{
  "email": "admin@taller.com",
  "password": "admin123"
}
```

**Uso del Token en Swagger:**
1. Haz login en `/api/v1/auth/login`
2. Copia el token de la respuesta
3. Haz clic en el botón **Authorize** (arriba a la derecha)
4. Pega el token (sin escribir "Bearer")
5. Haz clic en "Authorize"
6. ¡Listo! Ahora puedes probar todos los endpoints

## Endpoints Disponibles

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión

### Clientes
- `GET /api/v1/clientes` - Listar todos
- `GET /api/v1/clientes/:id` - Obtener por ID
- `POST /api/v1/clientes` - Crear nuevo
- `PUT /api/v1/clientes/:id` - Actualizar
- `DELETE /api/v1/clientes/:id` - Eliminar

## Estructura del Proyecto

```
src/
├── api/                    # Endpoints y rutas
│   ├── auth/              # Autenticación JWT
│   ├── clientes/          # CRUD de clientes (EJEMPLO COMPLETO)
│   └── IndexRoutes.js     # Router central
├── config/                # Configuraciones
│   ├── auth.config.js     # JWT config
│   └── swagger.js         # Documentación API
├── dal/                   # Data Access Layer
│   ├── repository/        # Repositorios Prisma
│   └── prisma-client.js
├── middlewares/           # Middlewares Express
│   ├── auth.middleware.js # Protección JWT
│   ├── errorHandler.js    # Manejo de errores
│   └── validator.js       # Validaciones
├── utils/                 # Utilidades
│   ├── asyncHandler.js    # Wrapper async
│   └── response.js        # Respuestas HTTP consistentes
└── app.js                 # Aplicación Express
```

## Scripts Disponibles

```bash
npm start              # Iniciar servidor
npm run dev            # Modo desarrollo con nodemon
npx prisma generate    # Generar cliente Prisma
npx prisma migrate dev # Crear nueva migración
npx prisma studio      # Interfaz visual de BD
```

## Comandos Docker

```bash
# Iniciar todo
docker compose --env-file .env.docker up -d

# Ver logs en tiempo real
docker compose logs -f

# Detener servicios
docker compose down

# Limpiar todo (incluye datos)
docker compose down -v

# Rebuild imágenes
docker compose build --no-cache
```

## Seguridad Implementada

- ✅ JWT con secreto seguro de 128 caracteres
- ✅ Validación de todas las entradas
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad HTTP
- ✅ Usuario no-root en contenedor Docker
- ✅ Sanitización de errores en producción

## Probar la API

### Con Swagger UI (Más Fácil) 
1. Ve a http://localhost:3000/api-docs
2. Expande `POST /auth/login`
3. Haz clic en "Try it out"
4. Usa las credenciales de prueba
5. Copia el token de la respuesta
6. Haz clic en "🔓 Authorize" (arriba)
7. Pega el token y autoriza
8. ¡Prueba cualquier endpoint!

### Con PowerShell
```powershell
# Login
$response = Invoke-WebRequest -Uri http://localhost:3000/api/v1/auth/login `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"admin@taller.com","password":"admin123"}'

$token = ($response.Content | ConvertFrom-Json).data.token

# Crear cliente
Invoke-WebRequest -Uri http://localhost:3000/api/v1/clientes `
  -Method POST `
  -Headers @{
    "Authorization"="Bearer $token"
    "Content-Type"="application/json"
  } `
  -Body '{"nombre":"Juan Pérez","email":"juan@mail.com","telefono":"6441234567"}'
```

## División del Trabajo Entre Integrantes

### (BASE COMPLETA)
- ✅ Estructura base del proyecto
- ✅ Autenticación JWT
- ✅ Middlewares (errores, validación, auth)
- ✅ CRUD completo de **Clientes** (usar como plantilla)
- ✅ Documentación Swagger configurada
- ✅ Docker configurado
- ✅ Utils y respuestas HTTP

## Dependencias Principales

```json
{
  "express": "Framework web",
  "@prisma/client": "ORM para MySQL",
  "jsonwebtoken": "Autenticación JWT",
  "express-validator": "Validación de datos",
  "swagger-ui-express": "Documentación interactiva",
  "swagger-jsdoc": "Generación de docs",
  "helmet": "Seguridad HTTP headers",
  "cors": "Cross-Origin Resource Sharing"
}
```

## Variables de Entorno

Archivo `.env` para **desarrollo local**:
```env
MYSQL_ROOT_PASSWORD=root_password_123
MYSQL_DATABASE=super_servicios_express
DATABASE_URL="mysql://root:root_password_123@localhost:3307/super_servicios_express"
PORT=3000
NODE_ENV=development
JWT_SECRET=genera_uno_seguro_con_el_comando_de_abajo
JWT_EXPIRES_IN=1d
```

Archivo `.env.docker` para **Docker**:
```env
MYSQL_ROOT_PASSWORD=root_password_123
MYSQL_DATABASE=super_servicios_express
DATABASE_URL="mysql://root:root_password_123@mysql:3306/super_servicios_express"
PORT=3000
NODE_ENV=development
JWT_SECRET=genera_uno_seguro_con_el_comando_de_abajo
JWT_EXPIRES_IN=1d
```

**Generar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Troubleshooting

### El servidor no inicia
- Verifica que MySQL esté corriendo: `docker ps`
- Revisa los logs: `docker compose logs -f`

### Error de conexión a BD
- Verifica el `DATABASE_URL` en `.env`
- Asegúrate de que MySQL esté en puerto 3307
- Revisa que las migraciones estén aplicadas

### Token JWT inválido
- Verifica que el `JWT_SECRET` esté configurado
- El token expira en 1 día, solicita uno nuevo

## Licencia

ISC

## Autores

Equipo de Desarrollo - Super Servicios Express


