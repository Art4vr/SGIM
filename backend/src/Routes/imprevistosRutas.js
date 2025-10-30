import express from 'express';

import { authMiddleware } from '../Middleware/authMiddleware.js';
import { requirePermission, requireRole } from '../Middleware/roleMiddleware.js';

import { nuevoImprevistoController, consultaImprevistoController } from '../Controllers/imprevistoControlador.js';

const router = express.Router();

//Registrar Imprevisto -> Chef - Rol 3
router.post('/crear', authMiddleware, requireRole([3]), nuevoImprevistoController);

//Listar Imprevistos -> Gerente | Chef - Rol 1|3
router.get('/listar', authMiddleware, requireRole([1,3]), consultaImprevistoController);

export default router;
