// back-end/routes/auth.js
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const User     = require('../models/User');
const auth     = require('../middleware/auth');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// Helpers de correo (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // tu cuenta Gmail
    pass: process.env.EMAIL_PASS    // contraseña de aplicación
  }
});

// REGISTER
router.post('/register', async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Email ya registrado' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, phone, email, password: hashed });
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
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Email no encontrado' });

    // Generar token y expiración (1 hora)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256')
                                 .update(resetToken)
                                 .digest('hex');
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 60*60*1000;
    await user.save();

    // Enviar correo
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Restablece tu contraseña',
      html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña.</p>`
    });

    res.json({ msg: 'Correo de recuperación enviado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'No se pudo enviar el correo' });
  }
});

// RESET PASSWORD
router.post('/reset-password/:resetToken', async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  try {
    const resetTokenHash = crypto.createHash('sha256')
                                 .update(resetToken)
                                 .digest('hex');
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ msg: 'Token inválido o expirado' });

    // Actualizar contraseña y limpiar campos
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ msg: 'Contraseña actualizada con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al restablecer contraseña' });
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

// UPDATE logged-in user
router.put('/me', auth, async (req, res) => {
  try {
    const { name, phone, email, serviceType } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (email) updates.email = email;
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
