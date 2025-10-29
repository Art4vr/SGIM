//definicion de rutas para la gestion de usuarios
import express from 'express';
import {
    registerController,
    listarUsuariosController,
    modificarUsuarioController,
    eliminarUsuarioController
} from '../Controllers/usuarioControlador.js';

const router = express.Router();

// Rutas para la gestión de usuarios
router.post('/register', registerController);
router.get('/', listarUsuariosController);
router.put('/:id', modificarUsuarioController);
router.delete('/:id', eliminarUsuarioController);

export default router;
