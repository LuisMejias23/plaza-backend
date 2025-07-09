import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('El usuario o email ya existe');
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({ // Created
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Datos de usuario inválidos');
  }
});

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Email o contraseña inválidos');
  }
});

// @desc    Cerrar sesión de usuario / borrar cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Expira inmediatamente
  });
  res.status(200).json({ message: 'Sesión cerrada exitosamente' });
});

// @desc    Obtener perfil de usuario
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password'); // Excluir la contraseña

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      addresses: user.addresses || [],
      cart: user.cart || [],
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Actualizar perfil de usuario
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
      addresses: updatedUser.addresses || [],
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Añadir una nueva dirección al perfil
// @route   POST /api/auth/profile/address
// @access  Private
const addAddressToProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { address, city, state, postalCode, country } = req.body;
    if (!address || !city || !state || !postalCode || !country) {
      res.status(400);
      throw new Error('Faltan campos requeridos para la dirección.');
    }

    if (!user.addresses) {
      user.addresses = [];
    }
    user.addresses.push({ address, city, state, postalCode, country });
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      addresses: updatedUser.addresses,
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Actualizar una dirección existente
// @route   PUT /api/auth/profile/address/:id
// @access  Private
const updateAddressInProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { id } = req.params;
    const { address, city, state, postalCode, country } = req.body;

    const existingAddress = user.addresses ? user.addresses.id(id) : null;

    if (!existingAddress) {
      res.status(404);
      throw new Error('Dirección no encontrada');
    }

    existingAddress.address = address || existingAddress.address;
    existingAddress.city = city || existingAddress.city;
    existingAddress.state = state || existingAddress.state;
    existingAddress.postalCode = postalCode || existingAddress.postalCode;
    existingAddress.country = country || existingAddress.country;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      addresses: updatedUser.addresses,
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Eliminar una dirección del perfil
// @route   DELETE /api/auth/profile/address/:id
// @access  Private
const deleteAddressFromProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { id } = req.params;

    user.addresses = user.addresses
      ? user.addresses.filter(addr => addr._id && addr._id.toString() !== id)
      : [];

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      addresses: updatedUser.addresses,
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

export {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addAddressToProfile,
  updateAddressInProfile,
  deleteAddressFromProfile,
};
