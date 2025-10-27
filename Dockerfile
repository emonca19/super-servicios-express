FROM node:22-alpine

WORKDIR /app

# Copiamos lock y schema ANTES de instalar
COPY package*.json ./
COPY prisma ./prisma/

# Instalar deps (si falla ci por lock, usa install)
RUN npm ci --omit=dev || npm install --omit=dev

# Copiamos el resto del código
COPY . .

EXPOSE 3000
CMD ["npm","start"]
