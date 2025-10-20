import express from 'express';
import {
    
    agregarProductoController,
    eliminarProductoController,
    modificarProductoController,
    obtenerProductosController
    } from '../Controllers/productoControlador.js';

    const router = express.Router();

// Obtener todos los productos
router.get('/',obtenerProductosController);

// Agregar producto
router.post('/', agregarProductoController);

// Modificar producto
router.put('/:id', modificarProductoController);

// Eliminar producto
router.delete('/:id', eliminarProductoController);

export default router;