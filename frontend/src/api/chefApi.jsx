// Archivo para definicion de funciones para Ordenes de Chef
// Se reutiliza en todo el programa para llamar esas funciones y no tengamos codigo repetido en todos los archivos

import api from './axiosConfig';

// Obtener todos los platillos que el chef debe preparar
export const getPlatillosChef = () => api.get('/api/ordenesChef/platillos');

// Actualizar el estado de un platillo
export const actualizarPlatilloChef = (data) => api.put('/api/ordenesChef/platillos', data);