import express from 'express';
import { body } from 'express-validator';
import { createOrder, getOrderById, getOrdersByCustomer } from '../controllers/orderController.js';

const router = express.Router();


router.post('/:customerId', [
  body('delivery').notEmpty().withMessage('Delivery details required'),
  body('delivery.phone').notEmpty().withMessage('Delivery phone is required')
], createOrder);

router.get('/:id', getOrderById);
router.get('/customer/:customerId', getOrdersByCustomer);

export default router;
