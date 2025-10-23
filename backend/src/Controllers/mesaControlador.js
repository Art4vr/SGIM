//Configuracion del controlador para las mesas del restaurante
//Este controlador funciona como la API para las mesas
// El controlador maneja las solicitudes de las rutas (mesaRutas.js) y se comunica con el modelo (mesaModelo.js)

import { obtenerMesa } from '../Models/mesaModelo.js';

//Obtener mesas para uso en tabla de orden

export const listaMesasController = async (req, res) => {
    try {
        const mesa = await obtenerMesa();
        res.json(mesa);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener mesas' });
    }
}
