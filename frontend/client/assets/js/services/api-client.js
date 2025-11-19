
class ApiClient {
  constructor(baseURL) {
    try {
      const meta = (typeof document !== 'undefined') && document.querySelector('meta[name="api-base"]');
      const metaValue = meta ? meta.getAttribute('content') : null;
      let resolved = baseURL || metaValue || 'http://localhost:8000/api';

      resolved = resolved.replace(/\/$/, '');

      if (typeof window !== 'undefined' && resolved.startsWith('/')) {
        resolved = window.location.origin + resolved;
      }

      this.baseURL = resolved;
    } catch (e) {
      this.baseURL = baseURL || 'http://localhost:8000/api';
    }
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
    let payload = null;
    try { payload = await response.json(); } catch (e) {}
    if (!response.ok) {
      const message = (payload && (payload.message || payload.error)) || response.statusText || `HTTP error ${response.status}`;
      const err = new Error(message);
      err.status = response.status;
      err.body = payload;
      try {
        if (response.status === 401) {
          try { localStorage.removeItem('token'); sessionStorage.removeItem('token'); } catch (e) {}
          try { if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-expired')); } catch (e) {}
        }
      } catch (e) {}
      throw err;
    }
    return payload;
  }

  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    let payload = null;
    try { payload = await response.json(); } catch (e) {  }
    if (!response.ok) {
      let message = response.statusText || `HTTP error ${response.status}`;
      if (payload) {
        if (payload.message) message = payload.message;
        else if (payload.error) message = payload.error;
        else if (Array.isArray(payload.errors) && payload.errors.length) {
          message = payload.errors.map((it) => it.msg || it.message || JSON.stringify(it)).join('; ');
        } else {
          try { message = JSON.stringify(payload); } catch (e) { }
        }
      }
      const err = new Error(message);
      err.status = response.status;
      err.body = payload;
      try {
        if (response.status === 401) {
          try { localStorage.removeItem('token'); sessionStorage.removeItem('token'); } catch (e) {}
          try { if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-expired')); } catch (e) {}
        }
      } catch (e) {}
      console.error('[api-client] HTTP error', response.status, message, payload);
      throw err;
    }
    return payload;
  }

  async put(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    let payload = null;
    try { payload = await response.json(); } catch (e) { }
    if (!response.ok) {
      const message = (payload && (payload.message || payload.error)) || response.statusText || `HTTP error ${response.status}`;
      const err = new Error(message);
      err.status = response.status;
      err.body = payload;
      try {
        if (response.status === 401) {
          try { localStorage.removeItem('token'); sessionStorage.removeItem('token'); } catch (e) {}
          try { if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-expired')); } catch (e) {}
        }
      } catch (e) {}
      throw err;
    }
    return payload;
  }

  async delete(endpoint, params) {
    const response = await fetch(this.buildUrl(endpoint, params), {
      method: 'DELETE',
      headers: this.buildHeaders(),
    });
    let payload = null;
    try { payload = await response.json(); } catch (e) {}
    if (!response.ok) {
      const message = (payload && (payload.message || payload.error)) || response.statusText || `HTTP error ${response.status}`;
      const err = new Error(message);
      err.status = response.status;
      err.body = payload;
      try {
        if (response.status === 401) {
          try { localStorage.removeItem('token'); sessionStorage.removeItem('token'); } catch (e) {}
          try { if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-expired')); } catch (e) {}
        }
      } catch (e) {}
      throw err;
    }
    return payload;
  }
}

const apiClient = new ApiClient();

try {
  console.debug('[api-client] loaded, instance:', apiClient);
  console.debug('[api-client] has get:', typeof apiClient.get === 'function');
} catch (e) {
}

export { ApiClient };
export default apiClient;
