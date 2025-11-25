const BASE_URL = 'http://localhost:3001/api';

class HttpAdapter {
    async request(endpoint, method = 'GET', body = null) {
        const url = `${BASE_URL}/${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);

            // Manejo centralizado de errores
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            // Manejo de respuestas vacías (ej: 204 No Content en DELETE)
            if (response.status === 204) return true;

            return await response.json();
        } catch (error) {
            console.error(`[API Error] ${method} ${url}:`, error);
            throw error;
        }
    }
}