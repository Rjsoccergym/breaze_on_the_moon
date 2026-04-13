import axios from 'axios';

// 1. Configuración de la instancia base
const apiClient = axios.create({
  // Puerto 8081 mapeado al API Gateway en Docker
  baseURL: 'http://localhost:8081/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor de Peticiones (Para enviar el Token JWT)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('breaze_token');
    if (token) {
      // Inyectamos el token en la cabecera de todas las peticiones
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de Respuestas (Para manejar errores de sesión)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el backend nos dice que el token ya no es válido (401)
    if (error.response && error.response.status === 401) {
      console.error("Sesión expirada. Redirigiendo al login...");
      localStorage.removeItem('token');
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;