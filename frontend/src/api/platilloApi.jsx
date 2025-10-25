// Archivo para definicion de funciones para Platillos: getPlatillos, CrearPlatillos, etc
// Se reutiliza en todo el programa para llamar esas funciones y no tengamos codigo repetido en todos los archivos

import api from './axiosConfig';

export const getPlatillos = () => api.get('/api/platillos');
export const crearPlatillo = (data) => api.post('/api/platillos', data);
export const modificarPlatillo = (id, data) => api.put(`/api/platillos/${id}`, data);
export const eliminarPlatillo = (id) => api.delete(`/api/platillos/${id}`);
export const getCategoriasPlatillo = () => api.get('/api/categoriasPlatillo');