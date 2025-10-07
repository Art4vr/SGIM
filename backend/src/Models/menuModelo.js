// Models/menuModelo.js
import pool from '../config/db.js';

// ✅ Obtener todos los platillos
export async function obtenerPlatillos() {
  const [rows] = await pool.query('SELECT * FROM Platillo');
  return rows;
}

// ✅ (Opcional) Obtener por categoría
export async function obtenerPlatillosPorCategoria(categoria) {
  const [rows] = await pool.query(
    'SELECT * FROM Platillo WHERE categoria = ?',
    [categoria]
  );
  return rows;
}
