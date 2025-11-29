import axios from 'axios';

// api.js es una instancia de axios

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
});

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    if (!token) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/Security/Login`,
          {
            usuario: process.env.REACT_APP_API_USER,
            pass: process.env.REACT_APP_API_PASS,
          }
        );
        token = response.data.token;
        localStorage.setItem('token', token);
      } catch (error) {
        console.error('Error en el login automático:', error);
        return Promise.reject(error);
      }
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;


