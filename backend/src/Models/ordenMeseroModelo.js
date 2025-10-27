//Configuracion del modelo para la tabla orden
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con las ordenes
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

// --------------------- CREAR ORDEN -----------------------------------------
export const agregarOrden = async (conn, { idUsuario, idMesa }) => {
    const query = `
        INSERT INTO Orden (Usuario_idUsuario, Mesa_idMesa)
        VALUES (?, ?)`;
    try {
        const [resultado] = await conn.execute(query, [idUsuario, idMesa]);
        return resultado.insertId; // Retorna el id generado
    } catch (err) {
        console.error('Error en agregarOrden:', err);
        throw new Error('Error al insertar la orden en la base de datos');
    }
};

// --------------------- ACTUALIZAR ORDEN ------------------------------------
export const actualizarOrden = async (conn, { idOrden, estado, total }) => {
    const campos = [];
    const params = [];

    if (estado !== undefined) {
        campos.push('estado = ?');
        params.push(estado);
    }

    if (total !== undefined) {
        campos.push('total = ?');
        params.push(total);
    }

    if (campos.length === 0) {
        console.warn('Ningún campo para actualizar en actualizarOrden()');
        return 0;
    }

    const query = `
        UPDATE Orden
        SET ${campos.join(', ')}
        WHERE idOrden = ?
    `;
    params.push(idOrden);

    try {
        const [resultado] = await conn.execute(query, params);
        return resultado.affectedRows;
    } catch (err) {
        console.error('Error en actualizarOrden:', err);
        throw new Error('Error al actualizar la orden');
    }
};

// --------------------- CALCULAR TOTAL DE LA ORDEN ---------------------------
export const calcularTotalOrden = async (conn, idOrden) => {
    const query = `
        SELECT IFNULL(SUM(cantidad * precioUnitario), 0) AS total
        FROM Platillo_Orden
        WHERE Orden_idOrden = ?
    `;
    try {
        const [rows] = await conn.execute(query, [idOrden]);
        return rows[0]?.total ?? 0;
    } catch (err) {
        console.error('Error en calcularTotalOrden:', err);
        throw new Error('Error al calcular el total de la orden');
    }
};

// --------------------- FINALIZAR ORDEN ------------------------------------
export const finalizarOrden = async (conn, idOrden, idMesa) => {
    try {
        await conn.beginTransaction();

        // Actualizar el estado de la orden a 'cerrada'
        await actualizarOrden(conn, { idOrden, estado: 'cerrada' });

        // Liberar la mesa
        await conn.execute('UPDATE Mesa SET estado = ? WHERE idMesa = ?', ['disponible', idMesa]);

        await conn.commit();
        return true;
    } catch (err) {
        await conn.rollback();
        console.error('Error al finalizar la orden:', err);
        throw new Error('Error al finalizar la orden');
    }
};