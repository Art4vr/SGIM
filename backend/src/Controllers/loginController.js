import {obtenerUsuario} from '../Models/loginModelo.js';

export const loginController = async (req,res) => {
    const {username,password} = req.body;

    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos' });
    }

    try{
        const resultados = await obtenerUsuario(username);
        if (resultados.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const usuario = resultados[0];
        if (usuario.password !== password){
            return res.status(401).json({mensaje: 'Username o Contraseña incorrectos'});
        }
        res.json({
            mensaje:'Inicio de sesión correcto',
            username: usuario.username,
            rol: usuario.Rol_idRol,
            password: usuario.password
        })
    } catch(err){
        console.error('Error al iniciar sesion:',err);
        res.status(500).json({
            mensaje: err.message || 'Error con la solicitud'
        });
    }
};