import { Router } from "express";
import { check } from "express-validator";
import {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addAddressToProfile,
  updateAddressInProfile,
  deleteAddressFromProfile,
} from "../controllers/authController.js";

import {
  getUserCart,
  addOrUpdateCartItem,
  removeCartItem,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

// Rutas públicas
router.post(
  "/register",
  [
    check("username", "El nombre de usuario es requerido").not().isEmpty(),
    check("email", "Por favor, incluye un email válido").isEmail(),
    check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
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

router.post("/logout", logoutUser);

// Rutas privadas
router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Gestión de direcciones
router.route("/profile/address").post(protect, addAddressToProfile);

router.route("/profile/address/:id")
  .put(protect, updateAddressInProfile)
  .delete(protect, deleteAddressFromProfile);

// Carrito del usuario
router.route("/cart")
  .get(protect, getUserCart)
  .post(protect, addOrUpdateCartItem);

router.route("/cart/:productId").delete(protect, removeCartItem);

// Admin: CRUD de usuarios por ID
router.route("/:id")
  .delete(protect, admin)
  .get(protect, admin)
  .put(protect, admin);

// Opcional: solo si quieres tener también el registro acá con GET protegido
// Si no lo necesitas, elimina esta línea
// router.route("/").post(registerUser).get(protect, admin);

export default router;
