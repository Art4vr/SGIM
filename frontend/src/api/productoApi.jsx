// Archivo para definicion de funciones para Productos: getProductos, CrearProductos, etc
// Se reutiliza en todo el programa para llamar esas funciones y no tengamos codigo repetido en todos los archivos


import api from './axiosConfig';

export const getProductos = () => api.get('/api/productos');
export const crearProducto = (data) => api.post('/api/productos', data);
export const modificarProducto = (id, data) => api.put(`/api/productos/${id}`, data);
export const eliminarProducto = (id) => api.delete(`/api/productos/${id}`);
export const getCategorias = () => api.get('/api/categorias');
export const getUnidades = () => api.get('/api/unidades');