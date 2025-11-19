/*CONTROLADOR CATALOGO

- Almacena aquellos controladores donde hay consultas simples que sirven como catálogo
- Se agruparon:
categoría:de la tabla categoria para productos
medidas: de la tabla unidadMedida para productos, inventario
categoría de platillo: de la tabla platillo, la columna categoria. Usada para el menú
mesa: de la tabla mesa para su asignacion en el restaurante 
rol: de la tabla rol para los permisos y roles de los usuarios*/ 


//Funciona como la API para las distintas entidades
// Maneja las solicitudes de las rutas y se comunica con el modelo correspondiente

import { 
    obtenerMedidas, 
    obtenerCategoria, 
    obtenerCategoriaPlatillo, 
    obtenerMesa, obtenerRol
} from '../Models/catalogoModelo.js';

//-------------- CATEGORIA -------------------------------------------

export const listaCategoriasController = async (req, res) => {
    try {
        const categoria = await obtenerCategoria();
        res.json(categoria);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al consultar categorías' });
    }
}

//-------------- UNIDAD MEDIDA -------------------------------------------

export const listaMedidasController = async (req, res) => {
    try {
        const medidas = await obtenerMedidas();
        res.json(medidas);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener unidades de medida' });
    }
}

//-------------- CATEGORIA PLATILLO -------------------------------------------

export const listaCategoriasPlatilloController = async (req, res) => {
    try {
        const categoriaPlatillo = await obtenerCategoriaPlatillo();
        res.json(categoriaPlatillo);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al consultar categorías de platillos' });
    }
}

//-------------- MESA -------------------------------------------

export const listaMesasController = async (req, res) => {
    try {
        const mesa = await obtenerMesa();
        res.json(mesa);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener mesas' });
    }
}

//-------------- ROL -------------------------------------------

export const listaRolesController = async (req, res) => {
    try {
        const roles = await obtenerRol();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al consultar roles' });
    }
}   



