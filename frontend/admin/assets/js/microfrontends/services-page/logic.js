// Logica para manejar servicios en la pagina
export const ServicesLogic = {

  // Funcion que obtiene la lista de servicios
  // Aqui se usa una lista fija simulando datos reales
  async fetchServices() {
    return [
      {
        id: 1,
        nombre: "Cambio de Aceite",
        descripcion: "Cambio completo de aceite y filtros",
        duracion: "45 min",
        precio: "$45.00",
        disponible: true
      },
      {
        id: 2,
        nombre: "Mantenimiento General",
        descripcion: "Revision completa del vehiculo",
        duracion: "2 hrs",
        precio: "$120.00",
        disponible: true
      },
      {
        id: 3,
        nombre: "Sistema Electrico",
        descripcion: "Diagnostico y reparacion de sistema electrico",
        duracion: "1–3 hrs",
        precio: "$150.00",
        disponible: true
      },
      {
        id: 4,
        nombre: "Frenos y Suspension",
        descripcion: "Revision y cambio de pastillas y amortiguadores",
        duracion: "1.5 hrs",
        precio: "$95.00",
        disponible: true
      },
      {
        id: 5,
        nombre: "Balanceo",
        descripcion: "Balanceo de ruedas del vehiculo",
        duracion: "30 min",
        precio: "$35.00",
        disponible: false
      }
    ];
  },

  // Funcion para filtrar servicios segun texto ingresado
  filter(services, text) {
    if (!text) return services;

    const q = text.toLowerCase().trim();

    // Busca coincidencias en nombre, descripcion, duracion o precio
    return services.filter(s =>
      [
        s.nombre,
        s.descripcion,
        s.duracion,
        s.precio
      ]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(q))
    );
  }

};
