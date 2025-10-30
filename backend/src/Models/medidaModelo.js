import conexionDB from '../config/db.js';

export const obtenerMedidas = async () => {
  const query = 'SELECT idUnidadMedida,medida,abreviatura,medidaEquivalente,factorConversion  FROM UnidadMedida';
  const [medidas] = await conexionDB.execute(query);
  return medidas;
};