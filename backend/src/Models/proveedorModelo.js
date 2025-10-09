//Configuracion del modelo para la tabla de proveedor 
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los proveedores
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

export const agregarProveedor = async ({ nombre, telefono, direccion, correo }) => {
    const [proveedor] = await conexionDB.execute('INSERT INTO Proveedor (nombre, telefono, direccion, correo, estado) VALUES (?, ?, ?, ?)',
        [nombre, telefono, direccion || null, correo]
    );
    return proveedor.insertId;
};

export const eliminarProveedor = async (idProveedor) => {
    const [proveedor] = await conexionDB.execute('DELETE FROM Proveedor WHERE idProveedor = ?',[idProveedor]);
    return proveedor.affectedRows;
};

export const actualizarProveedor = async (idProveedor, datos) => {
    const campos = [];
    const valores = [];

    for (const [clave, valor] of Object.entries(datos)) {
        campos.push(`${clave} = ?`);
        valores.push(valor);
    }

    if (campos.length === 0) return 0;

    valores.push(idProveedor);
    const query = `UPDATE Proveedor SET ${campos.join(', ')} WHERE idProveedor = ?`;

    const [resultado] = await conexionDB.execute(query, valores);
    return resultado.affectedRows;
};

// buscar un nombre
export const obtenerProveedorPorNombre = async (nombreProveedor) => {
    const [proveedor] = await conexionDB.execute(
        'SELECT nombre,telefono,direccion,correo,estado FROM Proveedor WHERE nombre = ?',[nombreProveedor]);
    return proveedor[0];
};

export const obtenerTodosProveedores = async () => {
    const [proveedor] = await conexionDB.execute(
        'SELECT * FROM Proveedor'
    );
    return proveedor;
};