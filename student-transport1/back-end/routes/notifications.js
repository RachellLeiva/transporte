// back-end/routes/notifications.js
const express = require('express')
const nodemailer = require('nodemailer')
const User = require('../models/User')
const auth = require('../middleware/auth')
require('dotenv').config()

const router = express.Router()

// POST /api/notifications
// { parentId, year, month }
router.post('/', auth, async (req, res) => {
  // sólo admin o finance pueden notificar
  if (!['admin','finance'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'No autorizado' })
  }

  const { parentId, year, month } = req.body
  try {
    const parent = await User.findById(parentId)
    if (!parent) return res.status(404).json({ msg: 'Padre no encontrado' })

    // configura tu transporte SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT,
      secure: false, // o true si usas 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mailOptions = {
      from: `"Transporte Escolar" <${process.env.EMAIL_USER}>`,
      to: parent.email,
      subject: `Falta comprobante de ${month}/${year}`,
      text: `Hola ${parent.name},\n\nNo hemos recibido tu comprobante de pago para ${month}/${year}. Por favor súbelo lo antes posible.\n\nSaludos,`
    }

    await transporter.sendMail(mailOptions)
    res.json({ msg: 'Correo enviado' })
  } catch (err) {
    console.error('Error enviando notificación:', err)
    res.status(500).json({ msg: 'Error al enviar correo' })
  }
})

module.exports = router
