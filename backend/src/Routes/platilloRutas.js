import express from 'express';
import {
    
    agregarPlatilloController,
    eliminarPlatilloController,
    modificarPlatilloController,
    obtenerPlatillosController
    } from '../Controllers/platilloControlador.js';

const router = express.Router();

// Obtener todos los productos
router.get('/',obtenerPlatillosController);

// Agregar producto
router.post('/', agregarPlatilloController);

// Modificar producto
router.put('/:id', modificarPlatilloController);

// Eliminar producto
router.delete('/:id', eliminarPlatilloController);

export default router;