/// <reference types="jest" />
import request from 'supertest';
import app from '../src/server';

describe('Student routes', () => {
  it('GET /api/students returns module root', async () => {
    const res = await request(app).get('/api/students');
    console.log('Response:', res.status, res.body);
    expect(res.status).toBe(200);
  });
});