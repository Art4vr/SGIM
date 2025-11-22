import express from 'express';
import {
    agregarOrdenController,
    modificarOrdenController,
    obtenerOrdenesController,
    enviarOrdenACocinaController
} from '../Controllers/ordenMeseroControlador.js';

import {   
    actualizarPlatilloOrdenController,
    eliminarPlatilloOrdenController,
    obtenerPlatillosOrdenController,
    agregarPlatilloOrdenController, 
    obtenerPlatillosMeseroController
} from '../Controllers/ordenPlatilloControlador.js';

const router = express.Router();

// Obtener todos las ordenes
router.get('/',obtenerOrdenesController);

// Agregar orden
router.post('/', agregarOrdenController);

// Modificar orden
router.put('/:id', modificarOrdenController);

// Obtener platillos de una orden
router.get('/:idOrden/platillos', obtenerPlatillosOrdenController);

// Agregar platillo a la orden          
router.post('/:idOrden/platillos', agregarPlatilloOrdenController);

// Actualizar platillo         
router.put('/platillos/:idPlatilloOrden', actualizarPlatilloOrdenController);

// Eliminar platillo
router.delete('/platillos/:idPlatilloOrden', eliminarPlatilloOrdenController); 

// Enviar platillos a cocina
router.put('/enviarACocina/:idOrden', enviarOrdenACocinaController);

// Obtener platillos de ordenes equivalentes a un mesero en especifico
router.get('/mesero/:idMesero/platillos', obtenerPlatillosMeseroController);

export default router;