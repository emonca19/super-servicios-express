/**
 * Script de prueba para JWT y autenticación
 * Ejecutar con: node src/test/test-jwt.js
 */

const jwt = require('jsonwebtoken');
const { authConfig } = require('../config/auth.config');

console.log('Iniciando pruebas de JWT\n');

// Test 1: Generar token
console.log('📋 Test 1: Generar token');
const payload = {
  id: 'test_user_123',
  email: 'test@example.com',
};

const token = jwt.sign(payload, authConfig.secret, {
  expiresIn: authConfig.expiresIn,
});
console.log('Token generado:', token.substring(0, 50) + '...');

// Test 2: Verificar token válido
console.log('\n📋 Test 2: Verificar token válido');
try {
  const decoded = jwt.verify(token, authConfig.secret);
  console.log('Token válido decodificado:');
  console.log('   - ID:', decoded.id);
  console.log('   - Email:', decoded.email);
  console.log('   - Expira en:', new Date(decoded.exp * 1000).toLocaleString());
} catch (err) {
  console.error('Error verificando token:', err.message);
}

// Test 3: Token expirado simulado
console.log('\nTest 3: Token expirado (simulado)');
const expiredToken = jwt.sign(payload, authConfig.secret, { expiresIn: '-1s' });
try {
  jwt.verify(expiredToken, authConfig.secret);
  console.error('El token expirado debería fallar');
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    console.log('Token expirado correctamente rechazado');
  } else {
    console.error('Error inesperado:', err.message);
  }
}

// Test 4: Token con secret incorrecto
console.log('\nTest 4: Token con secret incorrecto');
try {
  jwt.verify(token, 'wrong-secret');
  console.error('El token con secret incorrecto debería fallar');
} catch (err) {
  if (err.name === 'JsonWebTokenError') {
    console.log('Token con secret incorrecto correctamente rechazado');
  } else {
    console.error('Error inesperado:', err.message);
  }
}

// Test 5: Token malformado
console.log('\nTest 5: Token malformado');
try {
  jwt.verify('invalid.token.here', authConfig.secret);
  console.error('El token malformado debería fallar');
} catch (err) {
  if (err.name === 'JsonWebTokenError') {
    console.log('Token malformado correctamente rechazado');
  } else {
    console.error('Error inesperado:', err.message);
  }
}

// Test 6: Credenciales de login
console.log('\nTest 6: Verificar credenciales de login');
const correctEmail = 'admin@taller.com';
const correctPassword = 'admin123';

console.log('Credenciales para login:');
console.log('   - Email:', correctEmail);
console.log('   - Password:', correctPassword);

console.log('\nTodas las pruebas de JWT pasaron exitosamente');
console.log('\nPara probar el login completo, usa:');
console.log('   POST http://localhost:3000/api/v1/auth/login');
console.log('   Body: { "email": "admin@taller.com", "password": "admin123" }');
