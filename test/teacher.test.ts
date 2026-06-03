/// <reference types="jest" />
import request from 'supertest';
import app from '../src/server';

describe('Teacher routes', () => {
  it('POST /api/teachers/create rejects invalid email', async () => {
    const res = await request(app)
      .post('/api/teachers/create')
      .send({
        username: 'Sreymao Lin',
        email: 'teacherlita@gmail',
        password: 'Sreymao123',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Please enter a valid email address.');
  });
});
