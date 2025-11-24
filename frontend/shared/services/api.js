import { AutomovilesService } from "./AutomovilesService";
import { CitasService } from "./CitasService";
import { ClientesService } from "./ClientesService";
import { ServiciosCitaService } from "./ServiciosCitaService";
import { ServiciosService } from "./ServiciosService";

/**
 * wacha, nomas vas a importar esta asi de que api.clientes.obtener() y ya te jala
 */
export const api = {
    clientes: new ClientesService(),
    automoviles: new AutomovilesService(),
    citas: new CitasService(),
    servicios: new ServiciosService(),
    serviciosCita: new ServiciosCitaService()
};