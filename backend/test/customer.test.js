import request from 'supertest';
import app from '../server.js';

describe('Customer API', () => {
  test('validation fails for invalid email/empty name/phone', async () => {
    const res = await request(app).post('/api/customers').send({ name: '', email: 'not-an-email', phone: '' }).expect(400);
    expect(res.body.message || res.text).toMatch(/Name|Valid email|Phone/i);
  });

  test('creates and fetches a customer, and deduplicates based on email/phone', async () => {
    const payload = { name: 'Alice', email: 'alice@example.com', phone: '1234567890' };
    const createRes = await request(app).post('/api/customers').send(payload).expect(201);
    expect(createRes.body._id).toBeDefined();
    expect(createRes.body.email).toBe('alice@example.com');

    const id = createRes.body._id;

    // Create again with same email+phone should return 200 and same id
    const upsertRes = await request(app).post('/api/customers').send({ name: 'Alice Updated', email: 'alice@example.com', phone: '1234567890' }).expect(200);
    expect(upsertRes.body._id).toBe(id);
    expect(upsertRes.body.name).toBe('Alice Updated');

    // Get by id
    const getRes = await request(app).get(`/api/customers/${id}`).expect(200);
    expect(getRes.body.email).toBe('alice@example.com');

    // Get all
    const allRes = await request(app).get('/api/customers').expect(200);
    expect(Array.isArray(allRes.body)).toBe(true);
    expect(allRes.body.find(c => c._id === id)).toBeTruthy();
  });
});
