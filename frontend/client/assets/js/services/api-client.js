// API Client - Cliente HTTP para consumir el backend
class ApiClient {
  constructor(baseURL = 'http://localhost:8000/api') {
    this.baseURL = baseURL;
  }

  // Token helpers (simple: prefer localStorage, fallback to sessionStorage)
  getToken() {
    try {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    } catch (e) {
      return null;
    }
  }

  buildHeaders(extra = {}) {
    const headers = { ...extra };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.buildHeaders(),
    });
    if (!response.ok) {
      // Let caller inspect status if needed
      const err = new Error(`HTTP error! status: ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  }

  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = new Error(`HTTP error! status: ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  }

  async put(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = new Error(`HTTP error! status: ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  }

  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.buildHeaders(),
    });
    if (!response.ok) {
      const err = new Error(`HTTP error! status: ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  }
}

// Crear una instancia singleton
const apiClient = new ApiClient();

// Debug
try {
  console.debug('[api-client] loaded, instance:', apiClient);
  console.debug('[api-client] has get:', typeof apiClient.get === 'function');
} catch (e) {
  // ignore
}

// Exportar la clase y la instancia
export { ApiClient };
export default apiClient;
