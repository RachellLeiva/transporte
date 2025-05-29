const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const Receipt  = require('../models/Receipt');
const auth     = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const router = express.Router();

// UPLOAD receipt
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { year, month, type } = req.body;
    const amount = type==='both'?120:80;
    const fileUrl = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;
    const receipt = await Receipt.create({ parent: req.user.id, year, month, type, amount, fileUrl });
    res.status(201).json(receipt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al subir comprobante' });
  }
});

// GET receipts
router.get('/', auth, async (req, res) => {
  const recs = await Receipt.find({ parent: req.user.id }).sort('-createdAt');
  res.json(recs);
});

module.exports = router;