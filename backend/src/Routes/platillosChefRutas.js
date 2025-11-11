import express from 'express';
import {
    modificarOrdenChefController,
    getPlatillosChefController,
} from '../Controllers/ordenChefControlador.js';


const router = express.Router();

// Obtener los platillos que debe preparar el chef
router.get('/platillos', getPlatillosChefController);

// Actualizar el estado de un platillo 
router.put('/platillos', modificarOrdenChefController);

export default router;