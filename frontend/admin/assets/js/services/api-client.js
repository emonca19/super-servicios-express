// assets/js/services/api-client.js

const API_BASE =
  document.querySelector('meta[name="api-base"]')?.content ||
  "http://localhost:8000/api";

/**
 * Wrapper sobre fetch para la API del taller
 */
export async function apiFetch(path, options = {}) {
  const base = API_BASE.replace(/\/+$/, "");  // quita slashes al final
  const url = base + path;                   // ej: /clientes, /clientes/1

  const {
    method = "GET",
    body,
    headers = {},
    ...rest
  } = options;

  const finalOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    // credentials: "include",  // si luego usas cookies/sesiones
    ...rest,
  };

  const res = await fetch(url, finalOptions);

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      if (errBody?.message) msg = errBody.message;
    } catch (_) {
      // ignorar
    }
    throw new Error(msg);
  }

  if (res.status === 204) return null;

  try {
    return await res.json();
  } catch (_) {
    return null;
  }
}
