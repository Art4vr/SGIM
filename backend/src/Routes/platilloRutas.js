import express from 'express';
import {
    
    agregarPlatilloController,
    eliminarPlatilloController,
    modificarPlatilloController,
    obtenerPlatillosController
    } from '../Controllers/platilloControlador.js';

const router = express.Router();

// Obtener todos los platillos
router.get('/',obtenerPlatillosController);

// Agregar platillos
router.post('/', agregarPlatilloController);

// Modificar platillos
router.put('/:id', modificarPlatilloController);

// Eliminar platillos
router.delete('/:id', eliminarPlatilloController);

export default router;