/// <reference types="jest" />
import request from 'supertest';
import app from '../src/server';

describe('Teacher routes', () => {
  it('GET /api/teacher returns module root', async () => {
    const res = await request(app).get('/api/teacher');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Teacher module root');
  });
});
