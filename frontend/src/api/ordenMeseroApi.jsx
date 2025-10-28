// Archivo para definicion de funciones para Ordenes de Mesero
// Se reutiliza en todo el programa para llamar esas funciones y no tengamos codigo repetido en todos los archivos

import api from './axiosConfig';

// ---------------- ORDENES ----------------
export const getOrdenes = () => api.get('/api/ordenes');                                 // Obtener todas las ordenes
export const crearOrden = (data) => api.post('/api/ordenes', data);                     // Crear orden
export const modificarOrden = (id, data) => api.put(`/api/ordenes/${id}`, data);        // Modificar orden
export const finalizarOrden = (idOrden) => api.put(`/api/ordenes/${idOrden}/finalizar`); // Finalizar orden y liberar mesa


// ---------------- PLATILLOS DE ORDEN ----------------
export const getPlatillosOrden = (idOrden) => api.get(`/api/ordenes/${idOrden}/platillos`);                  // Obtener platillos de la orden
export const agregarPlatilloOrden = (idOrden, data) => api.post(`/api/ordenes/${idOrden}/platillos`, data);  // Agregar platillo a la orden
export const actualizarPlatilloOrden = (idOrden, idPlatillo, data) => api.put(`/api/ordenes/${idOrden}/platillos/${idPlatillo}`, data); // Actualizar platillo de la orden
export const eliminarPlatilloOrden = (idOrden, idPlatillo) => api.delete(`/api/ordenes/${idOrden}/platillos/${idPlatillo}`);             // Eliminar platillo de la orden

//Mesa 
export const getMesas = () => api.get('/api/mesas');
