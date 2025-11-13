// API Client - Cliente HTTP para consumir el backend
class ApiClient {
  constructor(baseURL = 'http://localhost:8000/api') {
    this.baseURL = baseURL;
  }

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

  buildUrl(endpoint = '', params) {
    const target = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseURL}${endpoint}`;
    const url = new URL(target);

    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (Array.isArray(value)) {
          value.forEach((item) => url.searchParams.append(key, item));
        } else {
          url.searchParams.set(key, value);
        }
      });
    }

    return url.toString();
  }

  async get(endpoint, params) {
    const response = await fetch(this.buildUrl(endpoint, params), {
      method: 'GET',
      headers: this.buildHeaders(),
    });
    if (!response.ok) {
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

  async delete(endpoint, params) {
    const response = await fetch(this.buildUrl(endpoint, params), {
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

try {
  console.debug('[api-client] loaded, instance:', apiClient);
  console.debug('[api-client] has get:', typeof apiClient.get === 'function');
} catch (e) {
  // ignore
}

// Exportar la clase y la instancia
export { ApiClient };
export default apiClient;
