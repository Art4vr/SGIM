//Configuracion del controlador para los roles asignados a los usuarios
//Este controlador funciona como la API para los roles
// El controlador maneja las solicitudes de las rutas y se comunica con el modelo (rolModelo.js)

import { obtenerRol } from '../Models/rolModelo.js';

//Obtener categoría para uso en otras tablas
export const listaRolesController = async (req, res) => {
    try {
        const roles = await obtenerRol();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al consultar roles' });
    }
}   

