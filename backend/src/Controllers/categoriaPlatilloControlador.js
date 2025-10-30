//Configuracion del controlador para las categorias de los platillos
//Este controlador funciona como la API para las categorias
// El controlador maneja las solicitudes de las rutas (categoriaRutas.js) y se comunica con el modelo (categoriaModelo.js)

import { obtenerCategoriaPlatillo } from '../Models/categoriaPlatilloModelo.js';

//Obtener categoría para uso en otras tablas
export const listaCategoriasPlatilloController = async (req, res) => {
  try {
    const categoriaPlatillo = await obtenerCategoriaPlatillo();
    res.json(categoriaPlatillo);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al consultar categorías de platillos' });
  }
}

