# Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .

EXPOSE 3000
EXPOSE 5555

CMD ["sh", "-lc", "npx prisma db push && node src/server.js"]
