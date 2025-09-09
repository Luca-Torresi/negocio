// src/api/apiClient.ts
import axios from 'axios';
import { useUsuarioStore } from '../../store/usuarioStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// --- INTERCEPTOR DE PETICIONES ---
apiClient.interceptors.request.use(
  (config) => {
    // Obtenemos el estado más reciente del store
    const usuario = useUsuarioStore.getState().usuario;
    
    // Si hay un usuario logueado, añadimos su ID a las cabeceras
    if (usuario && usuario.id) {
      config.headers['X-Usuario-ID'] = usuario.id;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;