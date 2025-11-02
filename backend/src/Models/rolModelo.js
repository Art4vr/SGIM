//Configuracion del modelo para la tabla de roles (para usuarios)
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los roles
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

export const obtenerRol = async () => {
    const query = 'SELECT * FROM Rol';
    const [roles] = await conexionDB.execute(query);
    return roles;
};