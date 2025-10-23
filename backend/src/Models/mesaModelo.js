//Configuracion del modelo para la tabla de mesa
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con las mesas
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

export const obtenerMesa = async () => {
  const query = 'SELECT idMesa,estado, numeroMesa FROM Mesa';
  const [mesa] = await conexionDB.execute(query);
  return mesa;
};