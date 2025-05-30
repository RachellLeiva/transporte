// back-end/routes/receipts.js
const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const Receipt  = require('../models/Receipt');
const Student  = require('../models/Student');
const auth     = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename:   (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const router = express.Router();

/**
 * POST /api/receipts
 */
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { year, month, type } = req.body;
    const amount = type === 'both' ? 120 : 80;
    const fileUrl = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;
    const receipt = await Receipt.create({
      parent: req.user.id,
      year:   +year,
      month:  +month,
      type,
      amount,
      fileUrl
    });
    return res.status(201).json(receipt);
  } catch (err) {
    console.error('Error al subir comprobante:', err);
    return res.status(500).json({ msg: 'Error al subir comprobante' });
  }
});

/**
 * GET /api/receipts
 */
router.get('/', auth, async (req, res) => {
  try {
    console.log(`[@receipts] user=${req.user.id} role=${req.user.role}`);
    const { year, month } = req.query;
    const query = {};
    if (req.user.role === 'parent') {
      query.parent = req.user.id;
    }
    if (year && year !== 'all')   query.year  = +year;
    if (month && month !== 'all') query.month = +month;

    let recs = await Receipt.find(query)
      .sort('-createdAt')
      .populate('parent', 'name phone');

    // Añadir nombres de hijos
    recs = await Promise.all(
      recs.map(async rec => {
        const studs = await Student.find({ parent: rec.parent._id }).select('name');
        const obj   = rec.toObject();
        obj.studentNames = studs.map(s => s.name);
        return obj;
      })
    );
    return res.json(recs);
  } catch (err) {
    console.error('Error al obtener comprobantes:', err);
    return res.status(500).json({ msg: 'Error al obtener comprobantes' });
  }
});

/**
 * PUT /api/receipts/:id/status
 * Cambia el estado a 'approved' o 'rejected'
 */
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const receipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('parent', 'name phone');
    return res.json(receipt);
  } catch (err) {
    console.error('Error al actualizar estado:', err);
    return res.status(500).json({ msg: 'Error al actualizar estado' });
  }
});

module.exports = router;
