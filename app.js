require('dotenv/config');
const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON body dari request
app.use(express.json());

// Sambungkan rute products
app.use('/products', productRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
