// src/api/axiosConfig.js
import axios from 'axios';


// Crea una instancia personalizada de Axios para centralizar la configuración de las peticiones
const api = axios.create({ 
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000', // Define la URL base para todas las peticiones.
    withCredentials: true // habilita el envío de cookies httpOnly
});

export default api;
