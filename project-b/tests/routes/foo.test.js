import request from 'supertest';
import app from '../../src/app';

describe('GET /foo', () => {
  it('should return a greeting with name when valid name is provided', async () => {
    const res = await request(app).get('/foo').query({ name: 'John' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Hello, John!');
    expect(res.body).toHaveProperty('age', null);
    expect(res.body).toHaveProperty('details', 'Age not provided');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should return a greeting with name and age when both are provided', async () => {
    const res = await request(app).get('/foo').query({ name: 'John', age: 30 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Hello, John!');
    expect(res.body).toHaveProperty('age', 30);
    expect(res.body).toHaveProperty('details', 'You are 30 years old');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should return a 400 error when name is not provided', async () => {
    const res = await request(app).get('/foo');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Name parameter is required');
  });

  it('should return a 400 error when age is not a valid number', async () => {
    const res = await request(app).get('/foo').query({ name: 'John', age: 'invalid' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Age must be a valid number');
  });
});

describe('POST /foo', () => {
  it('should return confirmation when valid email and preferences are provided', async () => {
    const res = await request(app)
      .post('/foo')
      .send({
        email: 'john@example.com',
        preferences: { theme: 'dark', notifications: true }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Data received successfully');
    expect(res.body).toHaveProperty('user.email', 'john@example.com');
    expect(res.body).toHaveProperty('user.preferences.theme', 'dark');
    expect(res.body).toHaveProperty('user.preferences.notifications', true);
    expect(res.body).toHaveProperty('user.registeredAt');
  });

  it('should return a 400 error when email is not provided', async () => {
    const res = await request(app)
      .post('/foo')
      .send({
        preferences: { theme: 'dark', notifications: true }
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Email is required');
  });

  it('should return a 400 error when preferences is not provided', async () => {
    const res = await request(app)
      .post('/foo')
      .send({
        email: 'john@example.com'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Preferences must be a valid object');
  });

  it('should return a 400 error when preferences is not an object', async () => {
    const res = await request(app)
      .post('/foo')
      .send({
        email: 'john@example.com',
        preferences: 'invalid'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Preferences must be a valid object');
  });
});
