// plaza-backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController'); // <--- ¡Importa desde el nuevo userController!
const { protect, admin } = require('../middleware/authMiddleware'); // Asegúrate de importar 'admin'

// Rutas para la gestión de usuarios (solo admin)
router.route('/')
  .get(protect, admin, getUsers); // GET /api/users (obtener todos los usuarios)

router.route('/:id')
  .get(protect, admin, getUserById)   // GET /api/users/:id (obtener un usuario por ID)
  .put(protect, admin, updateUser)    // PUT /api/users/:id (actualizar un usuario)
  .delete(protect, admin, deleteUser); // DELETE /api/users/:id (eliminar un usuario)

module.exports = router;