import express from 'express';
import { body } from 'express-validator';
import { getCartByCustomer, addOrUpdateCartItem, removeCartItem, clearCart } from '../controllers/cartController.js';

const router = express.Router();

router.get('/:customerId', getCartByCustomer);
router.post(
  '/:customerId/items',
  [
    body('productId').notEmpty().withMessage('productId is required'),
    body('qty').isInt({ min: 1 }).withMessage('qty must be at least 1'),
  ],
  addOrUpdateCartItem
);
router.delete('/:customerId/items/:productId', removeCartItem);
router.delete('/:customerId', clearCart);

export default router;
