import express from 'express';
import {
    
    agregarProveedorController,
    eliminarProveedorController,
    modificarProveedorController,
    obtenerProveedoresController
    } from '../Controllers/proveedorController.js';

    const router = express.Router();

// Obtener todos los proveedores
router.get('/',obtenerProveedoresController);

// Agregar proveedores
router.post('/', agregarProveedorController);

// Modificar proveedores
router.put('/:id', modificarProveedorController);

// Eliminar proveedores
router.delete('/:id', eliminarProveedorController);

export default router;