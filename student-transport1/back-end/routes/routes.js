// back-end/routes/routes.js
const express = require('express');
const auth    = require('../middleware/auth');
const Route   = require('../models/Route');
const Student = require('../models/Student');

const router = express.Router();

// GET /api/routes
// ⇒ Admin y finance ven todas las rutas
router.get('/', auth, async (req, res) => {
  if (!['admin','finance'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'No autorizado' });
  }
  try {
    const routes = await Route.find()
      .populate('stops.student', 'name address')
      .sort('-createdAt');
    res.json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener rutas' });
  }
});

// POST /api/routes
// ⇒ Admin y finance crean ruta
router.post('/', auth, async (req, res) => {
  if (!['admin','finance'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'No autorizado' });
  }
  const { name, stops } = req.body;
  try {
    const route = new Route({
      name,
      stops,            // [{ time, student, address }, …]
      createdBy: req.user.id
    });
    await route.save();
    const pop = await route
      .populate('stops.student', 'name address')
      .execPopulate();
    res.status(201).json(pop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear ruta' });
  }
});

// UPDATE
router.put('/:id', auth, async (req, res) => {
  const upd = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('stops.student', 'name address serviceType');
  res.json(upd);
});
// DELETE /api/routes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Ruta eliminada' });
  } catch (err) {
    console.error('Error eliminando ruta:', err);
    res.status(500).json({ msg: 'Error eliminando ruta' });
  }
});

module.exports = router;
