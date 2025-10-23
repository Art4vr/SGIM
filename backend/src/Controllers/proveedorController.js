//Configuracion del controlador para proveedores
// El controlador maneja las solicitudes de las rutas (proveedorRutas.js) y se comunica con el modelo (proveedorModelo.js)
//Este controlador funciona como la API para proveedores
//realiza las operaciones CRUD definidas en el modelo 

//importacion de modelos a utilizar
//más

// Validación de correo electrónico
const validarEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(email.trim());
};
//Validacion de telefono
const validarTelefonoE164 = (tel) => {
    if (!tel || typeof tel !== 'string') return false;
    const re = /^\+?[1-9]\d{6,14}$/; // entre 7 y 15 dígitos, opcional +
    return re.test(tel.trim());
};

//--------------------- AGREGAR PROVEEDOR -----------------------------------------
// Controlador para dar de alta un proveedor.
import { agregarProveedor, eliminarProveedor, actualizarProveedor } from '../Models/proveedorModelo.js';
import conexionDB from '../config/db.js';

export const agregarProveedorController = async (req, res) => {
    try {
        const { nombre, telefono, direccion,correo } = req.body;

        // Validación de campos obligatorios
        if (!nombre?.trim() || !telefono || !correo) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        // Validación de nombre sin números
        if (/\d/.test(nombre)) {
            return res.status(400).json({ mensaje: 'No se permiten números' });
        }

        // Validación de nombre único
        const [repetido] = await conexionDB.execute('SELECT idProveedor FROM proveedor WHERE nombre = ?',[nombre]);
        if (repetido.length > 0) {
            return res.status(400).json({ mensaje: 'Ya existe un proveedor con ese nombre' });
        }

        //Validacion de correo electronico llamando la funcion 
        if (!validarEmail(correo)) {
            return res.status(400).json({ mensaje: 'Correo electrónico inválido' });
        }

        // Validación de teléfono llamando la funcion
        if (!validarTelefonoE164(telefono)) {
            return res.status(400).json({ mensaje: 'Número de teléfono inválido' });
        }

        // Crear proveedor
        const nuevoId = await agregarProveedor({ nombre, telefono, direccion,correo });
        res.status(201).json({
            mensaje: 'Proveedor creado con éxito',
            proveedorId: nuevoId
        });

    } catch (err) {
        console.error('Error en altaProveedorController:', err);
            res.status(500).json({
            mensaje: err.message || 'Error en el servidor'
        });
    }
};

//--------------------- ELIMINAR PROVEEDOR -----------------------------------------
// Controlador para dar de baja un proveedor.

export const eliminarProveedorController = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminación  del proveedor
        const filasEliminadas = await eliminarProveedor(id);
        if (filasEliminadas === 0) {
            return res.status(404).json({ mensaje: 'Proveedor no encontrado o ya eliminado' });
        }
        res.json({ mensaje: 'Proveedor eliminado correctamente' });

    } catch (err) {
        console.error('Error al eliminar proveedor:', err);
        res.status(500).json({
            mensaje: err.message || 'Error en el servidor'
        });
    }
};

//--------------------- MODIFICAR PROVEEDOR -----------------------------------------
// Controlador para modificar un proveedor. [no todos los campos son obligatorios]
export const modificarProveedorController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono, direccion,correo, estado } = req.body;

        // Validación obligatoria: id
        if (!id) {
            return res.status(400).json({ mensaje: 'El id del proveedor es obligatorio' });
        }

        // Validación de nombre sin números (si se envía)
        if (nombre && /\d/.test(nombre)) {
            return res.status(400).json({ mensaje: 'No se permiten números en el nombre' });
        }

        if (nombre) {
            const [repetido] = await conexionDB.execute(
                'SELECT idProveedor FROM Proveedor WHERE nombre = ? AND idProveedor != ?',
                [nombre, id]
            );
            if (repetido.length > 0) {
                return res.status(400).json({ mensaje: 'Ya existe otro proveedor con ese nombre' });
            }
        }

        // Validación de estado (si se envía)
        if (estado && !['activo', 'inactivo'].includes(estado)) {
            return res.status(400).json({ mensaje: 'Estado no válido' });
        }

        // Validacion de email (si se envia)
        if (!validarEmail(correo)) {
            return res.status(400).json({ mensaje: 'Correo electrónico inválido' });
        }
        //Validacion de telefono si se envia
        if (!validarTelefonoE164(telefono)) {
            return res.status(400).json({ mensaje: 'Número de teléfono inválido' });
        }

        // Llamar al modelo para actualizar solo los campos proporcionados
        const filasAfectadas = await actualizarProveedor({ idProveedor: id, nombre,telefono,direccion,correo, estado });

        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: 'No se encontró el proveedor o no se realizaron cambios' });
        }

        res.json({ mensaje: 'Proveedor actualizado correctamente', filasAfectadas });

    } catch (err) {
        console.error('Error en modificarProveedorController:', err);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

//--------------------- OBTENERS TODOS LOS PROVEEDORES -----------------------------------------
export const obtenerProveedoresController = async (req, res) => {
    
    try {
        const [proveedores] = await conexionDB.execute(`SELECT * from Proveedor ORDER BY CASE WHEN estado= 'activo' THEN 0 ELSE 1 END`);
        res.json(proveedores);
    } catch (err) {
        console.error('Error SQL obtenerProveedoresController:', err);
        res.status(500).json({ mensaje: 'Error al obtener proveedores' });
    }
};