// back-end/routes/users.js
const express = require('express')
const User    = require('../models/User')
const auth    = require('../middleware/auth')

const router = express.Router()

/**
 * GET /api/users
 * - Admin → ve TODOS los usuarios
 * - Finance → ve SOLO los parents
 * - Otros roles → 403 Forbidden
 */
router.get('/', auth, async (req, res) => {
  const role = req.user.role

  // Validar permiso
  if (!['admin', 'finance'].includes(role)) {
    return res.status(403).json({ msg: 'No autorizado' })
  }

  try {
    let users
    if (role === 'admin') {
      // Admin ve todo
      users = await User.find()
        .select('_id name email phone address serviceType amount role')
    } else {
      // Finance ve solo padres
      users = await User.find({ role: 'parent' })
        .select('_id name email phone address serviceType amount role')
    }
    return res.json(users)
  } catch (err) {
    console.error('Error al obtener usuarios:', err)
    return res.status(500).json({ msg: 'Error al obtener usuarios' })
  }
})

/**
 * PUT /api/users/:id
 * - Admin o Finance pueden actualizar:
 *   role, serviceType, amount, phone, address
 */
router.put('/:id', auth, async (req, res) => {
  const role = req.user.role
  if (!['admin', 'finance'].includes(role)) {
    return res.status(403).json({ msg: 'No autorizado' })
  }

  const { role: newRole, serviceType, amount, phone, address } = req.body
  try {
    const updates = { phone, address }
    if (newRole)       updates.role         = newRole
    if (serviceType)   updates.serviceType  = serviceType
    if (amount !== undefined) updates.amount = amount

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('_id name email phone address serviceType amount role')

    return res.json(updated)
  } catch (err) {
    console.error('Error al actualizar usuario:', err)
    return res.status(500).json({ msg: 'Error al actualizar usuario' })
  }
})

module.exports = router
