import express from 'express';
import { body } from 'express-validator';
import { createCustomer, getCustomerById, getAllCustomers } from '../controllers/customerController.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
  ],
  createCustomer
);

router.get('/:id', getCustomerById);
router.get('/', getAllCustomers);

export default router;
