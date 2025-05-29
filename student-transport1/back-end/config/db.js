const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log(`🔗 Conectando a: ${process.env.MONGO_URI}`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;