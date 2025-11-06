import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import Customer from '../models/Customer.js';


export const createCustomer = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(e => e.msg).join(', '));
  }

  const { name, email, phone, address } = req.body;

  let customer = null;
  if (email && phone) {
    customer = await Customer.findOne({ email: email.toLowerCase(), phone: phone.toString() });
  } else if (email) {
    customer = await Customer.findOne({ email: email.toLowerCase() });
  }

  if (customer) {

    let changed = false;
    if (name && customer.name !== name) { customer.name = name; changed = true; }
    if (address && JSON.stringify(customer.address || {}) !== JSON.stringify(address)) { customer.address = address; changed = true; }
    if (changed) await customer.save();
    return res.status(200).json(customer);
  }

  customer = new Customer({ name, email: email ? email.toLowerCase() : undefined, phone, address });
  await customer.save();

  res.status(201).json(customer);
});


export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }
  res.json(customer);
});


export const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  res.json(customers);
});
