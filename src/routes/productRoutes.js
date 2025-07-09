import { Router } from 'express';
const router = Router();
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Rutas públicas (cualquiera puede ver productos)
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

// Rutas privadas para administradores (crear, actualizar, eliminar)
router.route('/')
  .post(protect, admin, createProduct); // Solo admin puede crear productos

router.route('/:id')
  .put(protect, admin, updateProduct)   // Solo admin puede actualizar productos
  .delete(protect, admin, deleteProduct); // Solo admin puede eliminar productos

export default router;