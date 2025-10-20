//Configuracion del modelo para la tabla Pedido (Proveedores)
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los productos
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

//--------------------- ALTA PRODUCTO-----------------------------------------
// Funcion para dar de alta un producto
export const agregarPedido = async ({ fecha, idUsuario, idProveedor })=>{ 
    const query = 'INSERT INTO Pedido (fecha, Usuario_idUsuario, Proveedor_idProveedor) VALUES (?, ?, ?)';
    try{
        const[resultado] = await conexionDB.execute(query,[fecha, idUsuario, idProveedor]);
        return resultado.insertId; 
    }catch(err){
        console.error('Error con la base de datos (agregarPedidoProveedor): ', err); //manejo de errores
        throw err;
    }
};

//--------------------- BAJA PRODUCTO-----------------------------------------
// ¿Se eliminan los pedidos? ¿cuándo?
// Funcion para dar de baja un pedido
export const eliminarPedido = async (idPedido) => {
    const query = 'DELETE FROM Pedido WHERE idPedido = ?';
    try {
        const [resultado] = await conexionDB.execute(query, [idPedido]);
        return resultado.affectedRows; // Devuelve cuántas filas fueron afectadas (1 si se eliminó, 0 si no existía)
    } catch (err) {
        console.error('Error al eliminar el pedido:', err);
        throw err;
    }
};

//--------------------- ACTUALIZACION PEDIDO-----------------------------------------
// Funcion para actualizar un pedido (solo se actualiza el estado de un pedido)
export const actualizarPedido = async ({ idPedido, estado }) => {
    
    if (!idPedido || estado === undefined) {
        throw new Error('Faltan datos: idPedido o estado');
    }

    const query = 'UPDATE Pedido SET estado = ? WHERE idPedido = ?';
    try {
        const [resultado] = await conexionDB.execute(query, [estado, idPedido]);
        return resultado.affectedRows;
    } catch (err) {
        console.error('Error al actualizar el pedido:', err);
        throw err;
    }
};
