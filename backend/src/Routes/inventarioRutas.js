import express from 'express';

import { registrarInventarioController, eliminarInventarioController, actualizarInventarioController, listarProductosInventarioController } from '../Controllers/inventarioControlador.js';

import { actualizarStockController } from '../Controllers/updateStockController.js';

const router = express.Router();

// Obtener todos los lotes de productos en inventario
router.get('/',listarProductosInventarioController);

// Agregar registro de inventario de algún producto
router.post('/crear', registrarInventarioController);

// Modificar lote de producto
router.put('/:id', actualizarInventarioController);

// Eliminar registro de inventario
router.delete('/:id', eliminarInventarioController);

//Ruta para actualizar el stock
router.post('/actualizar-stock', actualizarStockController);

export default router;