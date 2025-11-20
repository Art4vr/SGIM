//Configuracion del controlador para el inventario o stock de productos
//Este controlador funciona como la API para gestionar el inventario
//se conecta al modelo (.js) y a las rutas ()
//realiza las operaciones CRUD definidas en el modelo sobre la BD

import { actualizarStock } from "../Models/updateStockModelo.js";

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
