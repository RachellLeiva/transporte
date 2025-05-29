const express = require('express');
const Student = require('../models/Student');
const auth    = require('../middleware/auth');

const router = express.Router();

// GET all students del padre
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find({ parent: req.user.id });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener estudiantes' });
  }
});

// CREATE student
router.post('/', auth, async (req, res) => {
  try {
    const { name, level, grade, address } = req.body;
    const student = new Student({
      parent:  req.user.id,
      name,
      level,
      grade,
      address
    });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear estudiante' });
  }
});

// UPDATE student
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, level, grade, address } = req.body;
    const updates = { name, level, grade, address };
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar estudiante' });
  }
});

// DELETE student
router.delete('/:id', auth, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Estudiante eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar estudiante' });
  }
});

module.exports = router;
