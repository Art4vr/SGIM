import express from 'express';

import { authMiddleware } from '../Middleware/authMiddleware.js';
import { requirePermission, requireRole } from '../Middleware/roleMiddleware.js';

import { nuevaRecetaController, editarRecetaController,eliminarIngredienteController, consultaRecetaController, eliminarRecetaCompletaController } from '../Controllers/productoPlatilloControlador.js';

const router = express.Router();

//Registrar ProductoPlatillo -> Gerente - Rol 1
router.post('/agregar', authMiddleware, requireRole([1]), nuevaRecetaController);

//Listar ProductoPlatillo -> Gerente | Chef | Mesero - Rol 1|3
router.get('/obtener/:id', authMiddleware, requirePermission('ver_platillos', 'ver_productos'), consultaRecetaController);

//Editar ProductoPlatillo -> Gerente - Rol 1
router.put('/editar/:id', authMiddleware, requireRole([1]), editarRecetaController);

//Eliminar ProductoPlatillo / ingrediente -> Gerente - Rol 1
router.delete('/eliminar/:id', authMiddleware, requireRole([1]), eliminarIngredienteController);

//Eliminar Receta Completa -> Gerente - Rol 1
router.delete('/eliminarReceta/:id', authMiddleware, requireRole([1]), eliminarRecetaCompletaController);

export default router;
