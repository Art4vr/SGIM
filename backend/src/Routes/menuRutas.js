// Routes/menuRuta.js
import express from 'express';
import { obtenerPlatillos, obtenerPlatillosPorCategoria } from '../Models/menuModelo.js';

const router = express.Router();

// GET /api/platillos → obtiene todos los platillos
router.get('/', async (req, res) => {
  try {
    const platillos = await obtenerPlatillos();
    res.json(platillos);
  } catch (err) {
    console.error('❌ Error al obtener platillos:', err);
    res.status(500).json({ error: 'Error al obtener platillos' });
  }
});

// GET /api/platillos/:categoria → obtiene por categoría
router.get('/:categoria', async (req, res) => {
  try {
    const platillos = await obtenerPlatillosPorCategoria(req.params.categoria);
    res.json(platillos);
  } catch (err) {
    console.error('❌ Error al obtener por categoría:', err);
    res.status(500).json({ error: 'Error al obtener platillos por categoría' });
  }
});

export default router;
