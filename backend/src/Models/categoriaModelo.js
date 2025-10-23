//Configuracion del modelo para la tabla de categorias (de productos)
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con las categorias
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

export const obtenerCategoria = async () => {
  const query = 'SELECT idCategoria,nombre FROM Categoria';
  const [categoria] = await conexionDB.execute(query);
  return categoria;
};