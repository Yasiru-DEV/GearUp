import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';


export const getCartByCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const cart = await Cart.findOne({ customer: customerId }).populate('items.product');
  if (!cart) return res.json({ items: [] });
  res.json(cart);
});


export const addOrUpdateCartItem = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(e => e.msg).join(', '));
  }

  const customerId = req.params.customerId;
  const { productId, qty } = req.body;

  const customer = await Customer.findById(customerId);
  if (!customer) { res.status(404); throw new Error('Customer not found'); }

  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  let cart = await Cart.findOne({ customer: customerId });
  if (!cart) {
    cart = new Cart({ customer: customerId, items: [] });
  }

  const existingIndex = cart.items.findIndex(i => i.product.toString() === productId);
  if (existingIndex > -1) {

    cart.items[existingIndex].qty = qty;
    cart.items[existingIndex].price = product.price;
  } else {
    cart.items.push({ product: productId, qty, price: product.price });
  }

  cart.updatedAt = Date.now();
  await cart.save();
  await cart.populate('items.product');

  res.status(200).json(cart);
});


export const removeCartItem = asyncHandler(async (req, res) => {
  const { customerId, productId } = req.params;

  let cart = await Cart.findOne({ customer: customerId });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }

  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  cart.updatedAt = Date.now();
  await cart.save();
  await cart.populate('items.product');

  res.json(cart);
});


export const clearCart = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const cart = await Cart.findOne({ customer: customerId });
  if (!cart) return res.status(200).json({ message: 'Cart cleared' });

  cart.items = [];
  cart.updatedAt = Date.now();
  await cart.save();
  res.json({ message: 'Cart cleared' });
});
