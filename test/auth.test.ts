/// <reference types="jest" />
import request from 'supertest';
import app from '../src/server';

describe('Auth routes', () => {
  it('GET /api/auth returns module root', async () => {
    const res = await request(app).get('/api/auth');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Auth module root');
  });
});
