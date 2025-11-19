//Configuracion del controlador para imprevistos
// El controlador maneja las solicitudes de las rutas (imprevistoRutas.js) y se comunica con el modelo (imprevistoModelo.js)
//Este controlador funciona como la API para imprevistos
//realiza las operaciones CRUD definidas en el modelo 

//importacion de modelos a utilizar
import { agregarProductoPlatillo, actualizarProductoPlatillo,eliminarProductoPlatillo, obtenerProductoPlatillo, eliminarRecetaPlatillo } from "../Models/productoPlatilloModelo.js";

//--------------------- AÑADIR PRODUCTOS/INGREDIENTES AL PLATILLO -----------------------------------------
// Controlador para el registro de ingredientes en los platillos. Valida que el id sea unico y que los campos no esten vacios

export const nuevaRecetaController = async (req,res)=>{//crea la funcion asincrona que maneja la solicitud y la respuesta del registro
    try{
        const {idPlatillo, idProducto, unidadMedida, cantidad} = req.body;//extrae los datos del imprevisto del cuerpo de la solicitud

        if(!idPlatillo || !idProducto || !cantidad || !unidadMedida){//valida que los campos no queden vacios
            return res.status(400).json({mensaje: 'Faltan datos-Controller'});
        }
        const nuevaRecetaId = await agregarProductoPlatillo({idPlatillo, idProducto, unidadMedida, cantidad}); //llama la funcion del modelo. el nombre de los datos debe coincidir con el del modelo
        res.status(201).json({mensaje:'Receta registrada con éxito',nuevaRecetaId});//devuelve el id del nuevo imprevisto para confirmar
    }catch(err){
        console.error('Error en nuevaRecetaController:', err);
        res.status(500).json({//error del servidor
            mensaje: err.message || 'Error en el servidor'
        });
    }
};

//--------------------- CONSULTA DE PRODUCTOS/INGREDIENTES DEL PLATILLO -----------------------------------------
// Controlador para la busqueda o consulta de imprevistos. 
export const consultaRecetaController = async (req,res) => { //crea la funcion asincrona que maneja la solicitud y la respuesta
    const idPlatillo = req.params.id;
    try{ // ejecuta el bloque de codigo y captura errores
        const resultados = await obtenerProductoPlatillo(idPlatillo); //llama a la funcion del modelo para obtener el imprevisto solicitado
        res.status(200).json({mensaje:'Recetas disponibles',resultados});
    } catch(err){//manejo de errores
        console.error('Error al consultar recetas:',err);
        res.status(500).json({//error del servidor
            mensaje: err.message || 'Error con la solicitud'
        });
    }
};

//--------------------- MODIFICACIÓN DE INGREDIENTES DEL PLATILLO -----------------------------------------
// Controlador para la actualización o edición de recetas. 
export const editarRecetaController = async (req,res) => {
    const idPlatillo = req.params.id;
    const { idProducto, unidadMedida, cantidad} = req.body;

    try{
        const resultado = await actualizarProductoPlatillo({idPlatillo, idProducto, unidadMedida, cantidad });
        if (resultado === 0) {
            return res.status(404).json({ mensaje: 'Platillo o receta no encontrado. -productoPlatilloControlador' });
        }
        res.status(200).json({ mensaje: 'Receta de platillo actualizada con éxito.' });
    }catch(err){
        console.error('Error al editar ingredientes-productoPlatilloControlador:', err);
        res.status(500).json({
            mensaje: err.message || 'Error con la solicitud-productoPlatilloControlador'
        });
    }
};

//--------------------- ELIMINACIÓN DE RECETA COMPLETA -----------------------------------------
//Controlador para la eliminación de recetas completas.
export const eliminarRecetaCompletaController = async (req,res) => {
    const idPlatillo = req.params.id;
    try{
        const resultado = await eliminarRecetaPlatillo(idPlatillo);
        if (resultado === 0) {
            return res.status(404).json({ mensaje: 'Platillo o receta no encontrado. -productoPlatilloControlador' });
        }
        res.status(200).json({ mensaje: 'Receta completa eliminada con éxito.' });
    }catch(err){
        console.error('Error al eliminar receta completa-productoPlatilloControlador:', err);
        res.status(500).json({
            mensaje: err.message || 'Error con la solicitud-productoPlatilloControlador'
        });
    }
};

//--------------------- ELIMINACIÓN DE INGREDIENTE EN LA RECETA -----------------------------------------
// Controlador para la eliminación de recetas. 
export const eliminarIngredienteController = async (req,res) => {
    const idPlatillo = req.params.id;
    const { idProducto } = req.body;
    try{
        const resultado = await eliminarProductoPlatillo({idPlatillo, idProducto});
        if (resultado === 0) {
            return res.status(404).json({ mensaje: 'Platillo o receta no encontrado. -productoPlatilloControlador' });
        }
        res.status(200).json({ mensaje: 'Receta eliminada con éxito.' });
    }catch(err){
        console.error('Error al eliminar receta-productoPlatilloControlador:', err);
        res.status(500).json({
            mensaje: err.message || 'Error con la solicitud-productoPlatilloControlador'
        });
    }
};