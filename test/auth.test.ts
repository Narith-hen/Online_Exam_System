/// <reference types="jest" />
import request from 'supertest';
import app from '../src/server';

describe('Auth routes', () => {
  it('POST /api/teachers/login rejects missing credentials', async () => {
    const res = await request(app)
      .post('/api/teachers/login')
      .send({});

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Username, email, and password are required.',
    );
  });
});
