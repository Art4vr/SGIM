//Configuracion del controlador para los pedidos a los proveedores
// El controlador maneja las solicitudes de las rutas (pedidosProRutas.js) y se comunica con el modelo (pedidoProModelo.js)
//Este controlador funciona como la API para los pedidos hacia los proveedores
//realiza las operaciones CRUD definidas en el modelo 

//--------------------- AGREGAR UN PEDIDO -----------------------------------------
// Controlador para dar de alta un pedido.

//importacion de modelos a utilizar
//más
import { agregarPedido, eliminarPedido, actualizarPedido } from '../Models/pedidoProModelo.js';
import conexionDB from '../config/db.js';

export const agregarPedidoController = async (req, res) => {
    try {
        const { fecha,idProveedor } = req.body;
        const idUsuario=req.user?.idUsuario; //se obtiene el id del usuario autenticado

        // Validación de campos obligatorios
        if (!idProveedor || !fecha) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        // Crear pedido
        const nuevoId = await agregarPedido({ fecha, idUsuario, idProveedor });
        res.status(201).json({
            mensaje: 'Pedido creado con éxito',
            productoId: nuevoId
        });

    } catch (err) {
        console.error('Error en agregarPedidoController:', err);
            res.status(500).json({
            mensaje: err.message || 'Error en el servidor'
        });
    }
};


//--------------------- ELIMINAR PEDIDO -----------------------------------------
// Controlador para dar de baja un pedido

export const eliminarPedidoController = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminación  del producto
        const filasEliminadas = await eliminarPedido(id);
        if (filasEliminadas === 0) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado o ya eliminado' });
        }
        res.json({ mensaje: 'Pedido eliminado correctamente' });

    } catch (err) {
        console.error('Error al eliminar pedido:', err);
        res.status(500).json({
            mensaje: err.message || 'Error en el servidor'
        });
    }
};


//--------------------- MODIFICAR PRODUCTO -----------------------------------------
// Controlador para modificar un producto. [no todos los campos son obliatorios]
export const modificarPedidoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validación obligatoria: id
        if (!id) {
            return res.status(400).json({ mensaje: 'El id del pedido es obligatorio' });
        }

        // Validación de estado (si se envía)
        if (estado && !['entregado', 'pendiente', 'cancelado'].includes(estado)) {
            return res.status(400).json({ mensaje: 'Estado no válido' });
        }

        // Llamar al modelo para actualizar solo los campos proporcionados
        const filasAfectadas = await actualizarPedido({ idPedido: id, estado });

        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: 'No se encontró el producto o no se realizaron cambios' });
        }

        res.json({ mensaje: 'Pedido actualizado correctamente', filasAfectadas });

    } catch (err) {
        console.error('Error en modificarProductoController:', err);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};


//--------------------- OBTENERS TODOS LOS PEDIDOS -----------------------------------------
export const obtenerPedidosController = async (req, res) => {
    
    try {
        const [pedidos] = await conexionDB.execute(`
            SELECT 
                p.idPedido, p.fecha, p.estado,u.nombreUsuario AS usuario,
                pr.nombreProveedor AS proveedor
            FROM Pedido p
            JOIN Usuario u ON p.Usuario_idUsuario = u.idUsuario
            JOIN Proveedor pr ON p.Proveedor_idProveedor = pr.idProveedor
            ORDER BY p.fecha DESC
        `);
        res.json(pedidos);
    } catch (err) {
        console.error('Error SQL obtenerPedidosController:', err);
        res.status(500).json({ mensaje: 'Error al obtener pedidos' });
    }
};