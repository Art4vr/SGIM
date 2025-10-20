//Configuracion del controlador para productos
// El controlador maneja las solicitudes de las rutas (productoRutas.js) y se comunica con el modelo (productoModelo.js)
//Este controlador funciona como la API para productos
//realiza las operaciones CRUD definidas en el modelo 

//--------------------- AGREGAR PRODUCTO -----------------------------------------
// Controlador para dar de alta un producto.

//importacion de modelos a utilizar
//más
import { agregarProducto, eliminarProducto, actualizarProducto } from '../Models/productoModelo.js';
import conexionDB from '../config/db.js';

export const agregarProductoController = async (req, res) => {
    try {
        const { nombre, idCategoria, idUnidadMedida } = req.body;

        // Validación de campos obligatorios
        if (!nombre?.trim() || !idCategoria || !idUnidadMedida) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        // Validación de nombre sin números
        if (/\d/.test(nombre)) {
            return res.status(400).json({ mensaje: 'No se permiten números' });
        }

        // Validación de nombre único
        const [repetido] = await conexionDB.execute('SELECT idProducto FROM producto WHERE nombre = ?',[nombre]);
        if (repetido.length > 0) {
            return res.status(400).json({ mensaje: 'Ya existe un producto con ese nombre' });
        }

        // Validación de existencia de categoría
        const [categoria] = await conexionDB.execute('SELECT idCategoria FROM Categoria WHERE idCategoria = ?',[idCategoria]);
        if (categoria.length === 0) {
            return res.status(400).json({ mensaje: 'Categoría no válida' });
        }

        // Validación de existencia de unidad de medida
        const [uni] = await conexionDB.execute('SELECT idUnidadMedida FROM unidadmedida WHERE idUnidadMedida = ?',[idUnidadMedida]);
        if (uni.length === 0) {
            return res.status(400).json({ mensaje: 'Unidad de medida no válida' });
        }

        // Crear producto
        const nuevoId = await agregarProducto({ nombre, idCategoria, idUnidadMedida });
        res.status(201).json({
            mensaje: 'Producto creado con éxito',
            productoId: nuevoId
        });

    } catch (err) {
        console.error('Error en altaProductoController:', err);
            res.status(500).json({
            mensaje: err.message || 'Error en el servidor'
        });
    }
};


//--------------------- ELIMINAR PRODUCTO -----------------------------------------
// Controlador para dar de baja un producto.

export const eliminarProductoController = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminación  del producto
        const filasEliminadas = await eliminarProducto(id);
        if (filasEliminadas === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado o ya eliminado' });
        }
        res.json({ mensaje: 'Producto eliminado correctamente' });

    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({
            mensaje: err.message || 'Error en el servidor'
        });
    }
};


//--------------------- MODIFICAR PRODUCTO -----------------------------------------
// Controlador para modificar un producto. [no todos los campos son obliatorios]
export const modificarProductoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, idCategoria, idUnidadMedida, estado } = req.body;

        // Validación obligatoria: id
        if (!id) {
            return res.status(400).json({ mensaje: 'El id del producto es obligatorio' });
        }

        // Validación de nombre sin números (si se envía)
        if (nombre && /\d/.test(nombre)) {
            return res.status(400).json({ mensaje: 'No se permiten números en el nombre' });
        }

        if (nombre) {
            const [repetido] = await conexionDB.execute(
                'SELECT idProducto FROM Producto WHERE nombre = ? AND idProducto != ?',
                [nombre, id]
            );
            if (repetido.length > 0) {
                return res.status(400).json({ mensaje: 'Ya existe otro producto con ese nombre' });
            }
        }

        // Validación de estado (si se envía)
        if (estado && !['vigente', 'descontinuado', 'suspendido'].includes(estado)) {
            return res.status(400).json({ mensaje: 'Estado no válido' });
        }

        // Llamar al modelo para actualizar solo los campos proporcionados
        const filasAfectadas = await actualizarProducto({ idProducto: id, nombre, idCategoria, idUnidadMedida, estado });

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