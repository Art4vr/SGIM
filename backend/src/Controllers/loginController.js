import {obtenerUsuario} from '../Models/loginModelo.js';

export const login = async (req,res) => {
    const {username,contrasena} = req.body;

    if (!username?.trim() || !contrasena?.trim()) {
        return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos' });
    }

    try{
        const resultados = await obtenerUsuario(username);
        if (resultados.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const usuario = resultado[0];
        if (usuario.contrasena !== contrasena){
            return res.status(401).json({mensaje: 'Username o Contraseña incorrectos'});
        }
        res.json({
            mensaje:'Inicio de sesión correcto'
        })
    } catch(err){
        console.error('Error al iniciar sesion:',err);
        res.status(500).json({
            mensaje: err.message || 'Error con la solicitud'
        });
    }
};