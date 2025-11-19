import express from 'express';

import { 
    listaRolesController, 
    listaCategoriasController, 
    listaCategoriasPlatilloController, 
    listaMedidasController, 
    listaMesasController } from '../Controllers/catalogoControlador.js';


const router = express.Router();

//----------------------- RUTAS DE ROLES---------------------------
router.get('/roles', listaRolesController);

//----------------------- RUTAS DE MESAS---------------------------
router.get('/mesas', listaMesasController);

//----------------------- RUTAS DE CATEGORIAS DE PLATILLO ----------------
router.get('/categoriasPlatillo',listaCategoriasPlatilloController);

//----------------------- RUTAS DE CATEGORIAS---------------------------
router.get('/categorias', listaCategoriasController);

//----------------------- RUTAS DE UNIDADES---------------------------
router.get('/unidades', listaMedidasController);


export default router;