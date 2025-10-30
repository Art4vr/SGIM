import conexionDB from '../config/db.js';

export const crearRegistroAcceso = async ({
    ip, ruta, metodo, username_proporcionado, usuario_id = null,
    rol_requerido = null, motivo, detalle = null
}) => {
    const query = `INSERT INTO RegistroAcceso
        (ip, ruta, metodo, username_proporcionado, usuario_id, rol_requerido, motivo, detalle)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [ip, ruta, metodo, username_proporcionado, usuario_id, rol_requerido, motivo, detalle];
    const [result] = await conexionDB.execute(query, params);
    return result.insertId;
};
