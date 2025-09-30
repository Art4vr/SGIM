//Configuracion del controlador para las unidades de medida de los productos
//Este controlador funciona como la API para las unidades de medida
// El controlador maneja las solicitudes de las rutas (medidaRutas.js) y se comunica con el modelo (medidaModelo.js)
//realiza las operaciones CRUD definidas en el modelo sobre la BD

import { obtenerMedidas } from '../Models/medidaModelo.js';

export const listaMedidasController = async (req, res) => {
    try {
        const medidas = await obtenerMedidas();
        res.json(medidas);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener unidades de medida' });
    }
}
