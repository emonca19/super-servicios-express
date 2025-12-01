import { BaseService } from "./BaseService.js";

export class AuthService extends BaseService {
    constructor() {
        super('auth'); 
    }

    async login(email, password) {
        try {
            const body = { email, password };
            const response = await this.request('login', 'POST', body);
            const token = response.token || response.accessToken || response.access_token;

            if (token) {
                localStorage.setItem('access_token', token);
                
                if (response.user) {
                    localStorage.setItem('user_data', JSON.stringify(response.user));
                }
                
                return true; 
            }
            
            return false;

        } catch (error) {
            console.error("[AuthService] Error en login:", error);
            throw error; 
        }
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        window.location.href = '/frontend/admin/pages/login.html'; 
    }

    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }
}