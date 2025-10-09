//Configuracion del controlador para las categorias de los productos
//Este controlador funciona como la API para las categorias
// El controlador maneja las solicitudes de las rutas (categoriaRutas.js) y se comunica con el modelo (categoriaModelo.js)

import { obtenerCategoria } from '../Models/categoriaModelo.js';

//Obtener categoría para uso en otras tablas
export const listaCategoriasController = async (req, res) => {
  try {
    const categoria = await obtenerCategoria();
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al consultar categorías' });
  }
}

