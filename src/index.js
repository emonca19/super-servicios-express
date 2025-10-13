// src/index.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ClienteRepository = require('./dal/repository/ClienteRepository');   
const AutomovilRepository = require('./dal/repository/AutomovilRepository'); 
const CitaRepository = require('./dal/repository/CitaRepository'); // tu repo
const ServicioCitaRepository = require('./dal/repository/ServicioCitaRepository'); // tu repo

async function main() {
  try {
    const cliente = await ClienteRepository.crear({
      nombre: 'Jesus Guzman',
      telefono: '644198312',
      email: `jesusGuzman+${Date.now()}@mail.com`,
      direccion: 'Ciudad Obregon',
    });
    console.log('Cliente creado:', cliente);

    const automovil = await AutomovilRepository.crear({
      marca: 'Toyota',
      modelo: 'Yaris',
      anio: 2009,
      color: 'Blanco',
      placas: `Sonora${Math.floor(Math.random() * 900) + 100}`,
      numero_serie: `VIN${Date.now()}`,
      id_cliente: cliente.id_cliente, 
    });
    console.log('Automóvil creado:', automovil);

    const clienteConAutos = await ClienteRepository.obtenerPorId(cliente.id_cliente);
    console.log('Cliente con autos:', {
      id: clienteConAutos.id_cliente,
      nombre: clienteConAutos.nombre,
      autos: (clienteConAutos.automoviles || []).length,
    });

    const porPlacas = await AutomovilRepository.obtenerPorPlacas(automovil.placas);
    console.log('Auto por placas ->', porPlacas?.id_auto);

    const cita = await CitaRepository.crear({
      inicio: new Date(),
      fin: new Date(Date.now() + 60 * 60 * 1000), 
      estado: 'Pendiente',
      motivo: 'Cambio de aceite',
      observaciones: 'Cliente solicita aceite sintético',
      id_cliente: cliente.id_cliente,
      id_auto: automovil.id_auto,
    });
    console.log('Cita creada:', cita);

    const citaObtenida = await CitaRepository.obtenerPorId(cita.id_cita);
    console.log('Cita obtenida:', citaObtenida);

    const servicioCita = await ServicioCitaRepository.agregarServicioACita(
      cita.id_cita,
      1, 
      {
        notas: 'Aplicar lubricante premium',
        suministros: 'Aceite sintético, filtro',
        precio_por_servicio: 500.00
      }
    );
    console.log('ServicioCita creado:', servicioCita);

    const servicioCitaObtenido = await ServicioCitaRepository.obtenerPorId(servicioCita.id_detalleCita);
    console.log('ServicioCita obtenido:', servicioCitaObtenido);


  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
