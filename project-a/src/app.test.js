const request = require('supertest');
const app = require('./app');

describe('App', () => {
  it('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Welcome to the API' });
  });
});
