// back-end/routes/users.js 
const express = require('express');
const User    = require('../models/User');
const auth    = require('../middleware/auth');

const router = express.Router();

// GET /api/users
// Solo los roles 'parent' o 'padre' quedan bloqueados; cualquiera más (admin, finance, finanzas, etc.) ve todos
router.get('/', auth, async (req, res) => {
  try {
    const role = req.user.role;
    if (role === 'parent' || role === 'padre') {
      return res.status(403).json({ msg: 'No autorizado' });
    }
    // Busca solo usuarios con rol 'parent' en la base
    const parents = await User.find({ role: 'parent' })
      .select('_id name phone');
    return res.json(parents);
  } catch (err) {
    console.error('Error al obtener padres:', err);
    return res.status(500).json({ msg: 'Error al obtener padres' });
  }
});

module.exports = router;
