const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  logoutUser, // <-- ¡Importamos logoutUser!
  getUserProfile,
  updateUserProfile,
  addAddressToProfile, // <-- ¡Importamos las funciones de dirección!
  updateAddressInProfile,
  deleteAddressFromProfile,
} = require("../controllers/authController"); // <-- Asegúrate de que authController.js exporta estas funciones

const {
  getUserCart,
  addOrUpdateCartItem,
  removeCartItem,
}
// NOTA: Si `clearCart` es parte de `orderController`, también deberías importarla aquí
// y añadir su ruta si es necesaria para tu flujo de carrito.
 = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
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

module.exports = router;