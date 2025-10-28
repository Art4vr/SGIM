//Configuracion del controlador para ordenes
// El controlador maneja las solicitudes de las rutas (ordenMeseroRutas.js) y se comunica con el modelo (ordenModelo.js)
//Este controlador funciona como la API para ordenes (mesero)
//realiza las operaciones CRUD definidas en el modelo 

//--------------------- AGREGAR ORDEN -----------------------------------------
// Controlador para dar de alta una orden

//importacion de modelos a utilizar
//más
// Para la orden
import { agregarOrden, actualizarOrden,finalizarOrden } from '../Models/ordenMeseroModelo.js';
import { actualizarMesa } from '../Models/mesaModelo.js';
import { obtenerPlatillosOrden } from '../Models/ordenPlatilloModelo.js';

import conexionDB from '../config/db.js';

//--------------------- AGREGAR ORDEN -----------------------------------------
export const agregarOrdenController = async (req, res) => {
    const conn = await conexionDB.getConnection();
    try {
        const { idUsuario, idMesa } = req.body;
        if (!idUsuario || !idMesa)
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });

        const [mesa] = await conn.execute('SELECT idMesa FROM Mesa WHERE idMesa = ?', [idMesa]);
        if (mesa.length === 0)
            return res.status(400).json({ mensaje: 'Mesa no válida' });

        await conn.beginTransaction();

        const nuevoId = await agregarOrden(conn, { idUsuario, idMesa });
        await actualizarMesa(conn, { idMesa, estado: 'ocupada' });

        await conn.commit();
        res.status(201).json({
            mensaje: 'Orden creada y mesa actualizada con éxito',
            ordenId: nuevoId,
            mesaId: idMesa
        });

    } catch (err) {
        await conn.rollback();
        console.error('Error al agregar orden:', err);
        res.status(500).json({ mensaje: 'Error en agregar orden' });
    } finally {
        conn.release();
    }
};

//--------------------- MODIFICAR ORDEN -----------------------------------------
export const modificarOrdenController = async (req, res) => {
    const conn = await conexionDB.getConnection();
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!id)
            return res.status(400).json({ mensaje: 'El id de la orden es obligatorio' });

        await conn.beginTransaction();

        // Obtener la mesa asociada a la orden
        const [ordenRows] = await conn.execute(
            'SELECT Mesa_idMesa FROM Orden WHERE idOrden = ?',
            [id]
        );

        if (ordenRows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ mensaje: 'Orden no encontrada' });
        }

        const idMesa = ordenRows[0].Mesa_idMesa;

        // Calcular total automáticamente
        const platillos = await obtenerPlatillosOrden(conn, id);
        const totalCalculado = platillos.reduce(
            (acc, p) => acc + p.cantidad * p.precioUnitario,
            0
        );

        // Actualizar orden
        const filasAfectadas = await actualizarOrden(conn, {
            idOrden: id,
            estado,
            total: totalCalculado
        });

        // Liberar mesa si la orden se cierra
        if (estado && estado.toLowerCase() === 'cerrada') {
            await actualizarMesa(conn, { idMesa, estado: 'disponible' });
        }

        await conn.commit();
        res.json({
            mensaje: 'Orden y mesa actualizadas correctamente',
            filasAfectadas,
            total: totalCalculado
        });

    } catch (err) {
        await conn.rollback();
        console.error('Error al modificar orden:', err);
        res.status(500).json({ mensaje: 'Error en modificar orden' });
    } finally {
        conn.release();
    }
};

//--------------------- OBTENER TODAS LAS ORDENES -----------------------------------------
export const obtenerOrdenesController = async (req, res) => {
    try {
        const [ordenes] = await conexionDB.execute(`
            SELECT o.idOrden, o.total, o.estado,
                u.nombre AS usuario,
                m.numeroMesa AS mesa
            FROM Orden o
            JOIN Usuario u ON o.Usuario_idUsuario = u.idUsuario
            JOIN Mesa m ON o.Mesa_idMesa = m.idMesa
        `);
        res.json(ordenes);
    } catch (err) {
        console.error('Error al obtener órdenes:', err);
        res.status(500).json({ mensaje: 'Error al obtener órdenes' });
    }
};

// --------------------- FINALIZAR ORDEN --------------------------
export const finalizarOrdenController = async (req, res) => {
    const conn = await conexionDB.getConnection();
    try {
        const { idOrden } = req.params;

        // Obtener idMesa asociado a la orden
        const [ordenRows] = await conn.execute('SELECT Mesa_idMesa FROM Orden WHERE idOrden = ?', [idOrden]);
        if (ordenRows.length === 0) return res.status(404).json({ mensaje: 'Orden no encontrada' });

        const idMesa = ordenRows[0].Mesa_idMesa;

        await finalizarOrden(conn, idOrden, idMesa);

        res.json({ mensaje: 'Orden finalizada y mesa liberada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: 'Error al finalizar la orden' });
    } finally {
        conn.release();
    }
};