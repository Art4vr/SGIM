//Configuracion del modelo para la tabla platillo
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los platillos
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

//--------------------- ALTA PLATILLO-----------------------------------------
// Funcion para dar de alta un platillo
export const agregarPlatillo = async ({ nombre, descripcion = null, categoria, imagen = null, precio })=>{ 
    try{

        //Descripcion e imagen es opcional
        const query = `
            INSERT INTO Platillo (nombre, descripcion, categoria, imagen, precio)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [nombre, descripcion, categoria, imagen, precio];
        const [resultado] = await conexionDB.execute(query, params);
        return resultado.affectedRows; 

    }catch(err){
        console.error('Error con la base de datos (agregarPlatillo): ', err); //manejo de errores
        throw err;
    }
};

//--------------------- BAJA PLATILLO -----------------------------------------
// Funcion para dar de baja un platillo
export const eliminarPlatillo = async (idPlatillo) => {
    const query = 'DELETE FROM Platillo WHERE idPlatillo = ?';
    try {
        const [resultado] = await conexionDB.execute(query, [idPlatillo]);
        return resultado.affectedRows; // Devuelve cuántas filas fueron afectadas (1 si se eliminó, 0 si no existía)
    } catch (err) {
        console.error('Error al eliminar platillo:', err);
        throw err;
    }
};

//--------------------- ACTUALIZACION PLATILLO -----------------------------------------
// Funcion para actualizar un platillo
export const actualizarPlatillo = async ({ idPlatillo, nombre, descripcion, categoria, imagen, precio, estado }) => {
    let query = 'UPDATE Platillo SET ';
    const params = [];
    const cambios = [];

    if (nombre) {
        cambios.push('nombre = ?');
        params.push(nombre);
    }
    if (descripcion) {
        cambios.push('descripcion = ?');
        params.push(descripcion);
    }
    if (categoria) {
        cambios.push('categoria = ?');
        params.push(categoria);
    }
    if (imagen) {
        cambios.push('imagen = ?');
        params.push(imagen);
    }
    if (precio) {
        cambios.push('precio = ?');
        params.push(precio);
    }
    if (estado) {
        cambios.push('estado = ?');
        params.push(estado);
    }

    // Si no hay campos para actualizar
    if (cambios.length === 0) return 0;

    query += cambios.join(', ') + ' WHERE idProducto = ?';
    params.push(idPlatillo);

    try {
        const [resultado] = await conexionDB.execute(query, params);
        return resultado.affectedRows; 
    } catch (err) {
        console.error('Error al modificar producto:', err);
        throw err;
    }
};

