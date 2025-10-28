//Configuracion del modelo para la tabla Platillo_Orden
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los platillos de las ordenes
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

// --------------------- AGREGAR PLATILLO A ORDEN -----------------------------
export const agregarPlatilloOrden = async (conn, { idOrden, idPlatillo, cantidad, precioUnitario }) => {
    try {
        // Verificar si el platillo ya está en la orden
        const [rows] = await conn.execute(
            'SELECT cantidad FROM Platillo_Orden WHERE Orden_idOrden = ? AND Platillo_idPlatillo = ?',
            [idOrden, idPlatillo]
        );

        if (rows.length > 0) {
            // Si ya existe, actualizar la cantidad sumando la nueva
            const nuevaCantidad = rows[0].cantidad + cantidad;
            await conn.execute(
                'UPDATE Platillo_Orden SET cantidad = ?, precioUnitario = ? WHERE Orden_idOrden = ? AND Platillo_idPlatillo = ?',
                [nuevaCantidad, precioUnitario, idOrden, idPlatillo]
            );
        } else {
            // Si no existe, insertar normalmente
            await conn.execute(
                'INSERT INTO Platillo_Orden (Orden_idOrden, Platillo_idPlatillo, cantidad, precioUnitario) VALUES (?, ?, ?, ?)',
                [idOrden, idPlatillo, cantidad, precioUnitario]
            );
        }

        return { idOrden, idPlatillo };
    } catch (err) {
        console.error('Error en agregarPlatilloOrden:', err);
        throw new Error('Error al agregar el platillo a la orden');
    }
};

// --------------------- ACTUALIZAR PLATILLO DE ORDEN -------------------------
export const actualizarPlatilloOrden = async (conn, { idOrden, idPlatillo, cantidad, precioUnitario, estado }) => {
    const query = `
        UPDATE Platillo_Orden
        SET 
            cantidad = COALESCE(?, cantidad),
            precioUnitario = COALESCE(?, precioUnitario),
            estado = COALESCE(?, estado)
        WHERE Orden_idOrden = ? AND Platillo_idPlatillo = ?
    `;
    try {
        const [resultado] = await conn.execute(query, [cantidad, precioUnitario, estado, idOrden, idPlatillo]);
        return resultado.affectedRows;
    } catch (err) {
        console.error('Error en actualizarPlatilloOrden:', err);
        throw new Error('Error al actualizar el platillo en la orden');
    }
};

// --------------------- ELIMINAR PLATILLO DE ORDEN ---------------------------
export const eliminarPlatilloOrden = async (conn, { idOrden, idPlatillo }) => {
    const query = `
        DELETE FROM Platillo_Orden
        WHERE Orden_idOrden = ? AND Platillo_idPlatillo = ?
    `;
    try {
        const [resultado] = await conn.execute(query, [idOrden, idPlatillo]);
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