// --------------------- ACTUALIZAR STOCK -----------------------------
// Recibe un array de productos con la cantidad a descontar
// ejemplo: [{ Producto_idProducto: 1, cantidad: 2 }, { Producto_idProducto: 2, cantidad: 1 }]
import conexionDB from "../config/db.js";
import {listarInventario} from './inventarioModelo.js';
// --------------------- ACTUALIZAR STOCK (FIFO POR LOTE) -----------------------------
export const actualizarStock = async (productos) => {
    try {
        for (const producto of productos) {

            const { Producto_idProducto, cantidad } = producto;

            //Obtener datos del producto del platillo seleccionado , agarrando productos a punto de caducar 
            const [inventario] = await conexionDB.execute(
                `SELECT * 
                FROM inventarioproducto 
                WHERE Producto_idProducto = ?
                ORDER BY fechaCaducidad ASC`,
                [Producto_idProducto]
            );

            if (!inventario || inventario.length === 0) {
                console.warn(`No hay inventario para el producto ${Producto_idProducto}`);
                continue;
            }

            let restante = cantidad;
            //Validaciones para cantidades necesarias | cantidades disponibles
            for (const lote of inventario) {
                if (restante <= 0) break;

                if (lote.cantidadActual >= restante) {
                    // Este lote alcanza para cubrir lo restante
                    await conexionDB.execute(
                        `UPDATE inventarioproducto 
                        SET cantidadActual = ? 
                        WHERE idInventarioProducto = ?`,
                        [lote.cantidadActual - restante, lote.idInventarioProducto]
                    );
                    restante = 0;
                } else {
                    // Este lote no es suficiente (disponibilidad)
                    await conexionDB.execute(
                        `UPDATE inventarioproducto 
                        SET cantidadActual = 0 
                        WHERE idInventarioProducto = ?`,
                        [lote.idInventarioProducto]
                    );
                    restante -= lote.cantidadActual; // faltante para el siguiente lote
                }
            }

            // Aviso que no hay cantidad de producto necesario
            if (restante > 0) {
                console.warn(
                    `Inventario insuficiente para el producto ${Producto_idProducto}. Faltaron ${restante}`
                );
            }
        }
    } catch (error) {
        console.error("Error en actualizarStock FIFO:", error);
        throw error;
    }
};