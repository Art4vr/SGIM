import express from 'express';

import { authMiddleware } from '../Middleware/authMiddleware.js';
import { requirePermission, requireRole } from '../Middleware/roleMiddleware.js';

import {
    agregarPlatilloController,
    eliminarPlatilloController,
    modificarPlatilloController,
    obtenerPlatillosController
    } from '../Controllers/platilloControlador.js';

const router = express.Router();
//Con autenticacion

// Obtener todos los platillos
router.get('/', authMiddleware, requireRole([1,3,4]), obtenerPlatillosController);

// Agregar platillos
router.post('/', authMiddleware, requirePermission('crear_platillos'), agregarPlatilloController);

// Modificar platillos
router.put('/:id', authMiddleware, requirePermission('editar_platillo'), modificarPlatilloController);

// Eliminar platillos
router.delete('/:id', authMiddleware, requirePermission('eliminar_platillo'), eliminarPlatilloController);

export default router;