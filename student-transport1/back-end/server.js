// back-end/server.js
 require('dotenv').config();
 const express   = require('express');
 const cors      = require('cors');
 const connectDB = require('./config/db');

 const app = express();
 connectDB();

 app.use(cors({ origin: process.env.CLIENT_URL }));
 app.use(express.json());
 app.use('/uploads', express.static('uploads'));

 app.use('/api/auth',     require('./routes/auth'));
 app.use('/api/students', require('./routes/students'));
 app.use('/api/receipts', require('./routes/receipts'));
// Nueva ruta para obtener la lista de padres
app.use('/api/users',    require('./routes/users'));

 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => console.log(`🚀 Server en ${PORT}`));
