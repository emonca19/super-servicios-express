// src/index.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ClienteRepository = require('./dal/repository/ClienteRepository');   // tu repo
const AutomovilRepository = require('./dal/repository/AutomovilRepository'); // el de arriba

async function main() {
  try {
    
    const cliente = await ClienteRepository.crear({
      nombre: 'Jesus Guzman',
      telefono: '644198312',
      email: `jesusGuzman+${Date.now()}@mail.com`,
      direccion: 'Ciudad obregon',
    });
    console.log(' Cliente creado:', cliente);

    
    const automovil = await AutomovilRepository.crear({
      marca: 'Toyota',
      modelo: 'Yaris',
      anio: 2009,
      color: 'Blanco',
      placas: `Sonora${Math.floor(Math.random() * 900) + 100}`,
      numero_serie: `VIN${Date.now()}`,
      id_cliente: cliente.id_cliente, 
    });
    console.log(' Automóvil creado:', automovil);

   
    const clienteConAutos = await ClienteRepository.obtenerPorId(cliente.id_cliente);
    console.log('Cliente con autos:', {
      id: clienteConAutos.id_cliente,
      nombre: clienteConAutos.nombre,
      autos: (clienteConAutos.automoviles || []).length,
    });

   
    const porPlacas = await AutomovilRepository.obtenerPorPlacas(automovil.placas);
    console.log('Auto por placas ->', porPlacas?.id_auto);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
