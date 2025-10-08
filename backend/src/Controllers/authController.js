//Importar librerias de encriptacion y de generacion de tokens
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//importar modelo para login, consulta los datos del usuario
import { obtenerUsuario } from '../Models/usuarioModelo.js';

// Función auxiliar para firmar (crear) un token JWT con un payload personalizado y duración
const signToken = (payload) => // payload: objeto con datos del usuario (id, username, rol)
    jwt.sign(payload, process.env.JWT_SECRET, { // process.env.JWT_SECRET: clave secreta usada para firmar el token (debe ser privada)
        expiresIn: process.env.JWT_EXPIRES_IN || '1h' // tiempo que dura el token antes de expirar (por defecto 1 hora)
    });

//--------------------- LOGIN -----------------------------------------
// Controlador para el inicio de sesion. Valida las credenciales ingresadas con respecto a la base de datos

export const loginController = async (req,res) => { //crea la funcion asincrona que maneja la solicitud y la respuesta del login
    const {username,password} = req.body; //extrae el username y la contraseña del cuerpo de la solicitud

    if (!username?.trim() || !password?.trim()) { //valida que los campos no queden vacios
        return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos' }); 
    }

    try{ // ejecuta el bloque de codigo y captura errores
        //const {username,password} = req.body;
        const resultados = await obtenerUsuario(username); //llama a la funcion del modelo para obtener el usuario
        if (resultados.length === 0) { //si no se encuentra al usuario hay error
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const usuario = resultados[0];//toma el primer resultado (deberia ser el unico)
        const match = await bcrypt.compare(password,usuario.password);//compara la contraseña ingresada con la almacenada (encriptada)

        if (!match){//si no hay coincidencia hay error
            return res.status(401).json({mensaje: 'Username o Contraseña incorrectos'});
        }

        // Si todo es correcto, genera el token JWT con los datos del usuario
        const token = signToken({
            id: usuario.idUsuario,
            username: usuario.username,
            rol: usuario.Rol_idRol 
        });

        // Establece el token en una cookie segura y HTTP-only (no accesible desde JavaScript del navegador)
        res.cookie('token',token,{
            httpOnly: true, //No es accesible desde JavaScript en el navegador
            secure: process.env.NODE_ENV === 'production', //solo si estás en producción y usas HTTPS.
            sameSite: 'strict',//Evita que se envíe la cookie en solicitudes de otros sitios (previene CSRF).
            maxAge: 1000 * 60 * 60 //la duración de la cookie (en milisegundos) - 1 hora
        });

        res.json({ //si todo es correcto devuelve el usuario
            mensaje:'Inicio de sesión correcto',
            username: usuario.username,
            rol: usuario.Rol_idRol
        });
    } catch(err){//manejo de errores
        console.error('Error al iniciar sesion:',err);
        res.status(500).json({//error del servidor
            mensaje: err.message || 'Error con la solicitud'
        });
    }
};


//--------------------- LOGOUT -----------------------------------------
// Controlador para cerrar la sesion (elimina la cookie del token)

export const logoutController = (req,res) => {
    res.clearCookie('token',{ //Elimina la cookie llamada token del navegador.
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' //crsf
    });
    res.json({
        mensaje: 'Sesión cerrada'
    });
};


//--------------------- ME CONTROLLER ----------------------------------
// Devuelve la información del usuario autenticado extraída del token

// Función que devuelve los datos del usuario actualmente autenticado.
export const meController = (req, res) => {
    if (!req.user) return res.status(401).json({ mensaje: 'No autenticado: Back authController' });
    res.json({ 
        id: req.user.id, 
        username: req.user.username, 
        rol: req.user.rol });
};