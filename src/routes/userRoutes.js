// plaza-backend/routes/userRoutes.js

import { Router } from "express";
import userController from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; 
const router = Router();
const { getUsers, deleteUser, getUserById, updateUser } = userController;


// Rutas para la gestión de usuarios (solo admin)
router.route("/").get(protect, admin, getUsers); // GET /api/users (obtener todos los usuarios)

router
  .route("/:id")
  .get(protect, admin, getUserById) // GET /api/users/:id (obtener un usuario por ID)
  .put(protect, admin, updateUser) // PUT /api/users/:id (actualizar un usuario)
  .delete(protect, admin, deleteUser); // DELETE /api/users/:id (eliminar un usuario)

export default router;
