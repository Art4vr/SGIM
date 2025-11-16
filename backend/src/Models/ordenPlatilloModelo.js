//Configuracion del modelo para la tabla Platillo_Orden
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los platillos de las ordenes
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

// --------------------- AGREGAR PLATILLO A ORDEN -----------------------------
export const agregarPlatilloOrden = async (conn, { idOrden, idPlatillo, cantidad, precioUnitario }) => {
    try { 
            // Se insertan los platillos por separados 
            const [resultado] = await conn.execute(
                'INSERT INTO Platillo_Orden (Orden_idOrden, Platillo_idPlatillo, cantidad, precioUnitario) VALUES (?, ?, ?, ?)',
                [idOrden, idPlatillo, cantidad, precioUnitario]
            );
        return { idPlatilloOrden: resultado.insertId };
    } catch (err) {
        console.error('Error en agregarPlatilloOrden:', err);
        throw new Error('Error al agregar el platillo a la orden');
    }
};

// --------------------- ACTUALIZAR PLATILLO DE ORDEN -------------------------
export const actualizarPlatilloOrden = async (conn, { idPlatilloOrden, cantidad, precioUnitario, estado }) => {
    const query = `
        UPDATE Platillo_Orden
        SET 
            cantidad = COALESCE(?, cantidad),
            precioUnitario = COALESCE(?, precioUnitario),
            estado = COALESCE(?, estado)
        WHERE idPlatilloOrden = ?
    `;
    try {
        const [resultado] = await conn.execute(query, [cantidad, precioUnitario, estado, idPlatilloOrden]);
        return resultado.affectedRows;
    } catch (err) {
        console.error('Error en actualizarPlatilloOrden:', err);
        throw new Error('Error al actualizar el platillo en la orden');
    }
};

// --------------------- ELIMINAR PLATILLO DE ORDEN ---------------------------
export const eliminarPlatilloOrden = async (conn, { idPlatilloOrden }) => {
    const query = `
        DELETE FROM Platillo_Orden
        WHERE idPlatilloOrden = ?
    `;
    try {
        const [resultado] = await conn.execute(query, [idPlatilloOrden]);
        return resultado.affectedRows;
    } catch (err) {
        console.error('Error en eliminarPlatilloOrden:', err);
        throw new Error('Error al eliminar el platillo de la orden');
    }
};

// --------------------- OBTENER PLATILLOS DE UNA ORDEN -----------------------
export const obtenerPlatillosOrden = async (conn, idOrden) => {
    const query = `
        SELECT
            po.idPlatilloOrden, 
            po.Orden_idOrden, 
            po.Platillo_idPlatillo, 
            p.nombre AS platillo,
            c.nombre AS categoria,
            po.cantidad, 
            po.precioUnitario, 
            po.estado
        FROM Platillo_Orden po
        JOIN Platillo p ON po.Platillo_idPlatillo = p.idPlatillo
        LEFT JOIN platillo_categoria c ON p.id_categoria = c.id_categoria_platillo
        WHERE po.Orden_idOrden = ?
    `;
    try {
        const [rows] = await conn.execute(query, [idOrden]);
        return rows;
    } catch (err) {
        console.error('Error en obtenerPlatillosOrden:', err);
        throw new Error('Error al obtener los platillos de la orden');
    }
};