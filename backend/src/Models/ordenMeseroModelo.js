//Configuracion del modelo para la tabla orden
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con las ordenes
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

//--------------------- ALTA ORDEN-----------------------------------------
// Funcion para dar de alta una orden
export const agregarOrden = async ({ idUsuario, idMesa })=>{ 
    const query = 'INSERT INTO Orden (Usuario_idUsuario, Mesa,idMesa) VALUES (?, ?)';
    try{
        const[resultado] = await conexionDB.execute(query,[idUsuario, idMesa]);
        return resultado.insertId; 
    }catch(err){
        console.error('Error con la base de datos (agregarOrden): ', err); //manejo de errores
        throw err;
    }
};

//--------------------- ACTUALIZACION ORDEN-----------------------------------------
// Funcion para actualizar una orden (el mesero y el total al agregar platillos)
export const actualizarOrden = async ({ idOrden, estado, total }) => {
    let query = 'UPDATE Orden SET ';
    const params = [];
    const cambios = [];

    if (estado) {
        cambios.push('estado = ?');
        params.push(estado);
    }
    // actualizacion del total conforme a los platillos agregados
    if (total) {
        cambios.push('total = ?');
        params.push(total);
    }

    // Si no hay campos para actualizar
    if (cambios.length === 0) return 0;

    query += cambios.join(', ') + ' WHERE idOrden = ?';
    params.push(idOrden);

    try {
        const [resultado] = await conexionDB.execute(query, params);
        return resultado.affectedRows; 
    } catch (err) {
        console.error('Error al modificar orden:', err);
        throw err;
    }
};

