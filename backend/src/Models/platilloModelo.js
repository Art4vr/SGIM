//Configuracion del modelo para la tabla platillo
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los platillos
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';
import { eliminarRecetaPlatillo } from './productoPlatilloModelo.js';
import { obtenerLotes } from './inventarioModelo.js';

//--------------------- ALTA PLATILLO-----------------------------------------
// Funcion para dar de alta un platillo
export const agregarPlatillo = async ({ nombre, descripcion = null, id_categoria, imagen = null, precio })=>{ 
    try{

        //Descripcion e imagen es opcional
        const query = `
            INSERT INTO Platillo (nombre, descripcion, id_categoria, imagen, precio)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [nombre, descripcion, id_categoria, imagen, precio];
        const [resultado] = await conexionDB.execute(query, params);
        return resultado.affectedRows; 

    }catch(err){
        console.error('Error con la base de datos (agregarPlatillo): ', err); //manejo de errores
        throw err;
    }
};

//--------------------- BAJA PLATILLO -----------------------------------------
// Funcion para dar de baja un platillo
export const eliminarPlatillo = async (idPlatillo) => {
    const connection = await conexionDB.getConnection()
    const query = 'DELETE FROM Platillo WHERE idPlatillo = ?';
    try {
        //se hace una transaccion para eliminar primero la receta y luego el platillo
        await connection.beginTransaction();
        const resultadoReceta = await eliminarRecetaPlatillo(idPlatillo);
        //console.log('Ingredientes eliminados para el platillo id:', idPlatillo);
        //console.log('Resultado receta eliminada:', resultadoReceta);
        //validaciones necesarias antes de eliminar el platillo
        if (resultadoReceta === 0) {
            //console.log('No se encontraron ingredientes para el platillo con id:', idPlatillo);
        }
        const [resultado] = await connection.execute(query, [idPlatillo]);
        if (resultado.affectedRows === 0) {
            await connection.rollback();
            return 0; // No se encontró el platillo para eliminar
        }
        await connection.commit();
        return resultado.affectedRows; // Devuelve cuántas filas fueron afectadas (1 si se eliminó, 0 si no existía)
    } catch (err) {
        console.error('Error al eliminar platillo:', err);
        throw err;
    }
};

//--------------------- ACTUALIZACION PLATILLO -----------------------------------------
// Funcion para actualizar un platillo
export const actualizarPlatillo = async ({ idPlatillo, nombre, descripcion, id_categoria, imagen, precio, estado }) => {
    let query = 'UPDATE Platillo SET ';
    const params = [];
    const cambios = [];

    if (nombre) {
        cambios.push('nombre = ?');
        params.push(nombre);
    }
    if (descripcion) {
        cambios.push('descripcion = ?');
        params.push(descripcion);
    }
    if (id_categoria) {
        cambios.push('id_categoria = ?');
        params.push(id_categoria);
    }
    if (imagen) {
        cambios.push('imagen = ?');
        params.push(imagen);
    }
    if (precio) {
        cambios.push('precio = ?');
        params.push(precio);
    }
    if (estado) {
        cambios.push('estado = ?');
        params.push(estado);
    }

    // Si no hay campos para actualizar
    if (cambios.length === 0) return 0;

    query += cambios.join(', ') + ' WHERE idPlatillo = ?';
    params.push(idPlatillo);

    try {
        const [resultado] = await conexionDB.execute(query, params);
        return resultado.affectedRows; 
    } catch (err) {
        console.error('Error al modificar platillo:', err);
        throw err;
    }
};

//--------------------- OBTENER PLATILLO (PRODUCTO Y CANTIDAD)-----------------------------------------
// Funcion para mostrar los productos y cantidades de un platillo
export const obtenerProductoCantidad = async (Platillo_idPlatillo) => {
    let query = `SELECT Producto_idProducto, cantidad FROM producto_platillo WHERE Platillo_idPlatillo = ?`
    try{
        const[resultados] = await conexionDB.execute(query,[Platillo_idPlatillo]);//ejecuta la consulta
        //console.log("Resultados platillos: -modelo: ", resultados);
        return resultados; //devuelve los resultados de la consulta
    }catch(err){
        console.error('Error al ejecutar la consulta (obtenerProductoCantidad): ', err); //manejo de errores
        throw err;
    }
}

//--------------------- OBTENER PLATILLO-----------------------------------------
// Funcion para obtener todos los id de platillo
export const obtenerPlatilloId = async () => {
    let query = `SELECT idPlatillo FROM platillo`
    try{
        const[platillos] = await conexionDB.execute(query);//ejecuta la consulta
        //console.log("Resultados platillos: -modelo: ", resultados);
        return platillos; //devuelve los resultados de la consulta
    }catch(err){
        console.error('Error al ejecutar la consulta (obtenerPlatilloId): ', err); //manejo de errores
        throw err;
    }
}


//--------------------- DISPONIBILIDAD DE PLATILLO -----------------------------------------
// Funcion para recorrer los platillos y verificar la disponibilidad de los ingredientes
export const platilloDisponible = async () => {
    const platillos = await obtenerPlatilloId();
    try {
        for (const platillo of platillos) {
            const ingredientes = await obtenerProductoCantidad(platillo.idPlatillo); //contiene Platillo_idPlatillo, Producto_idProducto, cantidad de cada platillo
            
            //Obtener todos los lotes de productos disponibles
            const inventario = await obtenerLotes();
            if (!inventario || inventario.length === 0) {
                console.warn(`No hay inventario para algún producto del platillo ${platillo.idPlatillo}`);
                await conexionDB.execute(
                    `UPDATE platillo SET estado = 'agotado' WHERE idPlatillo = ?`,
                    [platillo.idPlatillo]
                );
                continue;
            }

            let platilloAgotado = false;
            
            for (const producto of ingredientes) {
                
                const { Producto_idProducto, cantidad } = producto;

                let cantrestante = cantidad;
                let cantdisponible = 0;

                // Filtramos los lotes que corresponden al producto
                const lotesProducto = inventario.filter(lote => lote.Producto_idProducto === Producto_idProducto);
                // Si no hay lotes disponibles para el producto, marcamos como agotado
                if (lotesProducto.length === 0) {
                    console.warn(`No hay lotes para el producto ${Producto_idProducto} en el inventario.`);
                    platilloAgotado = true;
                    break;  // Si no hay lotes, el platillo se marca como agotado
                }

                //Validaciones para cantidades necesarias | cantidades disponibles
                for (const lote of lotesProducto) {
                    if (cantrestante <= 0) break;

                    cantdisponible += lote.cantidadActual;

                    if (cantdisponible >= cantrestante) {
                        // Este lote alcanza para cubrir lo restante
                        cantrestante = 0;
                    } else {
                        // Este lote no es suficiente (disponibilidad)
                        cantrestante -= lote.cantidadActual; // faltante para el siguiente lote
                    }
                }

                // Aviso que no hay cantidad de producto necesario
                if (cantrestante > 0) {
                    platilloAgotado = true;
                    console.warn(
                        `Inventario insuficiente para el producto ${Producto_idProducto}. Faltaron ${restante}`
                    );
                    break;
                }
            }
            // Actualizamos el estado del platillo al final de la verificación
            if (platilloAgotado) {
                await conexionDB.execute(
                    `UPDATE platillo SET estado = 'agotado' WHERE idPlatillo = ?`,
                    [platillo.idPlatillo]
                );
            } else {
                // Si no faltaron ingredientes, marcamos el platillo como disponible
                await conexionDB.execute(
                    `UPDATE platillo SET estado = 'disponible' WHERE idPlatillo = ?`,
                    [platillo.idPlatillo]
                );
            }
        }
    } catch (error) {
        console.error("Error en platilloDisponible:", error);
        throw error;
    }
};
