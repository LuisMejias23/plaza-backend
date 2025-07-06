const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Asegúrate de que el path a tu modelo User sea correcto

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // No permitir que un admin se elimine a sí mismo si es el admin logueado
    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('No puedes eliminar tu propia cuenta de administrador.');
    }

    await user.deleteOne();
    res.json({ message: 'Usuario eliminado' });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password'); // Excluir la contraseña
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

 if (user) {
   
  user.username = req.body.username ?? user.username;
  user.email = req.body.email ?? user.email;

  // Solo permitir cambiar el rol si el usuario logueado es admin
  if (req.user.role === 'admin') {
    if (user._id.toString() === req.user._id.toString()) {
      if (req.body.role === 'user') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          res.status(400);
          throw new Error('No puedes quitarte el rol de administrador si eres el único administrador.');
        }
      }
    }
    user.role = req.body.role ?? user.role;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    role: updatedUser.role,
  });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

module.exports = {
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};