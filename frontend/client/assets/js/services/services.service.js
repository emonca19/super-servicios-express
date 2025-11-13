
import apiClient from './api-client.js';

class ServicesService {
  constructor() {
    this.apiClient = apiClient;
    this.cache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos

    console.log('✅ ServicesService inicializado (clean)');
  }

  async getAll(filters = {}) {
    try {
      const cacheKey = 'services_all';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

  const services = await this.apiClient.get('/servicios', filters);
      this.setCache(cacheKey, services);
      return services;
    } catch (error) {
      console.error('[ServicesService] getAll error:', error);
      throw new Error('No se pudieron cargar los servicios');
    }
  }

  async getById(id) {
    try {
      const cacheKey = `service_${id}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

  const service = await this.apiClient.get(`/servicios/${id}`);
      this.setCache(cacheKey, service);
      return service;
    } catch (error) {
      console.error('[ServicesService] getById error:', error);
      throw new Error('No se pudo cargar el servicio');
    }
  }

  async getPopular(limit = 3) {
    try {
      const all = await this.getAll();
      return Array.isArray(all) ? all.slice(0, limit) : [];
    } catch (error) {
      console.error('[ServicesService] getPopular error:', error);
      throw error;
    }
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clearCache() {
    this.cache.clear();
  }
}

export { ServicesService };
export default ServicesService;
