//Configuracion del controlador para ordenes CHEF 
// El controlador maneja las solicitudes de las rutas (platillosChefRutas.js) y se comunica con el modelo (ordenChefModelo.js)
//Este controlador funciona como la API para platillos (chef)
//realiza las operaciones CRUD definidas en el modelo 


//importacion de modelos a utilizar
//más
// Para la orden
import { obtenerPlatillosChef, actualizarPlatilloChef} from '../Models/ordenChefModelo.js';

import conexionDB from '../config/db.js';


//--------------------- MODIFICAR PLATILLOS PARA PREPARAR -----------------------------------------
export const modificarOrdenChefController = async (req, res) => {
    const conn = await conexionDB.getConnection();
    try {
        const { idPlatilloOrden, estado } = req.body;

        if (!idPlatilloOrden || !estado) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos para modificar Platillos en Chef' });
        }

        const filasAfectadas = await actualizarPlatilloChef(conn, { idPlatilloOrden, estado });

        if (filasAfectadas === 0) {
        return res.status(404).json({ error: 'Platillo no encontrado o sin cambios' });
        }

        res.status(200).json({ message: 'Estado del platillo actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el platillo:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del platillo' });
    } finally {
        conn.release();
    }
};

//--------------------- VISUALIZAR PLATILLOS A PREPARAR -----------------------------------------
export const getPlatillosChefController = async (req, res) => {
    const conn = await conexionDB.getConnection();
    try {
        const platillos = await obtenerPlatillosChef(conn);
        res.status(200).json(platillos);
    } catch (error) {
        console.error('Error al obtener platillos para el chef:', error);
        res.status(500).json({ error: 'Error al obtener los platillos del chef' });
    } finally {
        conn.release();
    }
};
