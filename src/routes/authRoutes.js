const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addAddressToProfile, 
  updateAddressInProfile,
  deleteAddressFromProfile,
} = require("../controllers/authController");

const {
  getUserCart,
  addOrUpdateCartItem,
  removeCartItem,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");
const { check } = require("express-validator"); // Para validación de datos

// Rutas públicas
router.post(
  "/register",
  [
    check("username", "El nombre de usuario es requerido").not().isEmpty(),
    check("email", "Por favor, incluye un email válido").isEmail(),
    check(
      "password",
      "La contraseña debe tener al menos 6 caracteres"
    ).isLength({ min: 6 }),
  ],
  registerUser
);
router.post(
  "/login",
  [
    check("email", "Por favor, incluye un email válido").isEmail(),
    check("password", "La contraseña es requerida").not().isEmpty(),
  ],
  authUser
);
router.post("/logout", logoutUser); // <-- ¡Nueva ruta para logout!

// Rutas privadas (requieren autenticación)
router.route('/').post(registerUser).get(protect, admin); // GET /api/users (solo admin)
router.post('/login', authUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// <-- ¡Nuevas rutas para la gestión de direcciones! -->
router.route("/profile/address")
  .post(protect, addAddressToProfile); // Añadir nueva dirección

router.route("/profile/address/:id")
  .put(protect, updateAddressInProfile) // Actualizar dirección existente
  .delete(protect, deleteAddressFromProfile); // Eliminar dirección

// Rutas del carrito (asociadas al usuario)
router
  .route("/cart")
  .get(protect, getUserCart) // Obtener el carrito del usuario
  .post(protect, addOrUpdateCartItem); // Añadir/actualizar item en el carrito

router.route("/cart/:productId").delete(protect, removeCartItem); // Eliminar item del carrito

router
  .route('/:id')
  .delete(protect, admin) // DELETE /api/users/:id (solo admin)
  .get(protect, admin) // GET /api/users/:id (solo admin)
  .put(protect, admin);

module.exports = router;