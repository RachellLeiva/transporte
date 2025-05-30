// back-end/routes/students.js
const express = require('express');
const Student = require('../models/Student');
const auth    = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/students
 * - Rol "parent" → solo sus propios estudiantes
 * - Cualquier otro rol → todos los estudiantes
 */
router.get('/', auth, async (req, res) => {
  try {
    console.log(`[@students] user=${req.user.id} role=${req.user.role}`);
    const query = {};
    // Si el rol ES exactamente "parent", filtramos por parent
    if (req.user.role === 'parent') {
      query.parent = req.user.id;
    }
    const students = await Student.find(query).sort('name');
    return res.json(students);
  } catch (err) {
    console.error('Error al obtener estudiantes:', err);
    return res.status(500).json({ msg: 'Error al obtener estudiantes' });
  }
});

// POST /api/students — crear estudiante
router.post('/', auth, async (req, res) => {
  try {
    const { name, level, grade, address } = req.body;
    const student = new Student({ parent: req.user.id, name, level, grade, address });
    await student.save();
    return res.status(201).json(student);
  } catch (err) {
    console.error('Error al crear estudiante:', err);
    return res.status(500).json({ msg: 'Error al crear estudiante' });
  }
});

// PUT /api/students/:id — actualizar estudiante
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, level, grade, address } = req.body;
    const updates = { name, level, grade, address };
    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    return res.json(student);
  } catch (err) {
    console.error('Error al actualizar estudiante:', err);
    return res.status(500).json({ msg: 'Error al actualizar estudiante' });
  }
});

// DELETE /api/students/:id — eliminar estudiante
router.delete('/:id', auth, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    return res.json({ msg: 'Estudiante eliminado' });
  } catch (err) {
    console.error('Error al eliminar estudiante:', err);
    return res.status(500).json({ msg: 'Error al eliminar estudiante' });
  }
});

module.exports = router;
