/// <reference types="jest" />
import request from 'supertest';
import app from '../src/server';

describe('Student routes', () => {
  it('GET /api/student returns module root', async () => {
    const res = await request(app).get('/api/student');
    console.log('Response:', res.status, res.body);
    expect(res.status).toBe(200);
  });
});