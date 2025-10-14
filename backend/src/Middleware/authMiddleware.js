import jwt from "jsonwebtoken";

// Middleware de autenticación para verificar el token JWT
export const authMiddleware = (req, res, next) => {
    try{
        // Obtener el token de las cookies o del encabezado Authorization
        const token = req.cookies?.token || (req.headers.authorization?.split(' ')[1]);
        // Si no hay token, responder con un error 401 (No autorizado)
        if (!token){
            return res.status(401).json({
                mensaje:'No autorizado (token faltante)'
            });
        }
        // Verificar y decodificar el token utilizando la clave secreta
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Guardar los datos del usuario (payload) en `req.user` para usarlos en rutas posteriores
        req.user = { id: payload.id, username: payload.username, role: payload.rol }; //{id,username,rol}
        return next(); // Continuar con la siguiente función/middleware
    }catch(err){
        console.error('authMiddleware error:', err.message);
        return res.status(401).json({
            mensaje:'Token invalido o expirado'
        });
    }
};