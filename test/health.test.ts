/// <reference types="jest" />
import request from 'supertest';
import app from '../src/server';

describe('Health endpoint', () => {
  it('responds 200 on GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });
});
