//Configuracion y definicion de rutas para la aplicacion
// Cada ruta esta asociada a un controlador que maneja la logica de negocio
// Las rutas definen los endpoints que los clientes pueden utilizar para interactuar con la API

//importacion de la libreria express que sirve para crear las rutas
import express from 'express';
//importacion de las funciones de los controladores
import {loginController,registerController} from '../Controllers/usuarioControlador.js';


//crear el router para definir las rutas de la app y sus controladores
const router = express.Router();


//----------------------- RUTAS DE USUARIO---------------------------
router.post('/login', loginController);
router.post('/registroUsuario',registerController);

export default router;