//Configuracion del modelo para la tabla orden usado por el Chef 
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con las ordenes
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

// --------------------- VISUALIZAR ORDEN CHEF ------------------------------------

export const obtenerPlatillosChef = async (conn) => {
  const query = `
    SELECT
      po.idPlatilloOrden, 
      po.Orden_idOrden,
      po.Platillo_idPlatillo,
      p.nombre AS platillo,
      po.cantidad,
      po.estado
    FROM Platillo_Orden po
    JOIN Platillo p ON po.Platillo_idPlatillo = p.idPlatillo
    JOIN Orden o ON po.Orden_idOrden = o.idOrden
    WHERE o.estado = 'abierta'
      AND po.estado IN ('espera', 'preparacion', 'listo')
    ORDER BY po.estado, p.nombre;
  `;
  const [rows] = await conn.execute(query);
  return rows;
};

// --------------------- ACTUALIZAR ORDEN CHEF ------------------------------------
// cambio de pendiente a preparacion a entregado
export const actualizarPlatilloChef = async (conn, { idPlatilloOrden, estado }) => {
  const query = `
    UPDATE Platillo_Orden
    SET estado = ?
    WHERE idPlatilloOrden = ?
  `;
  const [resultado] = await conn.execute(query, [estado, idPlatilloOrden]);
  return resultado.affectedRows;
};
