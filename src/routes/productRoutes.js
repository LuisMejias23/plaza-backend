const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rutas públicas (cualquiera puede ver productos)
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

// Rutas privadas para administradores (crear, actualizar, eliminar)
router.route('/')
  .post(protect, admin, createProduct); // Solo admin puede crear productos

router.route('/:id')
  .put(protect, admin, updateProduct)   // Solo admin puede actualizar productos
  .delete(protect, admin, deleteProduct); // Solo admin puede eliminar productos

module.exports = router;