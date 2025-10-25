//Configuracion del controlador para imprevistos
// El controlador maneja las solicitudes de las rutas (imprevistoRutas.js) y se comunica con el modelo (imprevistoModelo.js)
//Este controlador funciona como la API para imprevistos
//realiza las operaciones CRUD definidas en el modelo 

//importacion de modelos a utilizar
import { crearImprevisto,listarImprevisto } from "../Models/imprevistoModelo.js";

//--------------------- REGISTRO DE IMPREVISTO -----------------------------------------
// Controlador para el registro de imprevistos. Valida que el id sea unico y que los campos no esten vacios

export const nuevoImprevistoController = async (req,res)=>{//crea la funcion asincrona que maneja la solicitud y la respuesta del registro
    try{
        const {idUsuarioReporta,idInventarioProducto,descripcion,cantidad,idUnidadMedida} = req.body;//extrae los datos del imprevisto del cuerpo de la solicitud

        if(!idUsuarioReporta || !idInventarioProducto || !cantidad){//valida que los campos no queden vacios
            return res.status(400).json({mensaje: 'Faltan datos'});
        }
        const nuevoImprevistoId = await crearImprevisto({idUsuarioReporta,idInventarioProducto,descripcion,cantidad,idUnidadMedida}); //llama la funcion del modelo. el nombre de los datos debe coincidir con el del modelo
        res.status(201).json({mensaje:'Imprevisto registrado con éxito',nuevoImprevistoId});//devuelve el id del nuevo imprevisto para confirmar
    }catch(err){
        console.error('Error en nuevoImprevistoController:', err);
        res.status(500).json({//error del servidor
            mensaje: err.message || 'Error en el servidor'
        });
    }
};

//--------------------- CONSULTA DE IMPREVISTO -----------------------------------------
// Controlador para la busqueda o consulta de imprevistos. 
export const consultaImprevistoController = async (req,res) => { //crea la funcion asincrona que maneja la solicitud y la respuesta
    const {filtro = null, busqueda = null} = req.query; //extrae los datos del cuerpo de la solicitud

    try{ // ejecuta el bloque de codigo y captura errores
        const resultados = await listarImprevisto(filtro,busqueda); //llama a la funcion del modelo para obtener el imprevisto solicitado
        //console.log("Resultados imprevistos: -controlador: ", resultados);
        if (resultados.length === 0) { //si no se encuentra hay error
            return res.status(404).json({ mensaje: 'No se encontraron imprevistos.' });
        }

        res.status(200).json({mensaje:'Imprevistos disponibles',resultados});
    } catch(err){//manejo de errores
        console.error('Error al consultar imprevistos:',err);
        res.status(500).json({//error del servidor
            mensaje: err.message || 'Error con la solicitud'
        });
    }
};

