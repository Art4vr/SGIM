//Configuracion del modelo para la tabla de mesa
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con las mesas
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

export const obtenerMesa = async () => {
    const query = 'SELECT idMesa,estado, numeroMesa FROM Mesa ORDER BY CASE WHEN estado = "disponible" THEN 0 ELSE 1 END, numeroMesa;';
    const [mesa] = await conexionDB.execute(query);
    return mesa;
};

// Funcion para actualizar la mesa cuando se hace una orden
export const actualizarMesa = async (conn, { idMesa, estado }) => {
    let query = 'UPDATE Mesa SET ';
    const params = [];
    const cambios = [];

    if (estado) {
        cambios.push('estado = ?');
        params.push(estado);
    }

    if (cambios.length === 0) return 0;

    query += cambios.join(', ') + ' WHERE idMesa = ?';
    params.push(idMesa);

    try {
        const [resultado] = await conn.execute(query, params); // <- usar la conexión de la transacción
        return resultado.affectedRows;
    } catch (err) {
        console.error('Error al modificar mesa:', err);
        throw err;
    }
};
