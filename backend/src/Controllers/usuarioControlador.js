//Configuracion del controlador para usuarios
// El controlador maneja las solicitudes de las rutas (usuarioRutas.js) y se comunica con el modelo (usuarioModelo.js)
//Este controlador funciona como la API para usuarios
//realiza las operaciones CRUD definidas en el modelo 

//importacion de modelos a utilizar
import {obtenerUsuario,crearUsuario} from '../Models/usuarioModelo.js';
import bcrypt from 'bcrypt'; //libreria para encriptar contraseñas

//--------------------- REGISTRO -----------------------------------------
// Controlador para el registro de nuevos usuarios. Valida que el username sea unico y que los campos no esten vacios

export const registerController = async (req,res)=>{//crea la funcion asincrona que maneja la solicitud y la respuesta del registro
    try{
        const {nombre,username,password,rolId} = req.body;//extrae los datos del nuevo usuario del cuerpo de la solicitud

        if(!nombre?.trim() || !username?.trim() || !password?.trim() || !rolId){//valida que los campos no queden vacios
            return res.status(400).json({mensaje: 'Faltan datos'});
        }

        //validaciones adicionales
        if(password.length < 8){
            return res.status(400).json({mensaje: 'La contraseña es demasiado corta. Minimo 8 caracteres'});
        }

        const usernameExistente = await obtenerUsuario(username);//verifica si el usuario ya existe o el username ya esta en uso
        if(usernameExistente.length > 0){
            return res.status(400).json({mensaje: 'El nombre de usuario (username) ya está en uso'});
        }

        const saltRounds = 10; // numero de veces que se aplica el algoritmo de encriptacion para bcrypt

        const passwordHash = await bcrypt.hash(password,saltRounds);//encripta la contraseña de acuerdo al numero de rondas de salting

        const newUserId = await crearUsuario({nombre,username,passwordHash,rolId}); //llama la funcion del modelo. el nombre de los datos debe coincidir con el del modelo

        res.status(201).json({mensaje:'Usuario creado con éxito',newUserId});//devuelve el id del nuevo usuario para confirmar
    }catch(err){
        console.error('Error en registerController:', err);
        res.status(500).json({//error del servidor
            mensaje: err.message || 'Error en el servidor'
        });
    }
};