
import api from './axiosConfig';


export const getProveedores = () => api.get('/api/proveedores');
export const eliminarProveedor = (id) => api.delete(`/api/proveedores/${id}`);
export const modificarProveedor = (id, data) => api.put(`/api/proveedores/${id}`, data);
export const crearProveedor = (data) => api.post('/api/proveedores', data);