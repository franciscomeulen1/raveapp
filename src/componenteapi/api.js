// api.js
import axios from 'axios';

// Configurar la instancia base de axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '', // Puedes definir la URL base en una variable de entorno
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    // Si no hay token, hacemos el login automáticamente
    if (!token) {
      try {
        const response = await axios.post('http://144.22.158.49:8080/v1/Security/Login', {
          usuario: '',   // Credenciales internas
          pass: ''
        });
        token = response.data.token;
        localStorage.setItem('token', token);
      } catch (error) {
        console.error('Error en el login automático:', error);
        // Aquí podrías manejar el error, por ejemplo, redirigir a una página de error o notificar al usuario
        return Promise.reject(error);
      }
    }
    // Agregar el token al header de la request
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
