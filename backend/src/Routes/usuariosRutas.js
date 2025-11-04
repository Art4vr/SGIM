//definicion de rutas para la gestion de usuarios
import express from 'express';

import { authMiddleware } from '../Middleware/authMiddleware.js';
import { requirePermission, requireRole } from '../Middleware/roleMiddleware.js';
import {
    registerController,
    listarUsuariosController,
    modificarUsuarioController,
    eliminarUsuarioController
} from '../Controllers/usuarioControlador.js';

const router = express.Router();

// Rutas para la gestión de usuarios
router.post('/register', authMiddleware, requirePermission('crear_usuario'), registerController);
router.get('/', authMiddleware, requirePermission('ver_usuarios'), listarUsuariosController);
//ruta para modificar usuario
router.put('/editar/:id', authMiddleware, requirePermission('editar_usuario'), modificarUsuarioController);
//ruta para eliminar usuario
router.delete('/eliminar/:id', authMiddleware, requirePermission('eliminar_usuario'), eliminarUsuarioController);

export default router;
