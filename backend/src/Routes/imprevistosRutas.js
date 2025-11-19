import express from 'express';

import { authMiddleware } from '../Middleware/authMiddleware.js';
import { requirePermission, requireRole } from '../Middleware/roleMiddleware.js';

import { evaluarImprevistoController, nuevoImprevistoController, consultaImprevistoController, editarImprevistoController, eliminarImprevistoController } from '../Controllers/imprevistoControlador.js';

const router = express.Router();

//Registrar Imprevisto -> Chef - Rol 3
router.post('/crear', authMiddleware, requirePermission('crear_imprevisto'), nuevoImprevistoController);

//Listar Imprevistos -> Gerente | Chef - Rol 1|3
router.get('/listar', authMiddleware, requirePermission('ver_imprevistos'), consultaImprevistoController);

//Aprobar Imprevisto -> Gerente - Rol 1
router.put('/evaluar/:id', authMiddleware, requireRole([1]), evaluarImprevistoController);

//Editar Imprevisto -> Chef - Rol 3
router.put('/editar/:id', authMiddleware, requireRole([1]), editarImprevistoController);

//Eliminar Imprevisto -> Chef - Rol 3
router.delete('/eliminar/:id', authMiddleware, requireRole([1]), eliminarImprevistoController);

export default router;
