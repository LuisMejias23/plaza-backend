const asyncHandler = require('express-async-handler');
const Product = require('../models/Product'); // Importar el modelo Product


const getProducts = asyncHandler(async (req, res) => {
  // Implementar búsqueda y paginación aquí en el futuro si es necesario
  const products = await Product.find({}); 
  res.json(products);
});


const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404); 
    throw new Error('Producto no encontrado');
  }
});

// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, imageUrl, category, brand, countInStock } = req.body;

  // Validar que los campos requeridos no estén vacíos
  if (!name || !price || !description || !imageUrl || !category || !brand || countInStock === undefined) {
    res.status(400);
    throw new Error('Por favor, completa todos los campos requeridos para el producto.');
  }

  const product = new Product({
    name: name,
    price: price,
    description: description,
    imageUrl: imageUrl,
    category: category,
    brand: brand,
    countInStock: countInStock,
    // Los campos rating y numReviews se inicializan por defecto en el esquema
    // El campo reviews se inicializa como un array vacío
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct); // 201 Created
});


// @desc    Actualizar un producto existente
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, imageUrl, category, brand, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.imageUrl = imageUrl || product.imageUrl;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};