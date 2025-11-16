import { obtenerPerfilPorId } from '../Models/perfilModelo.js';

/**
 * Controlador para obtener el perfil del usuario autenticado.
 * Asume que `authMiddleware` ya ha verificado al usuario
 * y ha adjuntado la información del usuario (incluyendo ID) a `req.user`.
 */
export const getPerfilUsuario = async (req, res) => {
    try {
        // 1. Obtenemos el ID del usuario desde `req.user` (adjuntado por authMiddleware)
        // Usamos req.user.id, que coincide con tu authMiddleware
        const idUsuario = req.user.id;

        if (!idUsuario) {
            // Esta comprobación es por si acaso el middleware no adjuntó el id
            return res.status(401).json({ mensaje: 'No autorizado - ID de usuario no encontrado' });
        }

        // 2. Llamamos a la función del modelo que busca por ID
        const perfil = await obtenerPerfilPorId(idUsuario);

        if (!perfil) {
            return res.status(404).json({ mensaje: 'Perfil de usuario no encontrado' });
        }

        // 3. Envía la información del perfil como JSON
        // (Esto incluye nombre, username, rolDescripcion y rolNombre)
        res.json(perfil);

    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};