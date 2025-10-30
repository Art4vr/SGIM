//Configuracion del controlador para el inventario o stock de productos
//Este controlador funciona como la API para gestionar el inventario
//se conecta al modelo (inventarioModelo.js) y a las rutas (inventarioRutas.js)
//realiza las operaciones CRUD definidas en el modelo sobre la BD

import { listarInventario, eliminarInventario, actualizarInventario, ingresarInventario } from "../Models/inventarioModelo.js";


//--------------------- LISTAR INVENTARIO-----------------------------------------
// Controlador para obtener el inventario de productos
export const listarProductosInventarioController = async (req, res) => {
    const { filtro = null, busqueda = null } = req.query;

    try {
        const resultados = await listarInventario(filtro, busqueda);
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos en inventario. -inventarioController' });
        }

        res.status(200).json({ mensaje: 'Productos en inventario-inventarioController:', resultados });
    } catch (err) {
        console.error('Error al listar inventario-inventarioController:', err);
        res.status(500).json({
            mensaje: err.message || 'Error con la solicitud-inventarioController'
        });
    }
};

//--------------------- CREAR INVENTARIO-----------------------------------------
// Controlador para crear o registrar un nuevo lote de algún producto y registrar en inventario
export const registrarInventarioController = async (req,res) => {
    try{
        console.log("req.body: ", req.body);
        const {Producto_idProducto, cantidadMaxima, cantidadMinima, cantidadActual, fechaCaducidad, Proveedor_idProveedor, Usuario_idUsuario,UnidadMedida_idUnidadMedida} = req.body;
        const nuevoInventarioId = await ingresarInventario({Producto_idProducto, cantidadMaxima, cantidadMinima, cantidadActual, fechaCaducidad, Proveedor_idProveedor, Usuario_idUsuario,UnidadMedida_idUnidadMedida});
        res.status(201).json({mensaje:'Producto registrado en inventario con éxito',nuevoInventarioId});
    }catch(err){
        console.error('Error al registrar producto en inventario-inventarioController:', err);
        res.status(500).json({
            mensaje: err.message || 'Error con la solicitud-inventarioController'
        });
    }
};


//--------------------- ELIMINAR INVENTARIO-----------------------------------------
// Controlador para eliminar el registro en inventario de algún producto
export const eliminarInventarioController = async (req,res) => {

    try{
        const { idInventarioProducto } = req.params;
        const resultado =  await eliminarInventario(idInventarioProducto);
        if(!resultado){
            return res.status(404).json({ mensaje: 'Producto no encontrado en inventario. -inventarioController' });
        }
        res.status(200).json({ mensaje: 'Producto eliminado de inventario. -inventarioController', resultado });
    }catch(err){
        console.error('Error al eliminar producto del inventario-inventarioController:', err);
        res.status(500).json({
            mensaje: err.message || 'Error con la solicitud-inventarioController'
        });
    }
};

//--------------------- MODIFICAR INVENTARIO-----------------------------------------
// Controlador para editar el registrp en inventario de cierto producto
// ya sea para editar datos por error de dedo o para actualizar la cantidad actual en base al uso de productos
export const actualizarInventarioController = async (req,res) => {

    const { id } = req.params;
    //validaciones o restricciones al momento de editar
    if (!id) {
        return res.status(400).json({ mensaje: 'ID de inventario es requerido. -inventarioController' });
    }

    try{
        const {Producto_idProducto, cantidadMaxima, cantidadMinima, cantidadActual, fechaCaducidad, Proveedor_idProveedor,UnidadMedida_idUnidadMedida} = req.body;
        const resultado = await actualizarInventario({ idInventarioProducto: id, Producto_idProducto, cantidadMaxima, cantidadMinima, cantidadActual, fechaCaducidad, Proveedor_idProveedor,UnidadMedida_idUnidadMedida });
        if(!resultado){
            return res.status(404).json({ mensaje: 'Producto no encontrado en inventario. -inventarioController' });
        }
        res.status(200).json({ mensaje: 'Lote de Producto actualizado en inventario. -inventarioController', resultado });
    }catch(err){
        console.error('Error al actualizar producto en inventario-inventarioController:', err);
        res.status(500).json({
            mensaje: err.message || 'Error con la solicitud-inventarioController'
        });
    }
};