# ========================================
# Multi-stage build para optimizar imagen
# ========================================

FROM node:22-alpine AS base

# Instalar dependencias del sistema necesarias para Prisma
RUN apk add --no-cache openssl libc6-compat netcat-openbsd

WORKDIR /app

# ========================================
# Stage 1: Dependencies
# ========================================
FROM base AS dependencies

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para Prisma)
RUN npm ci

# Copiar el schema de Prisma
COPY prisma ./prisma/

# Generar Prisma Client
RUN npx prisma generate

# ========================================
# Stage 2: Production
# ========================================
FROM base AS production

# Copiar node_modules desde stage de dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package*.json ./

# Copiar el código de la aplicación
COPY . .

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Cambiar permisos
RUN chown -R nodejs:nodejs /app

# Usar usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Comando por defecto (puede ser sobreescrito por docker-compose)
CMD ["node", "src/app.js"]