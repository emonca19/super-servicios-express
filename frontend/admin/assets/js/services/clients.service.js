// assets/js/services/clients.service.js
import { apiFetch } from "./api-client.js";

export const ClientsService = {
  // GET /clientes
  list() {
    return apiFetch("/clientes");
  },

  // GET /clientes/:id
  get(id) {
    return apiFetch(`/clientes/${id}`);
  },

  // POST /clientes
  create(payload) {
    // payload = { nombre, telefono, email, direccion }
    return apiFetch("/clientes", {
      method: "POST",
      body: payload,
    });
  },

  // PUT o PATCH /clientes/:id
  update(id, payload) {
    return apiFetch(`/clientes/${id}`, {
      method: "PUT",
      body: payload,
    });
  },

  // DELETE /clientes/:id
  remove(id) {
    return apiFetch(`/clientes/${id}`, {
      method: "DELETE",
    });
  },
};
