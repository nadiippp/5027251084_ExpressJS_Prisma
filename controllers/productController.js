const prisma = require('../lib/prisma');

// GET /products - Menampilkan seluruh data produk dari database PostgreSQL
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil data produk',
      error: error.message,
    });
  }
};

// GET /products/:id - Menampilkan satu produk berdasarkan ID
const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        message: 'ID produk harus berupa angka bulat positif',
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan',
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil detail produk',
      error: error.message,
    });
  }
};

// POST /products - Membuat data produk baru
const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || String(name).trim() === '' || price === undefined || price === null || price === '') {
      return res.status(400).json({
        message: 'Name dan price wajib diisi',
      });
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        message: 'Price harus berupa angka yang valid dan tidak boleh negatif',
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        name: String(name).trim(),
        price: parsedPrice,
      },
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal menambahkan produk baru',
      error: error.message,
    });
  }
};

// PUT /products (atau PUT /products/:id) - Mengupdate data produk yang sudah ada
// Body sama dengan POST namun ada tambahan id: { id, name, price }
const updateProduct = async (req, res) => {
  try {
    const rawId = req.body?.id !== undefined ? req.body.id : req.params.id;
    const { name, price } = req.body;

    if (rawId === undefined || rawId === null || rawId === '') {
      return res.status(400).json({
        message: 'ID produk wajib diisi',
      });
    }

    const productId = Number(rawId);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        message: 'ID produk harus berupa angka bulat positif',
      });
    }

    if (!name || String(name).trim() === '' || price === undefined || price === null || price === '') {
      return res.status(400).json({
        message: 'Name dan price wajib diisi',
      });
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        message: 'Price harus berupa angka yang valid dan tidak boleh negatif',
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan',
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: String(name).trim(),
        price: parsedPrice,
      },
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengupdate produk',
      error: error.message,
    });
  }
};

// DELETE /products/:id (atau DELETE /products dengan body { id }) - Menghapus data berdasarkan ID
const deleteProduct = async (req, res) => {
  try {
    const rawId = req.params.id !== undefined ? req.params.id : req.body?.id;

    if (rawId === undefined || rawId === null || rawId === '') {
      return res.status(400).json({
        message: 'ID produk wajib diisi',
      });
    }

    const productId = Number(rawId);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        message: 'ID produk harus berupa angka bulat positif',
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan',
      });
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    return res.status(200).json({
      message: 'Produk berhasil dihapus',
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal menghapus produk',
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
