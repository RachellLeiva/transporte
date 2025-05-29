// back-end/routes/auth.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const auth    = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email ya registrado' });
    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, phone, email, password: hashed });
    await user.save();
    res.status(201).json({ msg: 'Registrado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al registrar' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
});

// GET logged-in user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener usuario' });
  }
});

// UPDATE logged-in user (name, phone, email, serviceType)
router.put('/me', auth, async (req, res) => {
  try {
    const { name, phone, email, serviceType } = req.body;
    const updates = {};
    if (name)        updates.name = name;
    if (phone)       updates.phone = phone;
    if (email)       updates.email = email;
    if (serviceType) updates.serviceType = serviceType;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar usuario' });
  }
});

module.exports = router;
