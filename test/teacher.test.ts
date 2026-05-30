/// <reference types="jest" />
import request from 'supertest';
import app from '../src/server';

describe('Teacher exam routes', () => {
  it('GET /api/teachers/exams returns exam list', async () => {
    const res = await request(app).get('/api/teachers/exams');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Exams fetched successfully');
  });
});
