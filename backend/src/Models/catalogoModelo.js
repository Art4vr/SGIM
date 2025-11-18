import conexionDB from '../config/db.js';

//----------------------------- MODELOS PARA UNIDADES DE MEDIDA -----------------------------------
export const obtenerMedidas = async () => {
    const query = 'SELECT idUnidadMedida,medida,abreviatura,medidaEquivalente,factorConversion  FROM UnidadMedida';
    const [medidas] = await conexionDB.execute(query);
    return medidas;
};

//----------------------------- MODELOS PARA CATEGORÍAS DE PRODUCTOS -----------------------------------
export const obtenerCategoria = async () => {
    const query = 'SELECT idCategoria,nombre FROM Categoria';
    const [categoria] = await conexionDB.execute(query);
    return categoria;
};

//----------------------------- MODELOS PARA CATEGORÍAS DE PLATILLOS -----------------------------------
export const obtenerCategoriaPlatillo = async () => {
    const query = 'SELECT id_categoria_platillo,nombre FROM platillo_categoria';
    const [categoriaPlatillo] = await conexionDB.execute(query);
    return categoriaPlatillo;
};

//----------------------------- MODELOS PARA MESAS -----------------------------------
export const obtenerMesa = async () => {
    const query = 'SELECT idMesa,estado, numeroMesa FROM Mesa ORDER BY CASE WHEN estado = "disponible" THEN 0 ELSE 1 END, numeroMesa;';
    const [mesa] = await conexionDB.execute(query);
    return mesa;
};

// Funcion para actualizar la mesa cuando se hace una orden
export const actualizarMesa = async (conn, { idMesa, estado }) => {
    let query = 'UPDATE Mesa SET ';
    const params = [];
    const cambios = [];

    if (estado) {
        cambios.push('estado = ?');
        params.push(estado);
    }

    if (cambios.length === 0) return 0;

    query += cambios.join(', ') + ' WHERE idMesa = ?';
    params.push(idMesa);

    try {
        const [resultado] = await conn.execute(query, params); // <- usar la conexión de la transacción
        return resultado.affectedRows;
    } catch (err) {
        console.error('Error al modificar mesa:', err);
        throw err;
    }
};

//----------------------------- MODELOS PARA ROLES -----------------------------------
export const obtenerRol = async () => {
    const query = 'SELECT * FROM Rol';
    const [roles] = await conexionDB.execute(query);
    return roles;
};