import jwt from "jsonwebtoken";

// Middleware de autenticación para verificar el token JWT
export const authMiddleware = (req, res, next) => {
    try{
        // Obtener el token de las cookies o del encabezado Authorization
        const token = req.cookies?.token || (req.heathers.authorization?.split(' ')[1]);
        // Si no hay token, responder con un error 401 (No autorizado)
        if (!token){
            returnres.status(401).json({
                mensaje:'No autorizado'
            });
        }
        // Verificar y decodificar el token utilizando la clave secreta
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Guardar los datos del usuario (payload) en `req.user` para usarlos en rutas posteriores
        req.user = payload; //{id,username,rol}
        next(); // Continuar con la siguiente función/middleware
    }catch(err){
        return res.status(401).json({
            mensaje:'Token invalido o expirado'
        });
    }
};