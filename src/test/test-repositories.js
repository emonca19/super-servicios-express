/**
 * Script de prueba para todos los repositorios
 * Ejecutar con: node src/test/test-repositories.js
 */

const ClienteRepository = require('../dal/repository/cliente.repository');
const AutomovilRepository = require('../dal/repository/automovil.repository');
const ServicioRepository = require('../dal/repository/servicio.repository');
const CitaRepository = require('../dal/repository/cita.repository');
const ServicioCitaRepository = require('../dal/repository/servicio-cita.repository');

const clienteRepo = new ClienteRepository();
const automovilRepo = new AutomovilRepository();
const servicioRepo = new ServicioRepository();
const citaRepo = new CitaRepository();
const servicioCitaRepo = new ServicioCitaRepository();

async function testRepositories() {
  console.log('Iniciando pruebas de repositorios\n');

  try {
    // Test ClienteRepository
    console.log('Testing ClienteRepository...');
    const clientes = await clienteRepo.findAll();
    console.log(`findAll(): ${clientes.length} clientes encontrados`);
    
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
