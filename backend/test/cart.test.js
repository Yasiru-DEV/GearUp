import request from 'supertest';
import app from '../server.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';

describe('Cart API', () => {
  test('add item to cart, update qty, remove item and clear cart', async () => {
    // create product and customer in DB
    const product = await Product.create({ name: 'Cart Prod', price: 5.0, stock: 10 });
    const customer = await Customer.create({ name: 'Cart User', email: 'cart@example.com', phone: '999' });

    // add item
    const addRes = await request(app)
      .post(`/api/carts/${customer._id}/items`)
      .send({ productId: product._id.toString(), qty: 2 })
      .expect(200);
    expect(addRes.body.items.length).toBe(1);
    expect(addRes.body.items[0].qty).toBe(2);

    // update qty
    const updRes = await request(app)
      .post(`/api/carts/${customer._id}/items`)
      .send({ productId: product._id.toString(), qty: 4 })
      .expect(200);
    expect(updRes.body.items[0].qty).toBe(4);

    // remove item
    const remRes = await request(app).delete(`/api/carts/${customer._id}/items/${product._id}`).expect(200);
    expect(Array.isArray(remRes.body.items)).toBe(true);
    expect(remRes.body.items.length).toBe(0);

    // add item again and clear cart
    await request(app).post(`/api/carts/${customer._id}/items`).send({ productId: product._id.toString(), qty: 1 }).expect(200);
    const clrRes = await request(app).delete(`/api/carts/${customer._id}`).expect(200);
    expect(clrRes.body.message).toMatch(/cleared/i);
  });
});
