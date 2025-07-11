import { Router } from 'express';
const router = Router();
import { addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Rutas para crear y obtener pedidos del usuario logueado
router.route('/')
  .post(protect, addOrderItems) // Crear un nuevo pedido
  .get(protect, admin, getOrders); // Obtener todos los pedidos (solo admin)

router.route('/myorders').get(protect, getMyOrders); // Obtener los pedidos del usuario logueado

router.route('/:id')
  .get(protect, getOrderById); // Obtener un pedido específico por ID

router.route('/:id/pay')
  .put(protect, updateOrderToPaid); // Marcar pedido como pagado

router.route('/:id/deliver')
  .put(protect, admin, updateOrderToDelivered); // Marcar pedido como entregado (solo admin)

export default router;