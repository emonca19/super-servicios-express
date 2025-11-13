require('dotenv').config();

const authConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
};

if (!authConfig.secret) {
  console.error('ERROR: JWT_SECRET no está definido en las variables de entorno');
  console.error('Por favor, define JWT_SECRET en tu archivo .env');
  process.exit(1);
}

if (authConfig.secret.length < 32) {
  console.warn('JWT_SECRET es demasiado corto. Usa al menos 32 caracteres.');
  console.warn('Genera uno seguro con: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
}

module.exports = { authConfig };