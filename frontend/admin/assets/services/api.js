import { AutomovilesService } from "./AutomovilesService.js";
import { CitasService } from "./CitasService.js";
import { ClientesService } from "./ClientesService.js";
import { ServiciosCitaService } from "./ServiciosCitaService.js";
import { ServiciosService } from "./ServiciosService.js";
import { AuthService } from "./AuthService.js";

/**
 * wacha, nomas vas a importar esta asi de que api.clientes.obtener() y ya te jala
 */
export const api = {
    clientes: new ClientesService(),
    automoviles: new AutomovilesService(),
    citas: new CitasService(),
    servicios: new ServiciosService(),
    serviciosCita: new ServiciosCitaService(),
    auth: new AuthService()
};