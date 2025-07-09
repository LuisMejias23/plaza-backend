import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @route   GET /api/users/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'cart.product',
    'name price imageUrl countInStock'
  );

  if (user) {
    res.json(user.cart);
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Añadir/Actualizar producto en el carrito del usuario
// @route   POST /api/users/cart
// @access  Private
const addOrUpdateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  if (!product) {
    res.status(404);
    throw new Error('Producto no encontrado');
  }

  if (product.countInStock < quantity) {
    res.status(400);
    throw new Error(`Cantidad solicitada (${quantity}) excede el stock disponible (${product.countInStock}) para ${product.name}`);
  }

  const itemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    if (quantity === 0) {
      user.cart.splice(itemIndex, 1);
    } else {
      user.cart[itemIndex].quantity = quantity;
    }
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();

  const updatedUser = await User.findById(req.user._id).populate(
    'cart.product',
    'name price imageUrl countInStock'
  );
  res.status(200).json(updatedUser.cart);
});

// @desc    Eliminar producto del carrito del usuario
// @route   DELETE /api/users/cart/:productId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }

  user.cart = user.cart.filter(
    (item) => item.product.toString() !== productId
  );

  await user.save();

  const updatedUser = await User.findById(req.user._id).populate(
    'cart.product',
    'name price imageUrl countInStock'
  );
  res.status(200).json(updatedUser.cart);
});

// @desc    Vaciar todo el carrito del usuario
// @route   DELETE /api/auth/cart/all
// @access  Private
const clearUserCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.cart = [];
    await user.save();
    res.json(user.cart);
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// --- Lógica de Pedidos ---

// @desc    Crear un nuevo pedido
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
  } = req.body;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400);
    throw new Error('No hay artículos en el pedido');
  }

  if (
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    res.status(400);
    throw new Error('Faltan campos requeridos en la dirección de envío');
  }

  const itemsFromDB = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Producto no encontrado con ID: ${item.product}`);
      }
      if (product.countInStock < item.quantity) {
        res.status(400);
        throw new Error(`Stock insuficiente para el producto: ${product.name}. Disponibles: ${product.countInStock}, Solicitados: ${item.quantity}`);
      }
      return {
        name: product.name,
        quantity: item.quantity,
        imageUrl: product.imageUrl,
        price: product.price,
        product: product._id,
      };
    })
  );

  const itemsPrice = itemsFromDB.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = new Order({
    user: req.user._id,
    orderItems: itemsFromDB,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  for (const item of itemsFromDB) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock -= item.quantity;
      await product.save();
    }
  }

  const user = await User.findById(req.user._id);
  if (user) {
    user.cart = [];
    await user.save();
  }

  res.status(201).json(createdOrder);
});

// @desc    Obtener un pedido por ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'username email')
    .populate('orderItems.product', 'name imageUrl');

  if (order) {
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('No autorizado para ver este pedido');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Pedido no encontrado');
  }
});

// @desc    Actualizar pedido a pagado
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = new Date().toISOString();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Pedido no encontrado');
  }
});

// @desc    Actualizar pedido a entregado (Admin)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date().toISOString();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Pedido no encontrado');
  }
});

// @desc    Obtener todos los pedidos del usuario logueado
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    'orderItems.product',
    'name imageUrl price'
  );
  res.json(orders);
});

// @desc    Obtener todos los pedidos (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id username email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

export {
  getUserCart,
  addOrUpdateCartItem,
  removeCartItem,
  clearUserCart,
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
