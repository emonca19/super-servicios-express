import { HttpAdapter } from "./HttpAdapter.js";

/**
 * Clase Genérica CRUD api espero funcione por q si no la verdad me queme el coco
 * en arqui creo me avente una asi espero en js sirva igual
 */
export class BaseService extends HttpAdapter {
    constructor(resourceEndpoint) {
        super();
        this.resource = resourceEndpoint;
    }

    /**
     * Obtener todos los registros
     * @returns {Promise<Array>}
     */
    async obtenerTodos() {
        return this.request(this.resource);
    }

    /**
     * Obtener un registro por ID
     * @param {string|number} id 
     * @returns {Promise<Object>}
     */
    async obtenerPorId(id) {
        if (!id) throw new Error(`ID requerido para obtener ${this.resource}`);
        return this.request(`${this.resource}/${id}`);
    }

    /**
     * Crear un nuevo registro
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    async crear(data) {
        return this.request(this.resource, 'POST', data);
    }

    /**
     * Actualizar un registro existente
     * @param {string|number} id 
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    async actualizar(id, data) {
        if (!id) throw new Error(`ID requerido para actualizar ${this.resource}`);
        return this.request(`${this.resource}/${id}`, 'PUT', data);
    }

    /**
     * Eliminar un registro
     * @param {string|number} id 
     * @returns {Promise<boolean>}
     */
    async eliminar(id) {
        if (!id) throw new Error(`ID requerido para eliminar ${this.resource}`);
        return this.request(`${this.resource}/${id}`, 'DELETE');
    }
}