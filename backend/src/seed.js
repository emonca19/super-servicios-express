const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ClienteRepository = require('./dal/repository/cliente.repository');   
const AutomovilRepository = require('./dal/repository/automovil.repository'); 
const ServicioRepository = require('./dal/repository/servicio.repository');
const CitaRepository = require('./dal/repository/cita.repository');
const ServicioCitaRepository = require('./dal/repository/servicio-cita.repository');

const clienteRepo = new ClienteRepository();
const automovilRepo = new AutomovilRepository();
const servicioRepo = new ServicioRepository();
const citaRepo = new CitaRepository();
const servicioCitaRepo = new ServicioCitaRepository();

async function main() {
  try {
    console.log('Starting database seed...\n');

    const cliente = await clienteRepo.create({
      nombre: 'Jesus Guzman',
      telefono: '644198312',
      email: `jesusGuzman+${Date.now()}@mail.com`,
      direccion: 'Ciudad Obregon',
    });
    console.log('Cliente creado:', cliente);

    const automovil = await automovilRepo.create({
      marca: 'Toyota',
      modelo: 'Yaris',
      anio: 2009,
      color: 'Blanco',
      placas: `Sonora${Math.floor(Math.random() * 900) + 100}`,
      numero_serie: `VIN${Date.now()}`,
      id_cliente: cliente.id_cliente, 
    });
    console.log('Automóvil creado:', automovil);

    const clienteConAutos = await clienteRepo.findById(cliente.id_cliente);
    console.log('Cliente con autos:', {
      id: clienteConAutos.id_cliente,
      nombre: clienteConAutos.nombre,
      autos: (clienteConAutos.automoviles || []).length,
    });

    const porPlacas = await automovilRepo.findByPlacas(automovil.placas);
    console.log('Auto encontrado por placas ->', porPlacas?.id_auto);

    const servicio = await servicioRepo.create({
      nombre: 'Cambio de Aceite',
      descripcion: 'Cambio de aceite y filtro',
      duracion_estimada: 30,
      precio_con_utilidad: 500.00
    });
    console.log('Servicio creado:', servicio);

    const cita = await citaRepo.create({
      inicio: new Date(),
      fin: new Date(Date.now() + 60 * 60 * 1000), 
      estado: 'Pendiente',
      motivo: 'Cambio de aceite',
      observaciones: 'Cliente solicita aceite sintético',
      id_cliente: cliente.id_cliente,
      id_auto: automovil.id_auto,
    });
    console.log(' Cita creada:', cita);

    const citaObtenida = await citaRepo.findById(cita.id_cita);
    console.log('Cita obtenida:', citaObtenida?.id_cita);

    const servicioCita = await servicioCitaRepo.addServiceToAppointment(
      cita.id_cita,
      servicio.id_servicio, 
      {
        notas: 'Aplicar lubricante premium',
        suministros: 'Aceite sintético, filtro',
        precio_por_servicio: 500.00
      }
    );
    console.log('ServicioCita creado:', servicioCita);

    const servicioCitaObtenido = await servicioCitaRepo.findById(servicioCita.id_detalleCita);
    console.log('ServicioCita obtenido:', servicioCitaObtenido?.id_detalleCita);

    console.log('\nSeed completed successfully!');

  } catch (e) {
    console.error('Error during seed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed');
  }
}

main();
