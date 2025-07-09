import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js'; 

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});  // Usa Product.find()
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);  // Usa Product.findById()

  if (product) {
    res.json(product);
  } else {
    res.status(404); 
    throw new Error('Producto no encontrado');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, imageUrl, category, brand, countInStock } = req.body;

  if (!name || !price || !description || !imageUrl || !category || !brand || countInStock === undefined) {
    res.status(400);
    throw new Error('Por favor, completa todos los campos requeridos para el producto.');
  }

  const product = new Product({
    name,
    price,
    description,
    imageUrl,
    category,
    brand,
    countInStock,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, imageUrl, category, brand, countInStock } = req.body;

  const product = await Product.findById(req.params.id); // Usa Product.findById()

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

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id); // Usa Product.findById()

  if (product) {
    await product.deleteOne();  // Usa el método de instancia
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
