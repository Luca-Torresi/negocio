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
    const usuario = useUsuarioStore.getState().usuario;
    
    if (usuario && usuario.idUsuario) {
      config.headers['X-Usuario-ID'] = usuario.idUsuario;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;