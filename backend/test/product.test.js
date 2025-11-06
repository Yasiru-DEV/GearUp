import request from 'supertest';
import app from '../server.js';
import Product from '../models/Product.js';

describe('Product API', () => {
  test('creates, reads, updates and deletes a product', async () => {
    // Create
    const createRes = await request(app)
      .post('/api/products')
      .send({ name: 'Test Product', price: 9.99, stock: 10, category: 'Test' })
      .expect(201);

    expect(createRes.body._id).toBeDefined();
    expect(createRes.body.name).toBe('Test Product');
    const id = createRes.body._id;

    // Get list
    const listRes = await request(app).get('/api/products').expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.find(p => p._id === id)).toBeTruthy();

    // Get by id
    const getRes = await request(app).get(`/api/products/${id}`).expect(200);
    expect(getRes.body._id).toBe(id);

    // Update
    const updateRes = await request(app)
      .put(`/api/products/${id}`)
      .send({ price: 19.99, name: 'Updated Product' })
      .expect(200);
    expect(updateRes.body.price).toBe(19.99);
    expect(updateRes.body.slug).toBe('updated-product');

    // Delete
    const delRes = await request(app).delete(`/api/products/${id}`);
    if (delRes.status !== 200) {
      // Print server error for debugging
      // eslint-disable-next-line no-console
      console.error('DELETE error response:', delRes.body || delRes.text);
    }
    expect(delRes.status).toBe(200);
    expect(delRes.body.message).toMatch(/removed/i);

    // Ensure removed
    await request(app).get(`/api/products/${id}`).expect(404);
  });

  test('product model validation rejects missing required fields', async () => {
    // missing name
    const p = new Product({ price: 1.0 });
    await expect(p.validate()).rejects.toThrow();
  });
});
