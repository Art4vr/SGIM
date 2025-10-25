//Configuracion del modelo para la tabla de categorias (de productos)
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con las categorias
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

export const obtenerCategoriaPlatillo = async () => {
  const query = 'SELECT id_categoria_platillo,nombre FROM platillo_categoria';
  const [categoriaPlatillo] = await conexionDB.execute(query);
  return categoriaPlatillo;
};