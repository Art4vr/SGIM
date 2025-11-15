//Configuracion del modelo para la tabla Producto_Platillo
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los productos de los platillos
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

// --------------------- AGREGAR INGREDIENTES AL PLATILLO -----------------------------
export const agregarProductoPlatillo = async ({ idPlatillo, idProducto, unidadMedida, cantidad }) => {
    const query = 'INSERT INTO producto_platillo (Platillo_idPlatillo, Producto_idProducto, UnidadMedida_idUnidadMedida, cantidad) VALUES (?,?,?,?)';//consulta sql
    try {
        const [resultado] = await conexionDB.execute(query,[idPlatillo, idProducto, unidadMedida, cantidad]);//ejecuta la consulta, los ? se remplazan por los valores del array (parametros)
        console.log('Modelo',resultado);
        return resultado; // Devuelve los IDs 

    } catch (err) {
        console.error('Error en agregarProductoPlatillo:', err);
        throw new Error('Error al agregar el producto al platillo');
    }
};

// --------------------- ACTUALIZAR RECETA DE PLATILLO -------------------------
export const actualizarProductoPlatillo = async ({ idPlatillo, idProducto, unidadMedida, cantidad }) => {
    //en caso de que no haya unidad de medida se controla con COALESCE
    console.log("Modelo - actualizarProductoPlatillo - datos recibidos: ", { idPlatillo, idProducto, unidadMedida, cantidad });
    const query = `
        UPDATE producto_platillo
        SET 
            cantidad = COALESCE(?, cantidad),
            UnidadMedida_idUnidadMedida = COALESCE(?, UnidadMedida_idUnidadMedida)
        WHERE Platillo_idPlatillo = ? AND Producto_idProducto = ?
    `;
    try {
        const [resultado] = await conexionDB.execute(query, [cantidad, unidadMedida, idPlatillo, idProducto]);
        return resultado.affectedRows;
    } catch (err) {
        console.error('Error en actualizarProductoPlatillo:', err);
        throw new Error('Error al actualizar la receta del platillo');
    }
};

// --------------------- ELIMINAR INGREDIENTE DE PLATILLO ---------------------------
export const eliminarProductoPlatillo = async ({ idProducto, idPlatillo }) => {
    const query = `
        DELETE FROM producto_platillo
        WHERE Producto_idProducto = ? AND Platillo_idPlatillo = ?
    `;
    try {
        const [resultado] = await conexionDB.execute(query, [idProducto, idPlatillo]);
        return resultado.affectedRows;
    } catch (err) {
        console.error('Error en eliminarProductoPlatillo:', err);
        throw new Error('Error al eliminar el ingrediente del platillo');
    }
};

//---------------------- ELIMINAR LA RECETA COMPLETA DE UN PLATILLO ------------------------
export const eliminarRecetaPlatillo = async (idPlatillo) => {
    const query = `
        DELETE FROM producto_platillo
        WHERE Platillo_idPlatillo = ?
    `;
    try {
        const [resultado] = await conexionDB.execute(query, [idPlatillo]);
        return resultado.affectedRows;
    } catch (err) {
        console.error('Error en eliminarRecetaPlatillo:', err);
        throw new Error('Error al eliminar la receta completa del platillo');
    }
};

// --------------------- OBTENER INGREDIENTES DE UN PLATILLO -----------------------
export const obtenerProductoPlatillo = async (idPlatillo) => {
    const query = `
        SELECT *
            FROM Producto_Platillo
            WHERE Producto_Platillo.Platillo_idPlatillo = ?;
    `;
    try {
        const [rows] = await conexionDB.execute(query, [idPlatillo]);
        return rows;
    } catch (err) {
        console.error('Error en obtenerProductoPlatillo:', err);
        throw new Error('Error al obtener los ingredientes del platillo');
    }
};