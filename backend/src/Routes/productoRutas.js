import express from 'express';

import { authMiddleware } from '../Middleware/authMiddleware.js';
import { requirePermission, requireRole } from '../Middleware/roleMiddleware.js';

import {
    
    agregarProductoController,
    eliminarProductoController,
    modificarProductoController,
    obtenerProductosController
    } from '../Controllers/productoControlador.js';

    const router = express.Router();

//Con autenticacion

// Obtener todos los productos
router.get('/', authMiddleware, requireRole([1,2,3]), obtenerProductosController);

// Agregar producto
router.post('/', authMiddleware, requirePermission('gestionar_productos'), agregarProductoController);

// Modificar producto
router.put('/:id', authMiddleware, requirePermission('gestionar_productos'), modificarProductoController);

// Eliminar producto
router.delete('/:id', authMiddleware, requirePermission('gestionar_productos'), eliminarProductoController);

/*
//Sin autenticacion

router.get('/', obtenerProductosController);

// Agregar producto
router.post('/', agregarProductoController);

// Modificar producto
router.put('/:id', modificarProductoController);

// Eliminar producto
router.delete('/:id', eliminarProductoController);
*/
export default router;