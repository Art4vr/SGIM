//Configuracion del controlador para ordenes
// El controlador maneja las solicitudes de las rutas (ordenMeseroRutas.js) y se comunica con el modelo (ordenModelo.js)
//Este controlador funciona como la API para ordenes (mesero)
//realiza las operaciones CRUD definidas en el modelo 

//--------------------- AGREGAR ORDEN -----------------------------------------
// Controlador para dar de alta una orden

//importacion de modelos a utilizar
//más
// Para la orden
import { agregarOrden, actualizarOrden } from '../Models/ordenMeseroModelo.js';
//Para el cambio del estado de la mesa
import {actualizarMesa} from '../Models/mesaModelo.js';
import conexionDB from '../config/db.js';

export const agregarOrdenController = async (req, res) => {
    const conn = await conexionDB.getConnection();
    try {
        const { idUsuario, idMesa } = req.body;

        if (!idUsuario || !idMesa) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        // Validar existencia de mesa
        const [mesa] = await conn.execute('SELECT idMesa FROM Mesa WHERE idMesa = ?', [idMesa]);
        if (mesa.length === 0) {
            return res.status(400).json({ mensaje: 'Mesa no válida' });
        }
        //Iniciar transaccion al crear orden y actualizar la mesa
        await conn.beginTransaction();

        // Crear orden
        const nuevoId = await agregarOrden(conn, { idUsuario, idMesa });

        // Actualizar estado de mesa
        await actualizarMesa(conn, { idMesa, estado: 'ocupada' });

        // Hacer un commit si todo sale bien
        await conn.commit();

        res.status(201).json({
            mensaje: 'Orden creada y mesa actualizada con éxito',
            ordenId: nuevoId,
            mesaId: idMesa
        });

    } catch (err) {
        // Hacer un rollback si algo falla 
        await conn.rollback();
        console.error('Error en agregarOrdenController:', err);
        res.status(500).json({
            mensaje: err.message || 'Error en el servidor'
        });
    } finally {
        //Liberar la conexion
        conn.release();
    }
};


//--------------------- MODIFICAR ORDEN-----------------------------------------
// Controlador para modificar una orden (dar como finalizada la orden y cambio de estado de Mesa)
export const modificarOrdenController = async (req, res) => {
    const conn = await conexionDB.getConnection();
    try {
        const { id } = req.params;
        const { idOrden, estado, total } = req.body;

        // Validación obligatoria: id
        if (!id) {
            return res.status(400).json({ mensaje: 'El id de la orden es obligatorio' });
        }

        // Iniciar transacción
        await conn.beginTransaction();

        // Obtener la orden para saber a qué mesa pertenece
        const [ordenRows] = await conn.execute(
            'SELECT Mesa_idMesa, estado FROM Orden WHERE idOrden = ?',
            [id]
        );

        const idMesa = ordenRows[0].idMesa;

        // Actualizar la orden (solo campos enviados)
        const filasAfectadas = await actualizarOrden({ idOrden: id, estado, total });

        if (filasAfectadas === 0) {
            await conn.rollback();
            return res.status(404).json({ mensaje: 'No se realizaron cambios en la orden' });
        }

        // Si el estado cambia a "cerrada", liberar la mesa
        if (estado && ['cerrada'].includes(estado)) {
            await actualizarMesa(conn, { idMesa, estado: 'disponible' });
        }

        await conn.commit();

        res.json({
            mensaje: 'Orden y mesa actualizadas correctamente',
            filasAfectadas
        });

    } catch (err) {
        console.error('Error en modificarOrdenController:', err);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};


//--------------------- OBTENER TODAS LAS ORDENES-----------------------------------------
export const obtenerOrdenesController = async (req, res) => {
    
    try {
        const [ordenes] = await conexionDB.execute(`
            SELECT o.idOrden, o.total, o.estado,
                c.usuario AS usuario,
                u.mesa AS mesa
            FROM Orden o
            JOIN Usuario c ON o.Usuario_idUsuario = c.idUsuario
            JOIN Mesa u ON o.Mesa_idMesa = u.idMesa
        `);
        res.json(ordenes);
    } catch (err) {
        console.error('Error SQL obtenerOrdenesController:', err);
        res.status(500).json({ mensaje: 'Error al obtener Ordenes' });
    }
};