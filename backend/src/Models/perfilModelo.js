import pool from '../config/db.js';

/**
 * Obtiene la información de perfil de un usuario, uniendo su nombre de usuario,
 * nombre completo y la descripción de su rol, buscando por ID.
 * @param {number} idUsuario El ID del usuario
 * @returns {object} Objeto con nombre, username y rolDescripcion
 */
export async function obtenerPerfilPorId(idUsuario) {
    const query = `
        SELECT 
        u.nombre, 
        u.username, 
        r.descripcion AS rolDescripcion,
        r.nombre AS rolNombre
        FROM 
        Usuario AS u
        JOIN 
        Rol AS r ON u.Rol_idRol = r.idRol
        WHERE 
        u.idUsuario = ?; -- 👈 Búsqueda por ID
    `;
    
    const [rows] = await pool.query(query, [idUsuario]);
    
    return rows[0];
}