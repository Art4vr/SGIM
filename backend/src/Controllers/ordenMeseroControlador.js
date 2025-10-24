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
// Controlador para modificar una orden (dar como finalizada la orden)
export const modificarOrdenController = async (req, res) => {
    try {
        const { id } = req.params;
        const { idOrden, estado, total } = req.body;

        // Validación obligatoria: id
        if (!id) {
            return res.status(400).json({ mensaje: 'El id de la orden es obligatorio' });
        }

        // Validación de estado (si se envía)
        if (estado && !['cerrada', 'abierta'].includes(estado)) {
            return res.status(400).json({ mensaje: 'Estado no válido' });
        }

        // Llamar al modelo para actualizar solo los campos proporcionados
        const filasAfectadas = await actualizarOrden({ idOrden: id, estado, total });

        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: 'No se encontró el producto o no se realizaron cambios' });
        }

        res.json({ mensaje: 'Producto actualizado correctamente', filasAfectadas });

    } catch (err) {
        console.error('Error en modificarProductoController:', err);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};


//--------------------- OBTENERS TODOS LOS PRODUCTOS -----------------------------------------
export const obtenerProductosController = async (req, res) => {
    
    try {
        const [productos] = await conexionDB.execute(`
            SELECT p.idProducto, p.nombre, p.estado,
                c.nombre AS categoria,
                u.medida AS unidad
            FROM Producto p
            JOIN Categoria c ON p.Categoria_idCategoria = c.idCategoria
            JOIN UnidadMedida u ON p.UnidadMedida_idUnidadMedida = u.idUnidadMedida
        `);
        res.json(productos);
    } catch (err) {
        console.error('Error SQL obtenerProductosController:', err);
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
};