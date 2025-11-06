import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';


export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});


export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});



export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, imageUrl } = req.body;
  const product = new Product({ name, description, price, stock, category, imageUrl, slug: (name || '').toLowerCase().replace(/\s+/g, '-') });
  await product.save();
  res.status(201).json(product);
});


export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const fields = ['name','description','price','stock','category','imageUrl'];
  fields.forEach(f => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });
  if (req.body.name) product.slug = req.body.name.toLowerCase().replace(/\s+/g, '-');

  await product.save();
  res.json(product);
});


export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  // Mongoose 8 removed `remove()` on documents — use deleteOne() instead
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});
