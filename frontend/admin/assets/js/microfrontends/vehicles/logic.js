export const VehiclesLogic = {

  async fetchVehicles() {
    return [
      {
        id: 1,
        marca: "Honda",
        modelo: "Civic",
        placas: "ABC-1234",
        propietario: "Juan García",
        color: "Gris Plata",
        anio: "2020"
      },
      {
        id: 2,
        marca: "Ford",
        modelo: "F-150",
        placas: "XYZ-5678",
        propietario: "María López",
        color: "Rojo",
        anio: "2022"
      },
      {
        id: 3,
        marca: "Toyota",
        modelo: "Corolla",
        placas: "MNO-9012",
        propietario: "Carlos Méndez",
        color: "Blanco",
        anio: "2021"
      },
      {
        id: 4,
        marca: "Nissan",
        modelo: "Sentra",
        placas: "DEF-3456",
        propietario: "Ana Rodríguez",
        color: "Azul",
        anio: "2023"
      },
      {
        id: 5,
        marca: "Chevrolet",
        modelo: "Cruze",
        placas: "GHI-7890",
        propietario: "Roberto Silva",
        color: "Negro",
        anio: "2019"
      }
    ];
  },

  filter(list, text) {
    if (!text) return list;

    const q = text.toLowerCase().trim();

    return list.filter(v =>
      [
        v.marca,
        v.modelo,
        v.placas,
        v.propietario,
        v.color,
        v.anio
      ]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(q))
    );
  }
};