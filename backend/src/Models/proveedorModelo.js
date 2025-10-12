//Configuracion del modelo para la tabla de proveedor 
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los proveedores
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

//--------------------- ALTA PROVEEDOR-----------------------------------------
// Funcion para dar de alta un proveedor, la direccion puede estar vacío
export const agregarProveedor = async ({ nombre, telefono, direccion, correo }) => {
    const [proveedor] = await conexionDB.execute('INSERT INTO Proveedor (nombre, telefono, direccion, correo) VALUES (?, ?, ?, ?)',
        [nombre, telefono, direccion || null, correo]
    );
    return proveedor.insertId;
};
//--------------------- BAJA PROVEEDOR-----------------------------------------
// Funcion para dar de baja un proveedor
export const eliminarProveedor = async (idProveedor) => {
    const query = 'DELETE FROM Proveedor WHERE idProveedor = ?';
    try {
        const [resultado] = await conexionDB.execute(query, [idProveedor]);
        return resultado.affectedRows; // Devuelve cuántas filas fueron afectadas (1 si se eliminó, 0 si no existía)
    } catch (err) {
        console.error('Error al eliminar proveedor:', err);
        throw err;
    }
};

//--------------------- ACTUALIZAVION PROVEEDOR-----------------------------------------
// Funcion para actualizar un proveedor
export const actualizarProveedor = async ({idProveedor,nombre,telefono,direccion,correo,estado}) => {
    let query = 'UPDATE Proveedor SET ';
    const params = [];
    const cambios = [];

    if (nombre) {
        cambios.push('nombre = ?');
        params.push(nombre);
    }
    if (telefono) {
        cambios.push('telefono = ?');
        params.push(telefono);
    }
    if (direccion) {
        cambios.push('direccion = ?');
        params.push(direccion);
    }
    if (correo) {
        cambios.push('correo = ?');
        params.push(correo);
    }
    if (estado) {
        cambios.push('estado = ?');
        params.push(estado);
    }

    // Si no hay campos para actualizar
    if (cambios.length === 0) return 0;

    query += cambios.join(', ') + ' WHERE idProveedor = ?';
    params.push(idProveedor);

    try {
        const [resultado] = await conexionDB.execute(query, params);
        return resultado.affectedRows; 
    } catch (err) {
        console.error('Error al modificar proveedor:', err);
        throw err;
    }
};
