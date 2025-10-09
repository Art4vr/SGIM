//Configuracion del modelo para la tabla producto
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los productos
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

//--------------------- ALTA PRODUCTO-----------------------------------------
// Funcion para dar de alta un producto
export const agregarProducto = async ({ nombre, idCategoria, idUnidadMedida })=>{ 
    const query = 'INSERT INTO Producto (nombre,Categoria_idCategoria, UnidadMedida_idUnidadMedida) VALUES (?, ?, ?)';
    try{
        const[resultado] = await conexionDB.execute(query,[nombre, idCategoria, idUnidadMedida]);
        return resultado.insertId; 
    }catch(err){
        console.error('Error con la base de datos (agregarProducto): ', err); //manejo de errores
        throw err;
    }
};

//--------------------- BAJA PRODUCTO-----------------------------------------
// Funcion para dar de baja un producto
export const eliminarProducto = async (idProducto) => {
    const query = 'DELETE FROM Producto WHERE idProducto = ?';
    try {
        const [resultado] = await conexionDB.execute(query, [idProducto]);
        return resultado.affectedRows; // Devuelve cuántas filas fueron afectadas (1 si se eliminó, 0 si no existía)
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        throw err;
    }
};

//--------------------- ACTUALIZAVION PRODUCTO-----------------------------------------
// Funcion para actualizar un producto
export const actualizarProducto = async ({ idProducto, nombre, idCategoria, idUnidadMedida, estado }) => {
    let query = 'UPDATE Producto SET ';
    const params = [];
    const cambios = [];

    if (nombre) {
        cambios.push('nombre = ?');
        params.push(nombre);
    }
    if (idCategoria) {
        cambios.push('Categoria_idCategoria = ?');
        params.push(idCategoria);
    }
    if (idUnidadMedida) {
        cambios.push('UnidadMedida_idUnidadMedida = ?');
        params.push(idUnidadMedida);
    }
    if (estado) {
        cambios.push('estado = ?');
        params.push(estado);
    }

    // Si no hay campos para actualizar
    if (cambios.length === 0) return 0;

    query += cambios.join(', ') + ' WHERE idProducto = ?';
    params.push(idProducto);

    try {
        const [resultado] = await conexionDB.execute(query, params);
        return resultado.affectedRows; 
    } catch (err) {
        console.error('Error al modificar producto:', err);
        throw err;
    }
};

