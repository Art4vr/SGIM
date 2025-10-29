import express from 'express';

import { authMiddleware } from '../Middleware/authMiddleware.js';
import { requirePermission, requireRole } from '../Middleware/roleMiddleware.js';

import { nuevoImprevistoController, consultaImprevistoController, editarImprevistoController, eliminarImprevistoController } from '../Controllers/imprevistoControlador.js';

const router = express.Router();

//Registrar Imprevisto -> Chef - Rol 3
router.post('/crear', authMiddleware, requireRole([3]), nuevoImprevistoController);

//Listar Imprevistos -> Gerente | Chef - Rol 1|3
router.get('/listar', authMiddleware, requireRole([1,3]), consultaImprevistoController);

//Editar Imprevisto -> Chef - Rol 3
router.put('/editar/:id', authMiddleware, requireRole([1]), editarImprevistoController);

//Eliminar Imprevisto -> Chef - Rol 3
router.delete('/eliminar/:id', authMiddleware, requireRole([1]), eliminarImprevistoController);

export default router;
