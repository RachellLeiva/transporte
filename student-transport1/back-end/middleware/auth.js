// back-end/middleware/auth.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

module.exports = async (req, res, next) => {
  // 1) Extraer token
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ msg: 'No autorizado' });

  const token = header.split(' ')[1];

  try {
    // 2) Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3) Traer usuario de la BD para obtener rol real
    const user = await User.findById(decoded.id).select('role');
    if (!user) return res.status(401).json({ msg: 'Usuario no existe' });

    // 4) Adjuntar a req.user
    req.user = {
      id: decoded.id,
      role: user.role
    };

    next();
  } catch (err) {
    console.error('auth middleware error:', err);
    return res.status(401).json({ msg: 'Token inválido' });
  }
};
