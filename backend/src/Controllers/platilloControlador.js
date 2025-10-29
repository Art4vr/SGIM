//Configuracion del controlador para platillos
// El controlador maneja las solicitudes de las rutas (platilloRutas.js) y se comunica con el modelo (platilloModelo.js)
//Este controlador funciona como la API para platillos
//realiza las operaciones CRUD definidas en el modelo 

//--------------------- AGREGAR PLATILLO -----------------------------------------
// Controlador para dar de alta un platillo.

//importacion de modelos a utilizar
//más
import { agregarPlatillo, eliminarPlatillo, actualizarPlatillo } from '../Models/platilloModelo.js';
import conexionDB from '../config/db.js';

export const agregarPlatilloController = async (req, res) => {
    try {
        const { nombre, descripcion, idCategoria, imagen, precio } = req.body;

        // Validación de campos obligatorios
        if (!nombre?.trim() || !precio) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        // Validación de nombre sin números
        if (/\d/.test(nombre)) {
            return res.status(400).json({ mensaje: 'No se permiten números en el nombre' });
        }

        // Validación de nombre único
        const [repetido] = await conexionDB.execute('SELECT idPlatillo FROM platillo WHERE nombre = ?',[nombre]);
        if (repetido.length > 0) {
            return res.status(400).json({ mensaje: 'Ya existe un platillo con ese nombre' });
        }

        // Validación de existencia de categoria
        const [cate] = await conexionDB.execute('SELECT id_categoria_platillo FROM platillo_categoria WHERE id_categoria_platillo = ?',[idCategoria]);
        if (cate.length === 0) {
            return res.status(400).json({ mensaje: 'Categoria no válida' });
        }

        // Validación de precio sin letras y con decimales
        if (!/^\d+(\.\d{1,2})?$/.test(precio)) {
            return res.status(400).json({ mensaje: 'No se permiten letras en el precio' });
        }

        // Crear platillo
        const nuevoId = await agregarPlatillo({ nombre, descripcion:descripcion || null, id_categoria:idCategoria, imagen:imagen || null, precio });
        res.status(201).json({
            mensaje: 'Platillo creado con éxito',
            productoId: nuevoId
        });

    } catch (err) {
        console.error('Error en altaPlatilloController:', err);
            res.status(500).json({
            mensaje: err.message || 'Error en el servidor'
        });
    }
};


//--------------------- ELIMINAR PLATILLO -----------------------------------------
// Controlador para dar de baja un platillo.

export const eliminarPlatilloController = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminación  del platillo
        const filasEliminadas = await eliminarPlatillo(id);
        if (filasEliminadas === 0) {
            return res.status(404).json({ mensaje: 'Platillo no encontrado o ya eliminado' });
        }
        res.json({ mensaje: 'Platillo eliminado correctamente' });

    } catch (err) {
        console.error('Error al eliminar platillo:', err);
        res.status(500).json({
            mensaje: err.message || 'Error en el servidor'
        });
    }
};


//--------------------- MODIFICAR PLATILLO -----------------------------------------
// Controlador para modificar un platillo. [no todos los campos son obliatorios]
export const modificarPlatilloController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, idCategoria, imagen, precio, estado } = req.body;

        // Validación obligatoria: id
        if (!id) {
            return res.status(400).json({ mensaje: 'El id del platillo es obligatorio' });
        }

        // Validación de nombre sin números (si se envía)
        if (nombre && /\d/.test(nombre)) {
            return res.status(400).json({ mensaje: 'No se permiten números en el nombre' });
        }

        // Validación de existencia de categoria
        if (idCategoria) {
            const [cate] = await conexionDB.execute(
                'SELECT id_categoria_platillo FROM platillo_categoria WHERE id_categoria_platillo = ?',
                [idCategoria]
            );
            if (cate.length === 0) {
                return res.status(400).json({ mensaje: 'Categoria no válida' });
            }
        }
        
        // Validación de precio sin letras y con dos decimales(si se envía)
        if (precio && !/^\d+(\.\d{1,2})?$/.test(precio)) {
            return res.status(400).json({ mensaje: 'No se permiten letras en el precio' });
        }

        if (nombre) {
            const [repetido] = await conexionDB.execute(
                'SELECT idPlatillo FROM Platillo WHERE nombre = ? AND idPlatillo != ?',
                [nombre, id]
            );
            if (repetido.length > 0) {
                return res.status(400).json({ mensaje: 'Ya existe otro platillo con ese nombre' });
            }
        }

        // Validación de estado (si se envía)
        if (estado && !['disponible', 'agotado', 'descontinuado'].includes(estado)) {
            return res.status(400).json({ mensaje: 'Estado no válido' });
        }

        // Llamar al modelo para actualizar solo los campos proporcionados
        const filasAfectadas = await actualizarPlatillo({ idPlatillo: id, nombre, descripcion, id_categoria:idCategoria, imagen, precio, estado });

        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: 'No se encontró el platillo o no se realizaron cambios' });
        }

        res.json({ mensaje: 'Platillo actualizado correctamente', filasAfectadas });

    } catch (err) {
        console.error('Error en modificarPlatilloController:', err);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};


//--------------------- OBTENER TODOS LOS PLATILLOS -----------------------------------------
export const obtenerPlatillosController = async (req, res) => {
    
    try {
        //La prioridad de platillos conforme este el estado
        const [platillos] = await conexionDB.execute(`
            SELECT p.idPlatillo, p.nombre, p.descripcion, p.imagen, p.precio, p.estado,
                c.nombre AS categoria
            FROM Platillo p
            JOIN platillo_categoria c ON p.id_categoria = c.id_categoria_platillo
            ORDER BY 
                CASE p.estado
                    WHEN 'disponible' THEN 1
                    WHEN 'agotado' THEN 2
                    WHEN 'descontinuado' THEN 3
                    ELSE 4
                END;
            
        `);
        res.json(platillos);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener platillos' });
    }
};