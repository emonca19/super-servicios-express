// src/dal/prisma-client.js

// Solo carga .env si la variable no viene ya del entorno (Docker la inyecta)
if (!process.env.DATABASE_URL) {
  require('dotenv').config(); // lee .env desde la raíz en local
}

const { PrismaClient } = require('@prisma/client');

// (opcional) logs útiles en desarrollo
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

// Cierre ordenado (evita conexiones colgadas en dev/docker)
process.on('beforeExit', async () => {
  try { await prisma.$disconnect(); } catch {}
});
process.on('SIGINT', async () => {
  try { await prisma.$disconnect(); } finally { process.exit(0); }
});
process.on('SIGTERM', async () => {
  try { await prisma.$disconnect(); } finally { process.exit(0); }
});

module.exports = prisma;
