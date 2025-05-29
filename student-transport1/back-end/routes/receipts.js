// back-end/routes/receipts.js
const express = require('express');
const multer  = require('multer');
const auth    = require('../middleware/auth');
const Receipt = require('../models/Receipt');

const router = express.Router();

// GET /api/receipts?year=YYYY&month=MM
router.get('/', auth, async (req, res) => {
  try {
    const { year, month } = req.query;
    const receipts = await Receipt.find({
      parent: req.user.id,
      $expr: {
        $and: [
          { $eq: [{ $year: '$date' }, parseInt(year)] },
          { $eq: [{ $month:'$date' }, parseInt(month)] }
        ]
      }
    });
    res.json(receipts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener comprobantes' });
  }
});

module.exports = router;
