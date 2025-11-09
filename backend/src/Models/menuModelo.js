// Models/menuModelo.js
import pool from '../config/db.js';

/**
 * ✅ Obtiene TODOS los platillos, uniendo el nombre de su categoría.
 * El frontend (menu.jsx) usa esta función y luego filtra localmente.
 */
export async function obtenerPlatillos() {
  const query = `
    SELECT 
      p.*, 
      pc.nombre AS categoria  -- Renombramos 'pc.nombre' a 'categoria'
    FROM 
      Platillo AS p
    LEFT JOIN 
      platillo_categoria AS pc ON p.id_categoria = pc.id_categoria_platillo
    WHERE
      p.estado = 'disponible'
  `;
  const [rows] = await pool.query(query);
  return rows;
}

/**
 * ✅ (Opcional) Obtiene platillos filtrados por el NOMBRE de la categoría.
 * NOTA: Tu frontend actual no usa esta función, pero es bueno tenerla.
 */
export async function obtenerPlatillosPorCategoria(nombreCategoria) {
  const query = `
    SELECT 
      p.*, 
      pc.nombre AS categoria 
    FROM 
      Platillo AS p
    LEFT JOIN 
      platillo_categoria AS pc ON p.id_categoria = pc.id_categoria_platillo
    WHERE 
      pc.nombre = ?  -- Filtramos usando el NOMBRE
      AND p.estado = 'disponible'
  `;
  const [rows] = await pool.query(query, [nombreCategoria]);
  return rows;
}