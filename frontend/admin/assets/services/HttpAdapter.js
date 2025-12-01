const BASE_URL = 'http://localhost:8000/api'; // Asegúrate que sea el puerto correcto

export class HttpAdapter {
    async request(endpoint, method = 'GET', body = null) {
        const url = `${BASE_URL}/${endpoint}`;
        
        // 1. Preparamos los headers base
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // 2. BUSCAMOS EL TOKEN (Ajusta la key 'access_token' si usas otro nombre)
        const token = localStorage.getItem('access_token'); 

        // 3. Si existe el token, lo inyectamos en la cabecera Authorization
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers // Usamos los headers que acabamos de configurar
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);

            // 4. Manejo especial para error 401 (Token vencido o inválido)
            if (response.status === 401 && !endpoint.includes('login')) {
                console.warn("Sesión expirada. Redirigiendo...");
                throw new Error("Sesión expirada.");
            }

            if (!response.ok) {
                // Leemos el cuerpo del error
                const errorData = await response.json().catch(() => null);
                
                // 🔥 ESTO ES LO IMPORTANTE: Imprimimos el error real del backend
                console.group("🔥 DEBUG ERROR BACKEND");
                console.log("Status:", response.status);
                console.log("Respuesta del servidor:", errorData);
                console.groupEnd();

                // Construimos un mensaje más útil
                const errorMessage = errorData?.message || errorData?.error || "Error desconocido del servidor";
                
                // Si es 401 y estamos en login, lanzamos el error con el mensaje del backend
                if (response.status === 401) {
                    throw new Error(errorMessage); 
                }
                
                throw new Error(errorMessage);
            }

            if (response.status === 204) return true;
            return await response.json();

        } catch (error) {
            console.error(`[API Error]`, error);
            throw error;
        }
    }
}