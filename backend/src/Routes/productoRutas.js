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
router.get('/', authMiddleware, requirePermission('ver_productos'), obtenerProductosController);

// Agregar producto
router.post('/', authMiddleware, requirePermission('crear_producto'), agregarProductoController);

// Modificar producto
router.put('/:id', authMiddleware, requirePermission('editar_producto'), modificarProductoController);

// Eliminar producto
router.delete('/:id', authMiddleware, requirePermission('eliminar_producto'), eliminarProductoController);

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