// conexion a BD
import conexionDB from '../config/db.js';

import { crearRegistroAcceso } from '../Models/registroAccesoModelo.js';


/**
 * allowedRoles: array de ids (números) o nombres (strings).
 * Ejemplos:
 *  requireRole([1,4])                 -> roles por id
 *  requireRole(['Gerente','Mesero'])  -> roles por nombre (se traducen consultando la tabla Rol)
 */
export const requireRole = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {//verifica que esté autenticado
            if (!req.user?.id) return res.status(401).json({ mensaje: 'No autenticado' });
            
            // obtener rol actual del usuario de la BD
            const [rows] = await conexionDB.execute('SELECT Rol_idRol FROM Usuario WHERE idUsuario = ?', [req.user.id]);
            if (!rows || rows.length === 0) return res.status(401).json({ mensaje: 'Usuario no encontrado' });
            
            const currentRoleId = rows[0].Rol_idRol;
            
            // Separar roles que vienen como IDs y como nombres
            const ids = allowedRoles.filter(r => typeof r === 'number');
            const names = allowedRoles.filter(r => typeof r === 'string');
            
            let allowedIds = [...ids];
            
            if (names.length > 0) {
              // Obtener ids para los nombres dados
                const placeholders = names.map(() => '?').join(',');
                const [roleRows] = await conexionDB.execute(`SELECT idRol FROM Rol WHERE nombre IN (${placeholders})`, names);
                const nameIds = roleRows.map(r => r.idRol);
                allowedIds.push(...nameIds);
            }
            if (allowedIds.includes(currentRoleId)) {
                return next();
            } else {
                return res.status(403).json({ mensaje: 'No tienes permisos para realizar esta acción' });
            }
        }   catch (err) {
            console.error('requireRole error:', err);
            return res.status(500).json({ mensaje: 'Error validando permisos' });
        }
    };
};

/**
   * requirePermission: versión fina basada en Permiso ↔ Permiso_Rol
   * Middleware para proteger rutas según un PERMISO específico del rol del usuario.
   * Usage: requirePermission('Tomar órdenes')
   */
export const requirePermission = (permName) => {
    return async (req, res, next) => {
        try {
            if (!req.user?.id){
                await crearRegistroAcceso({ ip: req.ip, ruta: req.originalUrl, metodo: req.method, motivo: 'No autenticado', detalle: `Acceso a permiso ${permName}` });
                return res.status(401).json({ mensaje: 'No autenticado' });
            } 
            
            // Obtener rol actual del usuario
            const [urows] = await conexionDB.execute('SELECT Rol_idRol FROM Usuario WHERE idUsuario = ?', [req.user.id]);
            if (!urows || urows.length === 0) {
                return res.status(401).json({ mensaje: 'Usuario no encontrado' });
            }
            
            const roleId = urows[0].Rol_idRol;
            
            const [rows] = await conexionDB.execute(
                `SELECT p.idPermiso
                    FROM Permiso p
                    JOIN Permiso_Rol pr ON p.idPermiso = pr.Permiso_idPermiso
                    WHERE p.nombre = ? AND pr.Rol_idRol = ?`,
                [permName, roleId]
            );  
        
            if (rows && rows.length > 0) {
                return next();
            } else {
                await crearRegistroAcceso({
                    ip: req.ip,
                    ruta: req.originalUrl,
                    metodo: req.method,
                    username_proporcionado: req.user.username,
                    usuario_id: req.user.id,
                    rol_requerido: permName,
                    motivo: 'Permiso insuficiente',
                    detalle: `Rol ${roleId} no tiene permiso ${permName}`
                });

                return res.status(403).json({ mensaje: 'No tienes el permiso requerido' });
            }
        }   catch (err) {
            console.error('requirePermission error:', err);
            await crearRegistroAcceso({ ip: req.ip, ruta: req.originalUrl, metodo: req.method, motivo: 'Error validando permiso', detalle: err.message });
            return res.status(500).json({ mensaje: 'Error validando permiso' });
        }
    };
};
