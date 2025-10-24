//Configuracion del modelo para la tabla de mesa
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con las mesas
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

export const obtenerMesa = async () => {
  const query = 'SELECT idMesa,estado, numeroMesa FROM Mesa';
  const [mesa] = await conexionDB.execute(query);
  return mesa;
<<<<<<< HEAD
};


// Funcion para actualizar la mesa cuando se hace una orden
export const actualizarMesa = async ({ idMesa, estado }) => {
    let query = 'UPDATE Mesa SET ';
    const params = [];
    const cambios = [];

    if (estado) {
        cambios.push('estado = ?');
        params.push(estado);
    }

    // Si no hay campos para actualizar
    if (cambios.length === 0) return 0;

    query += cambios.join(', ') + ' WHERE idMesa = ?';
    params.push(idMesa);

    try {
        const [resultado] = await conexionDB.execute(query, params);
        return resultado.affectedRows; 
    } catch (err) {
        console.error('Error al modificar mesa:', err);
        throw err;
    }
=======
>>>>>>> main
};