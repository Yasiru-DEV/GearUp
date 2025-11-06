import request from 'supertest';
import app from '../server.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Cart from '../models/Cart.js';

describe('Order API', () => {
  test('create order from cart and adjust stock, send email stub', async () => {
    const product = await Product.create({ name: 'Order Prod', price: 3.5, stock: 5 });
    const customer = await Customer.create({ name: 'Order User', email: 'order@example.com', phone: '888' });

    // put item into cart
    const cart = new Cart({ customer: customer._id, items: [{ product: product._id, qty: 2, price: product.price }] });
    await cart.save();

    const delivery = { line1: '123 Test St', phone: '888' };
    const res = await request(app).post(`/api/orders/${customer._id}`).send({ delivery }).expect(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.items.length).toBe(1);

    // product stock reduced
    const updated = await Product.findById(product._id);
    expect(updated.stock).toBe(3);

    // cart should be cleared
    const cartAfter = await Cart.findOne({ customer: customer._id });
    expect(cartAfter.items.length).toBe(0);
  });
});
