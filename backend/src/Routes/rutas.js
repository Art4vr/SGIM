//Configuracion y definicion de rutas para la aplicacion
// Cada ruta esta asociada a un controlador que maneja la logica de negocio
// Las rutas definen los endpoints que los clientes pueden utilizar para interactuar con la API

//importacion de la libreria express que sirve para crear las rutas
import express from 'express';
import rateLimit from 'express-rate-limit';

//importacion de las funciones de los controladores
import {registerController} from '../Controllers/usuarioControlador.js';
import { loginController, logoutController, meController } from '../Controllers/authController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

//importancion de las funciones de los controladores de productos (con archivo)
import productoRutas from './productoRutas.js';
//importancion de controladores de categoria y medida
import { listaCategoriasController } from '../Controllers/categoriaControlador.js';
import { listaMedidasController } from '../Controllers/medidaControlador.js';
//crear el router para definir las rutas de la app y sus controladores
const router = express.Router();

// limitar intentos de login
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
    max: 10, // Máximo de 10 intentos por IP
    message: { mensaje: 'Demasiados intentos de login, intenta más tarde' }
});

//----------------------- RUTAS DE USUARIO---------------------------
router.post('/auth/login', authLimiter, loginController);
router.post('/auth/registroUsuario',registerController);
router.post('/auth/logout', logoutController);

router.get('/auth/me',authMiddleware,meController)

//----------------------- RUTAS DE PRODUCTO---------------------------
//se usa un archivo donde cada ruta de definen en ./productoRutas.js
router.use('/productos', productoRutas);

//----------------------- RUTAS DE CATEGORIAS---------------------------
router.get('/categorias', listaCategoriasController);

//----------------------- RUTAS DE UNIDADES---------------------------
router.get('/unidades', listaMedidasController);


export default router;