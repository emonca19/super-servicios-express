import { BaseService } from "./BaseService.js";

export class AuthService extends BaseService {
    constructor() {
        // Esto hace que las peticiones vayan a BASE_URL + /auth
        super('auth'); 
    }

    async login(email, password) {
        try {
            // Petición a: http://localhost:8000/api/auth/login
            const response = await this.request('auth/login', 'POST', { email, password });

            // Tu backend devuelve: { data: { token: '...' } } o directamente { token: '...' }
            // El código del cliente maneja ambos casos, hagamos lo mismo aquí:
            const token = response.token || (response.data && response.data.token);

            if (token) {
                localStorage.setItem('token', token);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error("Login fallido:", error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}