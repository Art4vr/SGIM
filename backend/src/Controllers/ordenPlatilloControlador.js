//Configuracion del controlador para platillos en orden
// El controlador maneja las solicitudes de las rutas (ordenPlatilloRutas.js) y se comunica con el modelo (ordenPlatilloModelo.js)
//Este controlador funciona como la API para ordenes Platillos (mesero)
//realiza las operaciones CRUD definidas en el modelo 

//--------------------- AGREGAR PLATILLO EN ORDEN -----------------------------------------
// Controlador para dar de alta un platillo en orden

//importacion de modelos a utilizar
//más
// Para la orden
import { agregarPlatilloOrden, actualizarPlatilloOrden, eliminarPlatilloOrden, obtenerPlatillosOrden } from '../Models/ordenPlatilloModelo.js';
import {calcularTotalOrden, actualizarOrden} from '../Models/ordenMeseroModelo.js';
import conexionDB from '../config/db.js';

//--------------------- AGREGAR PLATILLO EN ORDEN -----------------------------------------
export const agregarPlatilloOrdenController = async (req, res) => {
    const conn = await conexionDB.getConnection();
    try {
        const { idPlatillo, cantidad, precioUnitario } = req.body;
        const { idOrden } = req.params;

        if (!idOrden || !idPlatillo || !cantidad || !precioUnitario)
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });

        await conn.beginTransaction();

        await agregarPlatilloOrden(conn, { idOrden, idPlatillo, cantidad, precioUnitario });

        // Calcular total actualizado
        const totalCalculado = await calcularTotalOrden(conn, idOrden);
        await actualizarOrden(conn, { idOrden, total: totalCalculado });

        await conn.commit();
        res.status(201).json({
            mensaje: 'Platillo agregado y total actualizado',
            total: totalCalculado
        });
    } catch (err) {
        await conn.rollback();
        console.error('Error al agregar platillo:', err);
        res.status(500).json({ mensaje: 'Error al agregar platillo a la orden' });
    } finally {
        conn.release();
    }
};

//--------------------- ACTUALIZAR PLATILLO EN ORDEN -----------------------------------------
export const actualizarPlatilloOrdenController = async (req, res) => {
    const conn = await conexionDB.getConnection();
    try {
        const { idOrden, idPlatillo } = req.params;
        const { cantidad, precioUnitario, estado } = req.body;

        if (!idOrden || !idPlatillo)
            return res.status(400).json({ mensaje: 'Faltan identificadores del platillo' });

        await conn.beginTransaction();

        await actualizarPlatilloOrden(conn, {
            idOrden,
            idPlatillo,
            cantidad,
            precioUnitario,
            estado
        });

        // Recalcular total
        const totalCalculado = await calcularTotalOrden(conn, idOrden);
        await actualizarOrden(conn, { idOrden, total: totalCalculado });

        await conn.commit();
        res.json({
            mensaje: 'Platillo actualizado y total recalculado',
            total: totalCalculado
        });
    } catch (err) {
        await conn.rollback();
        console.error('Error al actualizar platillo:', err);
        res.status(500).json({ mensaje: 'Error al actualizar platillo' });
    } finally {
        conn.release();
    }
};

//--------------------- ELIMINAR PLATILLO DE ORDEN -----------------------------------------
export const eliminarPlatilloOrdenController = async (req, res) => {
    const conn = await conexionDB.getConnection();
    try {
        const { idOrden, idPlatillo } = req.params;

        if (!idOrden || !idPlatillo)
            return res.status(400).json({ mensaje: 'Faltan identificadores del platillo' });

        await conn.beginTransaction();

        await eliminarPlatilloOrden(conn, { idOrden, idPlatillo });

        const totalCalculado = await calcularTotalOrden(conn, idOrden);
        await actualizarOrden(conn, { idOrden, total: totalCalculado });

        await conn.commit();
        res.json({
            mensaje: 'Platillo eliminado y total actualizado',
            total: totalCalculado
        });
    } catch (err) {
        await conn.rollback();
        console.error('Error al eliminar platillo:', err);
        res.status(500).json({ mensaje: 'Error al eliminar platillo' });
    } finally {
        conn.release();
    }
};

//--------------------- OBTENER PLATILLOS DE LA ORDEN -----------------------------------------
export const obtenerPlatillosOrdenController = async (req, res) => {
    const conn = await conexionDB.getConnection();
    try {
        const { idOrden } = req.params;
        if (!idOrden)
            return res.status(400).json({ mensaje: 'ID de orden obligatorio' });

        const platillos = await obtenerPlatillosOrden(conn, idOrden);
        res.json(platillos);
    } catch (err) {
        console.error('Error al obtener platillos de la orden:', err);
        res.status(500).json({ mensaje: 'Error al obtener platillos de la orden' });
    } finally {
        conn.release();
    }
};