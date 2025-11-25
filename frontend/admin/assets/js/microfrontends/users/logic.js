export const ClientsLogic = {
  
  async fetchClients() {
    return [
      {
        id: 1,
        nombre: "Juan García",
        telefono: "(+52) 644-123-4567",
        email: "juan@email.com",
        vehiculos: "2 vehículos",
        ultimasCitas: "15 Nov 2025"
      },
      {
        id: 2,
        nombre: "María López",
        telefono: "(+52) 644-987-6543",
        email: "maria@email.com",
        vehiculos: "1 vehículo",
        ultimasCitas: "10 Nov 2025"
      },
      {
        id: 3,
        nombre: "Carlos Ruiz",
        telefono: "(+52) 644-456-7890",
        email: "carlos@email.com",
        vehiculos: "3 vehículos",
        ultimasCitas: "08 Nov 2025"
      },
      {
        id: 4,
        nombre: "Ana Martínez",
        telefono: "(+52) 644-321-0987",
        email: "ana@email.com",
        vehiculos: "1 vehículo",
        ultimasCitas: "05 Nov 2025"
      },
      {
        id: 5,
        nombre: "Roberto Silva",
        telefono: "(+52) 644-654-3210",
        email: "roberto@email.com",
        vehiculos: "2 vehículos",
        ultimasCitas: "03 Nov 2025"
      }
    ];
  },

  filter(clients, searchText) {
  if (!searchText) return clients;

  const q = searchText.toLowerCase().trim();

  return clients.filter(c => {
    return [
      c.nombre,
      c.telefono,
      c.email,
      c.vehiculos,
      c.ultimasCitas
    ]
    .filter(Boolean) // elimina undefined/null
    .some(field => field.toLowerCase().includes(q));
  });
}

};