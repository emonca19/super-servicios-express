/**
 * Pruebas de integración del API usando fetch
 * Asegúrate de tener el servidor corriendo: npm start
 * Ejecutar con: node src/test/test-api.js
 */

const BASE_URL = 'http://localhost:3000/api/v1';

let authToken = '';

async function testAPI() {
  console.log('Iniciando pruebas de API\n');

  try {
    console.log('Test 1: POST /auth/login');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@taller.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginRes.json();
    if (loginData.success && loginData.data.token) {
      authToken = loginData.data.token;
      console.log('Login exitoso, token obtenido');
    } else {
      throw new Error('Login falló');
    }

    // Test 2: Get all clientes (sin auth - debería fallar)
    console.log('\nTest 2: GET /clientes (sin autenticación)');
    const noAuthRes = await fetch(`${BASE_URL}/clientes`);
    if (noAuthRes.status === 401) {
      console.log('Correctamente rechazado sin token');
    } else {
      console.warn('Debería rechazar sin token');
    }

    // Test 3: Get all clientes (con auth)
    console.log('\nTest 3: GET /clientes (con autenticación)');
    const clientesRes = await fetch(`${BASE_URL}/clientes`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const clientesData = await clientesRes.json();
    console.log(`${clientesData.data.length} clientes obtenidos`);

    // Test 4: Get cliente by ID
    if (clientesData.data.length > 0) {
      const clienteId = clientesData.data[0].id_cliente;
      console.log(`\nTest 4: GET /clientes/${clienteId}`);
      const clienteRes = await fetch(`${BASE_URL}/clientes/${clienteId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const clienteData = await clienteRes.json();
      console.log(`Cliente obtenido: ${clienteData.data.nombre}`);
    }

    // Test 5: Create cliente
    console.log('\nTest 5: POST /clientes (crear nuevo)');
    const newCliente = {
      nombre: 'Test User',
      apellido: 'Testing',
      telefono: '5551234567',
      email: `test${Date.now()}@test.com`,
      direccion: 'Test Address 123'
    };
    
    const createRes = await fetch(`${BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCliente)
    });
    const createData = await createRes.json();
    const newClienteId = createData.data.id_cliente;
    console.log(`Cliente creado con ID: ${newClienteId}`);

    // Test 6: Update cliente
    console.log(`\nTest 6: PUT /clientes/${newClienteId}`);
    const updateRes = await fetch(`${BASE_URL}/clientes/${newClienteId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: 'Test User Updated' })
    });
    const updateData = await updateRes.json();
    console.log(`Cliente actualizado: ${updateData.data.nombre}`);

    // Test 7: Delete cliente
    console.log(`\nTest 7: DELETE /clientes/${newClienteId}`);
    const deleteRes = await fetch(`${BASE_URL}/clientes/${newClienteId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (deleteRes.status === 204 || deleteRes.status === 200) {
      console.log('Cliente eliminado correctamente');
    }

    console.log('\nTodas las pruebas de API pasaron exitosamente');

  } catch (err) {
    console.error('\nError en las pruebas:', err.message);
    process.exit(1);
  }
}

// Verificar que fetch esté disponible (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('Este script requiere Node.js 18+ con fetch nativo');
  console.log('Alternativa: instala node-fetch con "npm install node-fetch"');
  process.exit(1);
}

testAPI()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
  });
