/**
 * Script de prueba para todos los repositorios
 * Ejecutar con: node src/test/test-repositories.js
 */

const clienteRepo = require('../dal/repository/cliente.repository');
const automovilRepo = require('../dal/repository/automovil.repository');
const servicioRepo = require('../dal/repository/servicio.repository');
const citaRepo = require('../dal/repository/cita.repository');
const servicioCitaRepo = require('../dal/repository/servicio-cita.repository');

async function testRepositories() {
  console.log('Iniciando pruebas de repositorios\n');

  try {
    // Test ClienteRepository
    console.log('Testing ClienteRepository...');
    const clientes = await clienteRepo.findMany();
    console.log(`findMany(): ${clientes.length} clientes encontrados`);
    
    if (clientes.length > 0) {
      const cliente = await clienteRepo.findById(clientes[0].id_cliente);
      console.log(`findById(): Cliente "${cliente.nombre}" encontrado`);
    }

    // Test AutomovilRepository
    console.log('\nTesting AutomovilRepository...');
    const automoviles = await automovilRepo.findMany();
    console.log(`findMany(): ${automoviles.length} automóviles encontrados`);
    
    if (automoviles.length > 0) {
      const auto = await automovilRepo.findById(automoviles[0].id_auto);
      console.log(`findById(): Automóvil "${auto.marca} ${auto.modelo}" encontrado`);
    }

    // Test ServicioRepository
    console.log('\nTesting ServicioRepository...');
    const servicios = await servicioRepo.findAll();
    console.log(`findAll(): ${servicios.length} servicios encontrados`);
    
    if (servicios.length > 0) {
      const servicio = await servicioRepo.findById(servicios[0].id_servicio);
      console.log(`findById(): Servicio "${servicio.nombre}" encontrado`);
    }

    // Test CitaRepository
    console.log('\nTesting CitaRepository...');
    const citas = await citaRepo.findAll();
    console.log(`findAll(): ${citas.length} citas encontradas`);
    
    if (citas.length > 0) {
      const cita = await citaRepo.findById(citas[0].id_cita);
      console.log(`findById(): Cita encontrada con ${cita.detalles.length} servicios`);
    }

    // Test ServicioCitaRepository
    console.log('\nTesting ServicioCitaRepository...');
    const serviciosCita = await servicioCitaRepo.findAll();
    console.log(`findAll(): ${serviciosCita.length} servicios-cita encontrados`);

    console.log('\nTodas las pruebas pasaron exitosamente');
    
  } catch (err) {
    console.error('\nError en las pruebas:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

testRepositories()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
