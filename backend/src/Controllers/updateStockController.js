//Configuracion del controlador para el inventario o stock de productos
//Este controlador funciona como la API para gestionar el inventario
//se conecta al modelo (.js) y a las rutas ()
//realiza las operaciones CRUD definidas en el modelo sobre la BD

import { actualizarStock, obtenerStock } from "../Models/updateStockModelo.js";

// --------------------- CONTROLADOR PARA ACTUALIZAR STOCK -----------------------------
export const actualizarStockController = async (req, res) => {
    try {
        const productos = req.body.productos;

        if (!productos || !Array.isArray(productos)) {
            return res.status(400).json({ msg: "Formato inválido" });
        }

        await actualizarStock(productos);

        res.json({ msg: "Stock actualizado correctamente" });

    } catch (error) {
        console.error("Error al actualizar stock:", error);
        res.status(500).json({ msg: "Error al actualizar stock", error });
    }
};


// --------------------- CONTROLADOR PARA VERIFICAR STOCK -----------------------------
export const verificarStockController = async (req, res) => {
    try {
        const productos = req.body.productos;

        if (!productos || !Array.isArray(productos)) {
            return res.status(400).json({ msg: "Formato inválido" });
        }

        // Array donde guardaremos los productos con falta de stock
        const sinStock = [];

        // Recorrer cada producto y consultar stock actual
        for (const p of productos) {
            const stockDB = await obtenerStock(p.Producto_idProducto);

            const stockActual = stockDB?.stock ?? 0;

            if (stockActual < p.cantidad) {
                sinStock.push({
                    Producto_idProducto: p.Producto_idProducto,
                    requerido: p.cantidad,
                    stockActual,
                });
            }
                    console.log("Verificando producto:", p.Producto_idProducto);
                    console.log("Stock en BD:", stockActual);
                    console.log("Requerido:", p.cantidad);
        }


        return res.json({ ok: true, sinStock });

    } catch (error) {
        console.error("Error en verificar stock:", error);
        res.status(500).json({ msg: "Error al verificar stock", error });
    }
};