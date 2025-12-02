const BASE_URL = 'http://localhost:8000/api'; 

export class HttpAdapter {
    async request(endpoint, method = 'GET', body = null) {
        // Aseguramos que no haya doble slash
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        const url = `${BASE_URL}/${cleanEndpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // USAMOS LA MISMA KEY QUE EL CLIENTE: 'token'
        const token = localStorage.getItem('token'); 

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            
            // Intentamos parsear, si falla devolvemos null (igual que tu ApiClient)
            let data = null;
            try { data = await response.json(); } catch (e) {}

            if (!response.ok) {
                // Manejo de expiración igual que en tu cliente
                if (response.status === 401) {
                    // Si NO es login, borramos token y redirigimos
                    if (!url.includes('auth/login')) {
                        localStorage.removeItem('token');
                        window.location.href = 'login.html';
                        return; // Detenemos ejecución
                    }
                }
                
                const message = (data && (data.message || data.error)) || `Error ${response.status}`;
                throw new Error(message);
            }

            return data;
        } catch (error) {
            console.error(`[API] ${method} ${url}`, error);
            throw error;
        }
    }
}